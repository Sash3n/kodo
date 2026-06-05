import { createSupabaseServerClient } from '$lib/server/supabase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		event.locals.supabase = createSupabaseServerClient(event);
	} catch {
		// Supabase not configured — auth features disabled in this environment
		event.locals.supabase = null as never;
	}

	event.locals.safeGetSession = async () => {
		if (!event.locals.supabase) return { session: null, user: null };
		try {
			const {
				data: { session },
			} = await event.locals.supabase.auth.getSession();
			if (!session) return { session: null, user: null };
			const {
				data: { user },
				error,
			} = await event.locals.supabase.auth.getUser();
			if (error) return { session: null, user: null };
			return { session, user };
		} catch {
			return { session: null, user: null };
		}
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
	});
};
