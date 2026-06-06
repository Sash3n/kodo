import { sanityClient, queries } from '$lib/server/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await sanityClient.fetch(queries.siteSettings);
	return { settings: settings ?? null };
};
