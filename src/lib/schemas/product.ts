import { z } from 'zod';

export const productVariantSchema = z.object({
	sku: z
		.string()
		.regex(
			/^KDO-(HOD|TEE|TRK|JKT|CAP|ACC)-(BLK|WHT|NVY|OLV|OAT|ECR|AMB|GRY)-(XS|S|M|L|XL|XXL)-\d{3}$/
		),
	size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
	colourway: z.enum(['BLK', 'WHT', 'NVY', 'OLV', 'OAT', 'ECR', 'AMB', 'GRY']),
	stock: z.number().int().min(0),
	image: z.string().optional(),
});

export const productSchema = z.object({
	_id: z.string(),
	title: z.string().min(1),
	slug: z.string(),
	sku: z.string(),
	price: z.number().int().min(0),
	compareAtPrice: z.number().int().min(0).optional(),
	images: z.array(z.string()).min(1),
	variants: z.array(productVariantSchema).min(1),
	isLimitedDrop: z.boolean(),
	isFinalSale: z.boolean(),
});

export const orderSchema = z.object({
	orderId: z.string(),
	items: z.array(
		z.object({
			sku: z.string(),
			quantity: z.number().int().positive(),
			price: z.number().int().positive(),
		})
	),
	total: z.number().int().positive(),
	shippingAddress: z.object({
		name: z.string().min(1),
		line1: z.string().min(1),
		line2: z.string().optional(),
		city: z.string().min(1),
		province: z.string().min(1),
		postalCode: z.string().min(4),
	}),
	email: z.string().email(),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
