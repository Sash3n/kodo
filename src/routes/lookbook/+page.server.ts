import type { PageServerLoad } from './$types';
import { sanityClient, queries } from '$lib/server/sanity';

export const load: PageServerLoad = async () => {
	try {
		const images = await sanityClient.fetch(queries.lookbookImages);
		return { images: images ?? [] };
	} catch {
		return { images: [] };
	}
};
