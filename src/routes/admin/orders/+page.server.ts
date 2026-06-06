import { fail } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ locals, url }) => {
	const statusFilter = url.searchParams.get('status') ?? 'all';
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
	const PAGE_SIZE = 25;

	let query = locals.supabase
		.from('orders')
		.select('id, email, status, total_cents, created_at, m_payment_id', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

	if (statusFilter !== 'all') {
		query = query.eq('status', statusFilter);
	}

	const { data: orders, count } = await query;

	return {
		orders: orders ?? [],
		total: count ?? 0,
		page,
		pageSize: PAGE_SIZE,
		statusFilter,
		statuses: ORDER_STATUSES,
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		const status = form.get('status') as string;

		if (!id || !ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
			return fail(400, { error: 'Invalid request' });
		}

		const { error } = await locals.supabase.from('orders').update({ status }).eq('id', id);

		if (error) return fail(500, { error: 'Update failed' });
		return { success: true };
	},
};
