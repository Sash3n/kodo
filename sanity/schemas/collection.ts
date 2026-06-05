import { defineField, defineType } from 'sanity';

export const collection = defineType({
	name: 'collection',
	title: 'Collection',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'type',
			title: 'Type',
			type: 'string',
			options: {
				list: [
					{ title: 'Core (evergreen)', value: 'core' },
					{ title: 'Seasonal Drop', value: 'drop' },
					{ title: 'Collaboration', value: 'collab' },
					{ title: 'Archive', value: 'archive' },
				],
				layout: 'radio',
			},
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'dropNumber',
			title: 'Drop number',
			type: 'number',
			description: 'e.g. 1 for DROP_01',
			hidden: ({ document }) => document?.type !== 'drop',
			validation: (r) => r.integer().min(1),
		}),
		defineField({
			name: 'coverImage',
			title: 'Cover image',
			type: 'image',
			options: { hotspot: true },
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'releaseDate',
			title: 'Release date',
			type: 'datetime',
			description: 'Used for countdown on collection page',
		}),
		defineField({
			name: 'isActive',
			title: 'Active (visible on site)',
			type: 'boolean',
			initialValue: true,
		}),
	],
	preview: {
		select: { title: 'title', type: 'type', media: 'coverImage' },
		prepare({ title, type, media }) {
			const labels: Record<string, string> = {
				core: 'CORE',
				drop: 'DROP',
				collab: 'COLLAB',
				archive: 'ARCHIVE',
			};
			return { title, subtitle: labels[type] ?? type, media };
		},
	},
});
