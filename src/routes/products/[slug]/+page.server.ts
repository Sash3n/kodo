import { fail } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { sanityClient, queries } from '$lib/server/sanity';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;

	const product = await sanityClient.fetch(queries.productBySlug, { slug });

	if (!product) {
		throw error(404, 'Product not found');
	}

	// Load approved reviews for this product
	const { data: reviews } = await locals.supabase
		.from('reviews')
		.select('id, display_name, rating, body, created_at')
		.eq('product_id', product._id)
		.eq('status', 'approved')
		.order('created_at', { ascending: false });

	const { session } = await locals.safeGetSession();

	return {
		product,
		reviews: reviews ?? [],
		isLoggedIn: !!session,
	};
};

export const actions: Actions = {
	submitReview: async ({ request, locals, params }) => {
		const { session, user } = await locals.safeGetSession();

		if (!session || !user) {
			return fail(401, { reviewError: 'You must be signed in to leave a review.' });
		}

		const form = await request.formData();
		const displayName = (form.get('displayName') as string)?.trim();
		const rating = parseInt(form.get('rating') as string, 10);
		const body = (form.get('body') as string)?.trim();

		if (!displayName || displayName.length < 2) {
			return fail(400, { reviewError: 'Display name must be at least 2 characters.' });
		}
		if (isNaN(rating) || rating < 1 || rating > 5) {
			return fail(400, { reviewError: 'Please select a rating.' });
		}
		if (!body || body.length < 10) {
			return fail(400, { reviewError: 'Review must be at least 10 characters.' });
		}
		if (body.length > 2000) {
			return fail(400, { reviewError: 'Review is too long (max 2000 characters).' });
		}

		// Get product ID from Sanity
		const product = await sanityClient.fetch(
			`*[_type == "product" && slug.current == $slug][0]{ _id }`,
			{ slug: params.slug }
		);

		if (!product) return fail(404, { reviewError: 'Product not found.' });

		// Prevent duplicate reviews (one per user per product)
		const { data: existing } = await locals.supabase
			.from('reviews')
			.select('id')
			.eq('product_id', product._id)
			.eq('user_id', user.id)
			.single();

		if (existing) {
			return fail(400, { reviewError: 'You have already reviewed this product.' });
		}

		const { error: insertError } = await locals.supabase.from('reviews').insert({
			product_id: product._id,
			user_id: user.id,
			display_name: displayName,
			rating,
			body,
			status: 'pending',
		});

		if (insertError) {
			return fail(500, { reviewError: 'Failed to submit review. Please try again.' });
		}

		return { reviewSuccess: true };
	},
};
