import { defineField, defineType } from 'sanity';

export const seoMeta = defineType({
	name: 'seoMeta',
	title: 'SEO',
	type: 'object',
	fields: [
		defineField({ name: 'title', type: 'string', title: 'Meta title' }),
		defineField({ name: 'description', type: 'text', title: 'Meta description', rows: 3 }),
		defineField({ name: 'ogImage', type: 'image', title: 'OG image' }),
	],
});
