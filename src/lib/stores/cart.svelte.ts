import type { CartItem, CartState } from '$lib/types/cart';

const FREE_SHIPPING_THRESHOLD = 95000;
const MAX_QUANTITY = 99;

function createCartStore() {
	let items = $state<CartItem[]>([]);

	const total = $derived(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
	const itemCount = $derived(items.reduce((sum, item) => sum + item.quantity, 0));
	const qualifiesForFreeShipping = $derived(total >= FREE_SHIPPING_THRESHOLD);
	const amountToFreeShipping = $derived(
		qualifiesForFreeShipping ? 0 : FREE_SHIPPING_THRESHOLD - total
	);

	function loadFromStorage() {
		if (typeof localStorage === 'undefined') return;
		try {
			const stored = localStorage.getItem('kodo-cart');
			if (stored) items = JSON.parse(stored);
		} catch {
			items = [];
		}
	}

	function saveToStorage() {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem('kodo-cart', JSON.stringify(items));
	}

	function add(item: CartItem) {
		const existing = items.find((i) => i.sku === item.sku);
		if (existing) {
			existing.quantity = Math.min(existing.quantity + item.quantity, MAX_QUANTITY);
		} else {
			items = [...items, { ...item }];
		}
		saveToStorage();
	}

	function remove(sku: string) {
		items = items.filter((i) => i.sku !== sku);
		saveToStorage();
	}

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function updateQuantity(sku: string, quantity: number) {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			if (quantity <= 0) {
				remove(sku);
			} else {
				const item = items.find((i) => i.sku === sku);
				if (item) {
					item.quantity = Math.min(quantity, MAX_QUANTITY);
					saveToStorage();
				}
			}
		}, 500);
	}

	function clear() {
		items = [];
		saveToStorage();
	}

	function getState(): CartState {
		return { items, total, itemCount, qualifiesForFreeShipping, amountToFreeShipping };
	}

	return {
		get items() {
			return items;
		},
		get total() {
			return total;
		},
		get itemCount() {
			return itemCount;
		},
		get qualifiesForFreeShipping() {
			return qualifiesForFreeShipping;
		},
		get amountToFreeShipping() {
			return amountToFreeShipping;
		},
		add,
		remove,
		updateQuantity,
		clear,
		loadFromStorage,
		getState,
	};
}

export const cartStore = createCartStore();
