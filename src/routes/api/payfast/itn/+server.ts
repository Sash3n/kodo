import { json, error } from '@sveltejs/kit';
import { createHash } from 'crypto';
import {
	PAYFAST_MERCHANT_ID,
	PAYFAST_MERCHANT_KEY,
	PAYFAST_PASSPHRASE,
	SUPABASE_SERVICE_ROLE_KEY,
} from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

function verifySignature(data: Record<string, string>, passphrase: string): boolean {
	const { signature, ...rest } = data;
	const params = { ...rest, passphrase };
	const str = Object.entries(params)
		.filter(([, v]) => v !== '')
		.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
		.join('&');
	const expected = createHash('md5').update(str).digest('hex');
	return expected === signature;
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const params = Object.fromEntries(new URLSearchParams(body));

	if (params.merchant_id !== PAYFAST_MERCHANT_ID || params.merchant_key !== PAYFAST_MERCHANT_KEY) {
		throw error(400, 'Invalid merchant');
	}

	if (!verifySignature(params, PAYFAST_PASSPHRASE)) {
		throw error(400, 'Invalid signature');
	}

	if (params.payment_status !== 'COMPLETE') {
		return json({ received: true });
	}

	// Use service role to bypass RLS — this is a trusted server-side webhook
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	// item_description format: "KDO-TEE-BLK-M x1, KDO-HOD-NVY-L x2"
	// custom_str1 carries JSON cart items if we encode them, otherwise parse description
	// We store the raw payment data and reconstruct what we can
	const itemDescription: string = params.item_description ?? '';

	// Parse cart items from item_description: "SKU x QTY, ..."
	const orderItems = itemDescription
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean)
		.map((entry) => {
			const match = entry.match(/^(.+)\s+x(\d+)$/);
			if (!match) return null;
			const [, sku, qty] = match;
			return {
				sku: sku.trim(),
				product_id: '',
				variant_id: sku.trim(),
				name: sku.trim(),
				price_cents: 0,
				quantity: parseInt(qty, 10),
			};
		})
		.filter((i) => i !== null);

	const totalCents = Math.round(parseFloat(params.amount ?? '0') * 100);

	// Upsert order (idempotent — PayFast can retry ITN)
	const { data: order, error: orderErr } = await supabase
		.from('orders')
		.upsert(
			{
				m_payment_id: params.m_payment_id,
				payment_id: params.pf_payment_id,
				status: 'paid',
				email: params.email_address ?? '',
				total_cents: totalCents,
			},
			{ onConflict: 'm_payment_id', ignoreDuplicates: false }
		)
		.select('id')
		.single();

	if (orderErr || !order) {
		console.error('[ITN] order upsert failed', orderErr);
		throw error(500, 'Order save failed');
	}

	if (orderItems.length > 0) {
		// Delete existing items before re-inserting (handles retries cleanly)
		await supabase.from('order_items').delete().eq('order_id', order.id);

		const { error: itemsErr } = await supabase
			.from('order_items')
			.insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

		if (itemsErr) {
			console.error('[ITN] order_items insert failed', itemsErr);
		}
	}

	return json({ received: true });
};
