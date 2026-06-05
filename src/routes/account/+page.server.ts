import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	if (!session) {
		return { session: null, orders: [] };
	}

	// Placeholder — orders will come from DB in future
	return {
		session,
		orders: [] as Array<{
			id: string;
			date: string;
			total: string;
			status: string;
		}>,
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
