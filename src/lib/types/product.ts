export interface ProductVariant {
	sku: string;
	size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	colourway: 'BLK' | 'WHT' | 'NVY' | 'OLV' | 'OAT' | 'ECR' | 'AMB' | 'GRY';
	stock: number;
	image?: string;
}

export interface Product {
	_id: string;
	title: string;
	slug: string;
	sku: string;
	collection: { slug: string; title: string; type: string };
	price: number;
	compareAtPrice?: number;
	images: string[];
	variants: ProductVariant[];
	description: unknown[];
	careInstructions?: string;
	fitNote?: string;
	isLimitedDrop: boolean;
	isFinalSale: boolean;
	publishedAt: string;
}

export interface Collection {
	_id: string;
	title: string;
	slug: string;
	type: 'core' | 'drop' | 'collab' | 'archive';
	coverImage?: string;
	description?: unknown[];
	releaseDate?: string;
	isActive: boolean;
	dropNumber?: number;
}
