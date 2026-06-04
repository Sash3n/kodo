import { describe, it, expect, beforeEach } from 'vitest';
import { cartStore } from './cart.svelte';
import type { CartItem } from '$lib/types/cart';

const mockItem: CartItem = {
	sku: 'KDO-HOD-BLK-L-001',
	productId: 'prod_001',
	variantId: 'var_blk_l',
	name: 'Oversized Hoodie — Black',
	price: 89900,
	quantity: 1,
	image: '/images/hoodie-blk.webp',
	slug: 'oversized-hoodie-black',
};

describe('cartStore', () => {
	beforeEach(() => cartStore.clear());

	it('adds item to cart', () => {
		cartStore.add(mockItem);
		expect(cartStore.items).toHaveLength(1);
	});

	it('merges duplicate SKUs instead of adding new row', () => {
		cartStore.add(mockItem);
		cartStore.add(mockItem);
		expect(cartStore.items).toHaveLength(1);
		expect(cartStore.items[0].quantity).toBe(2);
	});

	it('removes item from cart', () => {
		cartStore.add(mockItem);
		cartStore.remove('KDO-HOD-BLK-L-001');
		expect(cartStore.items).toHaveLength(0);
	});

	it('calculates cart total in cents', () => {
		cartStore.add({ ...mockItem, quantity: 2 });
		expect(cartStore.total).toBe(179800);
	});

	it('flags free shipping when total >= 95000', () => {
		cartStore.add({ ...mockItem, price: 95000, quantity: 1 });
		expect(cartStore.qualifiesForFreeShipping).toBe(true);
	});

	it('does not qualify for free shipping below threshold', () => {
		cartStore.add({ ...mockItem, price: 50000, quantity: 1 });
		expect(cartStore.qualifiesForFreeShipping).toBe(false);
	});
});
