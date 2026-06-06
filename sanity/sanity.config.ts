import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
	seoMeta,
	productVariant,
	product,
	collection,
	lookbookImage,
	siteSettings,
} from './schemas';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
	name: 'kodo-studio',
	title: 'KŌDO Studio',
	projectId,
	dataset,
	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title('KŌDO')
					.items([
						S.listItem()
							.title('Collections')
							.child(S.documentTypeList('collection').title('Collections')),
						S.listItem().title('Products').child(S.documentTypeList('product').title('Products')),
						S.listItem()
							.title('Lookbook')
							.child(S.documentTypeList('lookbookImage').title('Lookbook')),
						S.divider(),
						S.listItem()
							.title('Site Settings')
							.child(
								S.editor().id('siteSettings').schemaType('siteSettings').documentId('siteSettings')
							),
					]),
		}),
		visionTool(),
	],
	schema: {
		types: [seoMeta, productVariant, product, collection, lookbookImage, siteSettings],
	},
});
