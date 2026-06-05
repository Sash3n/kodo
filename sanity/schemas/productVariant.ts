import { defineField, defineType } from 'sanity';

export const productVariant = defineType({
	name: 'productVariant',
	title: 'Product Variant',
	type: 'object',
	fields: [
		defineField({
			name: 'sku',
			title: 'SKU',
			type: 'string',
			description: 'Full SKU — e.g. KDO-HOD-BLK-L-001',
			validation: (r) =>
				r
					.required()
					.regex(
						/^KDO-(HOD|TEE|TRK|JKT|CAP|ACC)-(BLK|WHT|NVY|OLV|OAT|ECR|AMB|GRY)-(XS|S|M|L|XL|XXL)-\d{3}$/,
						{ name: 'SKU format', invert: false }
					),
		}),
		defineField({
			name: 'size',
			title: 'Size',
			type: 'string',
			options: { list: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'colourway',
			title: 'Colourway',
			type: 'string',
			options: { list: ['BLK', 'WHT', 'NVY', 'OLV', 'OAT', 'ECR', 'AMB', 'GRY'] },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'stock',
			title: 'Stock (units)',
			type: 'number',
			validation: (r) => r.required().min(0).integer(),
		}),
		defineField({
			name: 'image',
			title: 'Variant image override',
			type: 'image',
			options: { hotspot: true },
		}),
	],
	preview: {
		select: { title: 'sku', subtitle: 'stock' },
		prepare({ title, subtitle }) {
			return { title, subtitle: `${subtitle} in stock` };
		},
	},
});
