import { json, error } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { sanityClient } from '$lib/server/sanity';
import { sendRestockAlert } from '$lib/server/email/sendRestockAlert';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw error(401, 'Unauthorized');

	// Verify admin
	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();
	if (profile?.role !== 'admin') throw error(403, 'Forbidden');

	const { variantSku, productId } = await request.json();
	if (!variantSku || !productId) throw error(400, 'Missing params');

	// Use service role to read/update restock_requests (bypasses RLS)
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	const { data: requests } = await supabase
		.from('restock_requests')
		.select('id, email')
		.eq('variant_sku', variantSku)
		.eq('notified', false);

	if (!requests?.length) return json({ sent: 0 });

	// Get product slug from Sanity
	const product = await sanityClient.fetch<{ title: string; slug: string }>(
		`*[_type == "product" && _id == $id][0]{ title, "slug": slug.current }`,
		{ id: productId }
	);

	if (!product) throw error(404, 'Product not found');

	let sent = 0;
	for (const req of requests) {
		try {
			await sendRestockAlert({
				email: req.email,
				productTitle: product.title,
				variantSku,
				productSlug: product.slug,
			});
			await supabase
				.from('restock_requests')
				.update({ notified: true, notified_at: new Date().toISOString() })
				.eq('id', req.id);
			sent++;
		} catch (err) {
			console.error('[restock] email failed for', req.email, err);
		}
	}

	return json({ sent });
};
