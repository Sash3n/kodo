import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const statusFilter = url.searchParams.get('status') ?? 'pending';

	const { data: reviews } = await locals.supabase
		.from('reviews')
		.select('id, product_id, display_name, rating, body, status, created_at')
		.eq('status', statusFilter)
		.order('created_at', { ascending: false });

	return { reviews: reviews ?? [], statusFilter };
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Missing id' });

		const { error } = await locals.supabase
			.from('reviews')
			.update({ status: 'approved' })
			.eq('id', id);

		if (error) return fail(500, { error: 'Update failed' });
		return { success: true };
	},

	reject: async ({ request, locals }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Missing id' });

		const { error } = await locals.supabase
			.from('reviews')
			.update({ status: 'rejected' })
			.eq('id', id);

		if (error) return fail(500, { error: 'Update failed' });
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Missing id' });

		const { error } = await locals.supabase.from('reviews').delete().eq('id', id);

		if (error) return fail(500, { error: 'Delete failed' });
		return { success: true };
	},
};
