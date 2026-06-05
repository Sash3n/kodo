import { defineField, defineType } from 'sanity';

export const lookbookImage = defineType({
	name: 'lookbookImage',
	title: 'Lookbook Image',
	type: 'document',
	fields: [
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'caption',
			title: 'Caption',
			type: 'string',
		}),
		defineField({
			name: 'photographer',
			title: 'Photographer',
			type: 'string',
		}),
		defineField({
			name: 'collection',
			title: 'Associated collection',
			type: 'reference',
			to: [{ type: 'collection' }],
		}),
		defineField({
			name: 'publishedAt',
			title: 'Published at',
			type: 'datetime',
		}),
		defineField({
			name: 'span',
			title: 'Grid span',
			type: 'string',
			options: { list: ['1x1', '1x2', '2x1', '2x2'], layout: 'radio' },
			initialValue: '1x1',
		}),
	],
	preview: {
		select: { media: 'image', caption: 'caption' },
		prepare({ media, caption }) {
			return { title: caption ?? 'Lookbook image', media };
		},
	},
});
