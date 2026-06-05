import { json, error } from '@sveltejs/kit';
import { createHash } from 'crypto';
import { PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE } from '$env/static/private';
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

	// Validate merchant credentials
	if (params.merchant_id !== PAYFAST_MERCHANT_ID || params.merchant_key !== PAYFAST_MERCHANT_KEY) {
		throw error(400, 'Invalid merchant');
	}

	// Verify signature
	if (!verifySignature(params, PAYFAST_PASSPHRASE)) {
		throw error(400, 'Invalid signature');
	}

	// Only process complete payments
	if (params.payment_status !== 'COMPLETE') {
		return json({ received: true });
	}

	// TODO: update order status in Supabase, decrement stock
	// await supabase.from('orders').update({ status: 'paid' }).eq('payment_id', params.m_payment_id)

	return json({ received: true });
};
