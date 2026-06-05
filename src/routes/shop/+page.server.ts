import type { PageServerLoad } from './$types';
import { sanityClient, queries } from '$lib/server/sanity';

export const load: PageServerLoad = async () => {
	try {
		const products = await sanityClient.fetch(queries.allProducts);
		return { products: products ?? [] };
	} catch {
		return { products: [] };
	}
};
