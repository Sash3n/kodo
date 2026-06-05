import { defineField, defineType } from 'sanity';

export const product = defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	groups: [
		{ name: 'details', title: 'Details', default: true },
		{ name: 'media', title: 'Media' },
		{ name: 'variants', title: 'Variants & Stock' },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			group: 'details',
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			group: 'details',
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'sku',
			title: 'Base SKU',
			type: 'string',
			description: 'Base SKU without size — e.g. KDO-HOD-BLK',
			group: 'details',
			validation: (r) =>
				r.required().regex(/^KDO-(HOD|TEE|TRK|JKT|CAP|ACC)-(BLK|WHT|NVY|OLV|OAT|ECR|AMB|GRY)$/, {
					name: 'Base SKU format',
				}),
		}),
		defineField({
			name: 'collection',
			title: 'Collection',
			type: 'reference',
			to: [{ type: 'collection' }],
			group: 'details',
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'price',
			title: 'Price (ZAR cents)',
			type: 'number',
			description: 'Store in cents — R899 = 89900',
			group: 'details',
			validation: (r) => r.required().min(0).integer(),
		}),
		defineField({
			name: 'compareAtPrice',
			title: 'Compare-at price (ZAR cents)',
			type: 'number',
			description: 'Original price for sale display',
			group: 'details',
			validation: (r) => r.min(0).integer(),
		}),
		defineField({
			name: 'fitNote',
			title: 'Fit note',
			type: 'string',
			description: 'e.g. "Oversized — size up 1–2 from standard"',
			group: 'details',
		}),
		defineField({
			name: 'careInstructions',
			title: 'Care instructions',
			type: 'text',
			rows: 3,
			group: 'details',
		}),
		defineField({
			name: 'isLimitedDrop',
			title: 'Limited drop?',
			type: 'boolean',
			initialValue: false,
			group: 'details',
		}),
		defineField({
			name: 'isFinalSale',
			title: 'Final sale? (no returns)',
			type: 'boolean',
			initialValue: false,
			group: 'details',
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
			group: 'details',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'details',
		}),
		defineField({
			name: 'images',
			title: 'Images',
			type: 'array',
			of: [{ type: 'image', options: { hotspot: true } }],
			group: 'media',
			validation: (r) => r.required().min(1),
		}),
		defineField({
			name: 'variants',
			title: 'Variants',
			type: 'array',
			of: [{ type: 'productVariant' }],
			group: 'variants',
			validation: (r) => r.required().min(1),
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seoMeta',
			group: 'seo',
		}),
	],
	preview: {
		select: {
			title: 'title',
			sku: 'sku',
			media: 'images.0',
			price: 'price',
		},
		prepare({ title, sku, media, price }) {
			return {
				title,
				subtitle: `${sku} · R${((price ?? 0) / 100).toFixed(2)}`,
				media,
			};
		},
	},
	orderings: [
		{
			title: 'Published, newest',
			name: 'publishedAtDesc',
			by: [{ field: 'publishedAt', direction: 'desc' }],
		},
		{ title: 'Price, lowest', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
	],
});
