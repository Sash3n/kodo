// Recently viewed products — localStorage, max 8 items, most recent first

const STORAGE_KEY = 'kodo-recently-viewed';
const MAX_ITEMS = 8;

export interface RecentProduct {
	productId: string;
	slug: string;
	title: string;
	price: number;
	image: string | null;
	viewedAt: number; // unix ms
}

function createRecentlyViewedStore() {
	let items = $state<RecentProduct[]>([]);

	function load() {
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
			// ignore
		}
	}

	function track(product: Omit<RecentProduct, 'viewedAt'>) {
		items = [
			{ ...product, viewedAt: Date.now() },
			...items.filter((i) => i.productId !== product.productId),
		].slice(0, MAX_ITEMS);
		persist();
	}

	return {
		get items() {
			return items;
		},
		load,
		track,
	};
}

export const recentlyViewed = createRecentlyViewedStore();
