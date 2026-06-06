import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		return { session: null, orders: [] };
	}

	const { data: orders } = await locals.supabase
		.from('orders')
		.select(
			`
			id, status, total_cents, created_at,
			order_items ( sku, name, quantity, price_cents )
		`
		)
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.limit(20);

	return {
		session,
		orders: orders ?? [],
	};
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		if (!email) {
			return fail(400, { error: 'Email is required' });
		}

		const { error } = await locals.supabase.auth.signInWithOtp({ email });

		if (error) {
			return fail(500, { error: error.message });
		}

		return { success: true };
	},

	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		return { success: true };
	},
};
