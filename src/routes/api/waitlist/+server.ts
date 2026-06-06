import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { email, collectionId } = await request.json();

	if (!email || typeof email !== 'string' || !email.includes('@')) {
		return json({ error: 'Valid email required' }, { status: 400 });
	}
	if (!collectionId || typeof collectionId !== 'string') {
		return json({ error: 'Collection ID required' }, { status: 400 });
	}

	const { error } = await locals.supabase.from('waitlist').insert({
		collection_id: collectionId,
		email: email.toLowerCase().trim(),
	});

	if (error?.code === '23505') {
		// Already on waitlist — return success to avoid email enumeration
		return json({ ok: true });
	}

	if (error) {
		console.error('[waitlist] insert failed', error);
		return json({ error: 'Failed to join waitlist' }, { status: 500 });
	}

	return json({ ok: true });
};
