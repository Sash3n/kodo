import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const ORDER_STATUSES = [
	'pending',
	'paid',
	'processing',
	'shipped',
	'delivered',
	'cancelled',
	'refunded',
] as const;

export const load: PageServerLoad = async ({ locals, params }) => {
	const { data: order } = await locals.supabase
		.from('orders')
		.select(
			`
			id, email, status, total_cents, created_at, updated_at,
			m_payment_id, payment_id, shipping_name, shipping_address, notes
		`
		)
		.eq('id', params.id)
		.single();

	if (!order) throw error(404, 'Order not found');

	const { data: items } = await locals.supabase
		.from('order_items')
		.select('id, sku, name, price_cents, quantity')
		.eq('order_id', params.id);

	return {
		order,
		items: items ?? [],
		statuses: ORDER_STATUSES,
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals, params }) => {
		const form = await request.formData();
		const status = form.get('status') as string;
		const notes = form.get('notes') as string;

		if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
			return fail(400, { error: 'Invalid status' });
		}

		const { error: err } = await locals.supabase
			.from('orders')
			.update({ status, notes: notes || null })
			.eq('id', params.id);

		if (err) return fail(500, { error: 'Update failed' });
		return { success: true };
	},
};
