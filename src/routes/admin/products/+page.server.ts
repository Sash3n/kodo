import { fail } from '@sveltejs/kit';
import { sanityClient, queries } from '$lib/server/sanity';
import { SANITY_API_TOKEN } from '$env/static/private';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const products = await sanityClient.fetch(queries.allProducts);
	return { products: products ?? [] };
};

export const actions: Actions = {
	updateStock: async ({ request }) => {
		const form = await request.formData();
		const productId = form.get('productId') as string;
		const variantSku = form.get('variantSku') as string;
		const stock = parseInt(form.get('stock') as string, 10);

		if (!productId || !variantSku || isNaN(stock) || stock < 0) {
			return fail(400, { error: 'Invalid input' });
		}

		try {
			const client = sanityClient.withConfig({ token: SANITY_API_TOKEN });

			// Fetch current variants, update the target, write back
			const product = await client.fetch<{ variants: Array<{ sku: string; stock: number }> }>(
				`*[_type == "product" && _id == $id][0]{ variants }`,
				{ id: productId }
			);

			if (!product?.variants) return fail(404, { error: 'Product not found' });

			const updatedVariants = product.variants.map((v) =>
				v.sku === variantSku ? { ...v, stock } : v
			);

			await client.patch(productId).set({ variants: updatedVariants }).commit();
		} catch (err) {
			console.error('[admin/products] Sanity patch failed', err);
			return fail(500, { error: 'Stock update failed' });
		}

		return { success: true };
	},
};
