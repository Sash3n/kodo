import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { email, productId, variantSku } = await request.json();

	if (!email?.includes('@') || !productId || !variantSku) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const { error } = await locals.supabase.from('restock_requests').insert({
		email: email.toLowerCase().trim(),
		product_id: productId,
		variant_sku: variantSku,
	});

	if (error?.code === '23505') return json({ ok: true }); // already registered — silent
	if (error) return json({ error: 'Failed to register' }, { status: 500 });

	return json({ ok: true });
};
