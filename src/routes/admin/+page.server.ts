import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	const [ordersResult, reviewsResult, recentOrdersResult] = await Promise.all([
		// Order counts by status
		supabase.from('orders').select('status'),

		// Pending reviews count
		supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),

		// 5 most recent orders
		supabase
			.from('orders')
			.select('id, email, status, total_cents, created_at')
			.order('created_at', { ascending: false })
			.limit(5),
	]);

	const orders = ordersResult.data ?? [];
	const orderStats = {
		total: orders.length,
		pending: orders.filter((o) => o.status === 'pending').length,
		paid: orders.filter((o) => o.status === 'paid').length,
		processing: orders.filter((o) => o.status === 'processing').length,
		shipped: orders.filter((o) => o.status === 'shipped').length,
	};

	return {
		orderStats,
		pendingReviews: reviewsResult.count ?? 0,
		recentOrders: recentOrdersResult.data ?? [],
	};
};
