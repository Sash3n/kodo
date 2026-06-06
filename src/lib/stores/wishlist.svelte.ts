// Wishlist store — local-first (localStorage), synced to Supabase when authenticated
// Shape mirrors cart store pattern using Svelte 5 runes

const STORAGE_KEY = 'kodo-wishlist';

interface WishlistItem {
	productId: string; // Sanity _id
	slug: string;
	title: string;
	price: number;
	image: string | null;
}

function createWishlistStore() {
	let items = $state<WishlistItem[]>([]);

	function loadFromStorage() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) items = JSON.parse(raw);
		} catch {
			items = [];
		}
	}

	function persist() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch {
			// storage full — ignore
		}
	}

	function has(productId: string) {
		return items.some((i) => i.productId === productId);
	}

	function toggle(item: WishlistItem) {
		if (has(item.productId)) {
			items = items.filter((i) => i.productId !== item.productId);
		} else {
			items = [...items, item];
		}
		persist();
	}

	function remove(productId: string) {
		items = items.filter((i) => i.productId !== productId);
		persist();
	}

	function clear() {
		items = [];
		persist();
	}

	// Sync local wishlist to Supabase on login (upsert all local items)
	async function syncToSupabase(supabase: Parameters<typeof supabase>[0]) {
		if (items.length === 0) return;
		await supabase.from('wishlists').upsert(
			items.map((i) => ({
				product_id: i.productId,
				slug: i.slug,
			})),
			{ onConflict: 'user_id,product_id', ignoreDuplicates: true }
		);
	}

	// Load from Supabase (replaces local state)
	async function loadFromSupabase(
		supabase: Parameters<typeof supabase>[0],
		sanityFetch: (ids: string[]) => Promise<WishlistItem[]>
	) {
		const { data } = await supabase
			.from('wishlists')
			.select('product_id, slug')
			.order('created_at', { ascending: false });

		if (!data?.length) return;

		const ids = data.map((r: { product_id: string }) => r.product_id);
		const products = await sanityFetch(ids);
		items = products;
		persist();
	}

	return {
		get items() {
			return items;
		},
		get count() {
			return items.length;
		},
		has,
		toggle,
		remove,
		clear,
		loadFromStorage,
		syncToSupabase,
		loadFromSupabase,
	};
}

export const wishlistStore = createWishlistStore();
