import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sanityClient, queries } from '$lib/server/sanity';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const product = await sanityClient.fetch(queries.productBySlug, { slug });

	if (!product) {
		throw error(404, 'Product not found');
	}

	return { product };
};
