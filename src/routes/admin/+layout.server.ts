import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/account');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('role, display_name')
		.eq('id', user.id)
		.single();

	if (profile?.role !== 'admin') {
		throw error(403, 'Admin access required');
	}

	return {
		adminUser: {
			id: user.id,
			email: user.email ?? '',
			displayName: profile.display_name ?? user.email ?? '',
		},
	};
};
