import { sanityClient } from '$lib/server/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: entries } = await locals.supabase
		.from('waitlist')
		.select('id, collection_id, email, notified, created_at')
		.order('created_at', { ascending: false });

	// Group by collection_id and enrich with Sanity titles
	const byCollection: Record<string, { email: string; notified: boolean; created_at: string }[]> =
		{};
	for (const e of entries ?? []) {
		if (!byCollection[e.collection_id]) byCollection[e.collection_id] = [];
		byCollection[e.collection_id].push({
			email: e.email,
			notified: e.notified,
			created_at: e.created_at,
		});
	}

	const collectionIds = Object.keys(byCollection);
	let collectionTitles: Record<string, string> = {};

	if (collectionIds.length > 0) {
		const cols = await sanityClient.fetch<Array<{ _id: string; title: string }>>(
			`*[_type == "collection" && _id in $ids]{ _id, title }`,
			{ ids: collectionIds }
		);
		collectionTitles = Object.fromEntries(cols.map((c) => [c._id, c.title]));
	}

	const groups = collectionIds.map((id) => ({
		collectionId: id,
		title: collectionTitles[id] ?? id,
		entries: byCollection[id],
		count: byCollection[id].length,
	}));

	return { groups, total: (entries ?? []).length };
};
