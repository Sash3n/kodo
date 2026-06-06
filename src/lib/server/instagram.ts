import { INSTAGRAM_ACCESS_TOKEN } from '$env/static/private';

export interface InstagramMedia {
	id: string;
	media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
	media_url: string;
	thumbnail_url?: string; // only for VIDEO
	permalink: string;
	caption?: string;
	timestamp: string;
}

const IG_API = 'https://graph.instagram.com/me/media';

export async function fetchInstagramFeed(limit = 12): Promise<InstagramMedia[]> {
	if (!INSTAGRAM_ACCESS_TOKEN) return [];

	const params = new URLSearchParams({
		fields: 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp',
		limit: String(limit),
		access_token: INSTAGRAM_ACCESS_TOKEN,
	});

	try {
		const res = await fetch(`${IG_API}?${params}`, {
			// Cache for 1 hour — the feed doesn't change that often
			// @ts-expect-error — SvelteKit fetch augmentation
			cf: { cacheTtl: 3600 },
		});

		if (!res.ok) {
			console.error('[instagram] API error', res.status, await res.text());
			return [];
		}

		const json = await res.json();
		return (json.data ?? []) as InstagramMedia[];
	} catch (err) {
		console.error('[instagram] fetch failed', err);
		return [];
	}
}
