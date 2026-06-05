import { redirect, error } from '@sveltejs/kit';
import { PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { Actions } from './$types';
import { createHash } from 'crypto';

function buildPayFastSignature(data: Record<string, string>, passphrase: string): string {
	const params = { ...data, passphrase };
	const str = Object.entries(params)
		.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
		.join('&');
	return createHash('md5').update(str).digest('hex');
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const cartJson = formData.get('cart') as string;

		if (!cartJson) throw error(400, 'No cart data');

		let items: Array<{ sku: string; quantity: number; price: number; name: string }>;
		try {
			items = JSON.parse(cartJson);
		} catch {
			throw error(400, 'Invalid cart data');
		}

		// Validate stock via Supabase (placeholder — real stock check uses DB)
		// In production this would query the `product_variants` table
		if (items.length === 0) throw error(400, 'Cart is empty');

		const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
		const { session } = await locals.safeGetSession();

		const paymentData: Record<string, string> = {
			merchant_id: PAYFAST_MERCHANT_ID,
			merchant_key: PAYFAST_MERCHANT_KEY,
			return_url: `${PUBLIC_SITE_URL}/checkout/success`,
			cancel_url: `${PUBLIC_SITE_URL}/cart`,
			notify_url: `${PUBLIC_SITE_URL}/api/payfast/itn`,
			name_first: '',
			name_last: '',
			email_address: session?.user?.email ?? '',
			m_payment_id: crypto.randomUUID(),
			amount: (total / 100).toFixed(2),
			item_name: `KŌDO Order`,
			item_description: items
				.map((i) => `${i.sku} x${i.quantity}`)
				.join(', ')
				.slice(0, 255),
		};

		paymentData.signature = buildPayFastSignature(paymentData, PAYFAST_PASSPHRASE);

		const payfastUrl = new URL('https://sandbox.payfast.co.za/eng/process');
		Object.entries(paymentData).forEach(([k, v]) => payfastUrl.searchParams.set(k, v));

		redirect(303, payfastUrl.toString());
	},
};

export async function load({ locals }) {
	const { session } = await locals.safeGetSession();
	return { session };
}
