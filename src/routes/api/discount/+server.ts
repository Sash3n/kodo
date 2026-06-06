import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { code, orderCents } = await request.json();

	if (!code || typeof code !== 'string') {
		return json({ valid: false, error: 'Code required' }, { status: 400 });
	}

	const { data: discount } = await locals.supabase
		.from('discount_codes')
		.select('id, code, type, value, min_order_cents, max_uses, uses, expires_at')
		.eq('active', true)
		.ilike('code', code.trim())
		.single();

	if (!discount) {
		return json({ valid: false, error: 'Invalid or expired code' });
	}

	if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
		return json({ valid: false, error: 'This code has expired' });
	}

	if (discount.max_uses !== null && discount.uses >= discount.max_uses) {
		return json({ valid: false, error: 'This code has reached its usage limit' });
	}

	if (orderCents < discount.min_order_cents) {
		const minFormatted = `R${(discount.min_order_cents / 100).toFixed(2)}`;
		return json({ valid: false, error: `Minimum order of ${minFormatted} required` });
	}

	// Calculate discount amount
	let discountCents: number;
	if (discount.type === 'percent') {
		discountCents = Math.floor((orderCents * discount.value) / 100);
	} else {
		discountCents = Math.min(discount.value, orderCents); // fixed — can't exceed order total
	}

	return json({
		valid: true,
		discountId: discount.id,
		code: discount.code,
		type: discount.type,
		value: discount.value,
		discountCents,
	});
};
