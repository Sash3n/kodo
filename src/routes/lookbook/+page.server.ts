import type { PageServerLoad } from './$types';
import { sanityClient, queries } from '$lib/server/sanity';
import { fetchInstagramFeed } from '$lib/server/instagram';

export const load: PageServerLoad = async () => {
	const [images, instagramPosts] = await Promise.all([
		sanityClient.fetch(queries.lookbook).catch(() => []),
		fetchInstagramFeed(12),
	]);

	return {
		images: images ?? [],
		instagramPosts,
	};
};
