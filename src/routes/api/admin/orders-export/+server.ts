import { error } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

function escapeCsv(value: unknown): string {
	if (value === null || value === undefined) return '';
	const str = String(value);
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function row(values: unknown[]): string {
	return values.map(escapeCsv).join(',');
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw error(401, 'Unauthorized');

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();
	if (profile?.role !== 'admin') throw error(403, 'Forbidden');

	const from = url.searchParams.get('from') ?? '';
	const to = url.searchParams.get('to') ?? '';
	const statusFilter = url.searchParams.get('status') ?? '';

	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	let query = supabase
		.from('orders')
		.select(
			`id, email, status, total_cents, discount_cents, discount_code, m_payment_id, created_at,
			order_items(sku, name, quantity, price_cents)`
		)
		.order('created_at', { ascending: false });

	if (from) query = query.gte('created_at', from);
	if (to) query = query.lte('created_at', to + 'T23:59:59Z');
	if (statusFilter) query = query.eq('status', statusFilter);

	const { data: orders } = await query;

	// Flatten into one row per order item
	const lines: string[] = [
		row([
			'Order ID',
			'Date',
			'Email',
			'Status',
			'SKU',
			'Item name',
			'Qty',
			'Item total (R)',
			'Order total (R)',
			'Discount (R)',
			'Discount code',
			'Payment ID',
		]),
	];

	for (const order of orders ?? []) {
		const items =
			(order.order_items as Array<{
				sku: string;
				name: string;
				quantity: number;
				price_cents: number;
			}>) ?? [];
		const orderTotal = (order.total_cents / 100).toFixed(2);
		const discountAmt = (order.discount_cents / 100).toFixed(2);
		const date = new Date(order.created_at).toISOString().slice(0, 10);

		if (items.length === 0) {
			lines.push(
				row([
					order.id,
					date,
					order.email,
					order.status,
					'',
					'',
					'',
					'',
					orderTotal,
					discountAmt,
					order.discount_code ?? '',
					order.m_payment_id ?? '',
				])
			);
		} else {
			for (const item of items) {
				lines.push(
					row([
						order.id,
						date,
						order.email,
						order.status,
						item.sku,
						item.name,
						item.quantity,
						((item.price_cents * item.quantity) / 100).toFixed(2),
						orderTotal,
						discountAmt,
						order.discount_code ?? '',
						order.m_payment_id ?? '',
					])
				);
			}
		}
	}

	const csv = lines.join('\r\n');
	const filename = `kodo-orders-${new Date().toISOString().slice(0, 10)}.csv`;

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`,
		},
	});
};
