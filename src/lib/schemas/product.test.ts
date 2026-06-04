import { describe, it, expect } from 'vitest';
import { productSchema, orderSchema } from './product';

describe('productSchema', () => {
	it('accepts valid product', () => {
		const valid = {
			_id: 'prod_001',
			title: 'Oversized Hoodie',
			slug: 'oversized-hoodie-black',
			sku: 'KDO-HOD-BLK',
			price: 89900,
			images: ['/img/hoodie.webp'],
			variants: [
				{
					sku: 'KDO-HOD-BLK-L-001',
					size: 'L',
					colourway: 'BLK',
					stock: 10,
				},
			],
			isLimitedDrop: false,
			isFinalSale: false,
		};
		expect(() => productSchema.parse(valid)).not.toThrow();
	});

	it('rejects product with no images', () => {
		expect(() => productSchema.parse({ images: [] })).toThrow();
	});
});

describe('orderSchema', () => {
	it('rejects invalid email', () => {
		expect(() => orderSchema.parse({ email: 'not-an-email' })).toThrow();
	});
});
