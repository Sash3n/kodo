import { createClient } from '@sanity/client';
import { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } from '$env/static/public';

export const sanityClient = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2024-01-01',
	useCdn: true,
});

// GROQ queries
export const queries = {
	allCollections: `*[_type == "collection" && isActive == true] | order(dropNumber asc) {
    _id,
    title,
    "slug": slug.current,
    type,
    dropNumber,
    releaseDate,
    "coverImage": coverImage.asset->url,
    description
  }`,

	collectionBySlug: `*[_type == "collection" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    type,
    dropNumber,
    releaseDate,
    isActive,
    "coverImage": coverImage.asset->url,
    description
  }`,

	productsByCollection: `*[_type == "product" && collection->slug.current == $slug] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    sku,
    price,
    compareAtPrice,
    isLimitedDrop,
    isFinalSale,
    fitNote,
    "images": images[].asset->url,
    variants[] {
      sku,
      size,
      colourway,
      stock,
      "image": image.asset->url
    }
  }`,

	productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    sku,
    price,
    compareAtPrice,
    isLimitedDrop,
    isFinalSale,
    fitNote,
    careInstructions,
    description,
    publishedAt,
    "images": images[].asset->url,
    variants[] {
      sku,
      size,
      colourway,
      stock,
      "image": image.asset->url
    },
    "collection": collection-> {
      title,
      "slug": slug.current,
      type
    },
    seo
  }`,

	allProducts: `*[_type == "product"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    sku,
    price,
    compareAtPrice,
    isLimitedDrop,
    isFinalSale,
    "images": images[0..1][].asset->url,
    variants[] {
      sku,
      size,
      colourway,
      stock
    },
    "collection": collection-> {
      title,
      "slug": slug.current,
      type
    }
  }`,

	lookbook: `*[_type == "lookbookImage"] | order(publishedAt desc) {
    _id,
    "image": image.asset->url,
    caption,
    photographer,
    span,
    "collection": collection-> { title, "slug": slug.current }
  }`,

	siteSettings: `*[_type == "siteSettings" && _id == "siteSettings"][0] {
    announcementBar,
    social,
    commerce,
    brand,
    seo
  }`,
};
