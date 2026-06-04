export interface CartItem {
	sku: string;
	productId: string;
	variantId: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
	slug: string;
}

export interface CartState {
	items: CartItem[];
	total: number;
	itemCount: number;
	qualifiesForFreeShipping: boolean;
	amountToFreeShipping: number;
}
