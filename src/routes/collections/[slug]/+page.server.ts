import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { sanityClient, queries } from '$lib/server/sanity';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const [collection, products] = await Promise.all([
		sanityClient.fetch(queries.collectionBySlug, { slug }),
		sanityClient.fetch(queries.productsByCollection, { slug }),
	]);

	if (!collection) {
		throw error(404, 'Collection not found');
	}

	return {
		collection,
		products: products ?? [],
	};
};
