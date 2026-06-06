import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site Settings',
	type: 'document',
	// Singleton — only one document of this type
	__experimental_actions: ['update', 'publish'],
	fields: [
		// ── Announcement bar ──────────────────────────────────
		defineField({
			name: 'announcementBar',
			title: 'Announcement Bar',
			type: 'object',
			fields: [
				defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
				defineField({ name: 'text', title: 'Message', type: 'string' }),
				defineField({
					name: 'link',
					title: 'Link (optional)',
					type: 'url',
					validation: (r) => r.uri({ allowRelative: true }),
				}),
			],
		}),

		// ── Social links ─────────────────────────────────────
		defineField({
			name: 'social',
			title: 'Social Links',
			type: 'object',
			fields: [
				defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
				defineField({ name: 'tiktok', title: 'TikTok URL', type: 'url' }),
				defineField({ name: 'twitter', title: 'X / Twitter URL', type: 'url' }),
				defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
				defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
			],
		}),

		// ── Commerce config ───────────────────────────────────
		defineField({
			name: 'commerce',
			title: 'Commerce',
			type: 'object',
			fields: [
				defineField({
					name: 'freeShippingThresholdCents',
					title: 'Free shipping threshold (ZAR cents)',
					type: 'number',
					description: 'e.g. 95000 = R950. Set to 0 to always show free shipping.',
					validation: (r) => r.integer().min(0),
					initialValue: 95000,
				}),
				defineField({
					name: 'standardShippingCents',
					title: 'Standard shipping cost (ZAR cents)',
					type: 'number',
					validation: (r) => r.integer().min(0),
					initialValue: 8900,
				}),
			],
		}),

		// ── Contact & brand ───────────────────────────────────
		defineField({
			name: 'brand',
			title: 'Brand',
			type: 'object',
			fields: [
				defineField({ name: 'supportEmail', title: 'Support email', type: 'string' }),
				defineField({ name: 'supportPhone', title: 'Support phone', type: 'string' }),
				defineField({
					name: 'address',
					title: 'Business address',
					type: 'text',
					rows: 3,
				}),
			],
		}),

		// ── SEO defaults ──────────────────────────────────────
		defineField({
			name: 'seo',
			title: 'Default SEO',
			type: 'seoMeta',
		}),
	],
	preview: {
		prepare() {
			return { title: 'Site Settings' };
		},
	},
});
