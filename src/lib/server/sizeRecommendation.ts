// Rule-based size recommendation from order history
// SKU format: KDO-[CATEGORY]-[COLOURWAY]-[SIZE]-[SEQ]
// e.g. KDO-HOD-BLK-L-001

const CATEGORY_GROUPS: Record<string, string[]> = {
	tops: ['TEE', 'HOD', 'JKT'],
	bottoms: ['TRK'],
	accessories: ['CAP', 'ACC'],
};

function categoryGroup(category: string): string {
	for (const [group, cats] of Object.entries(CATEGORY_GROUPS)) {
		if (cats.includes(category)) return group;
	}
	return 'other';
}

export interface SizeRecommendation {
	suggestedSize: string;
	confidence: 'high' | 'medium' | 'low';
	reason: string;
}

export function getSizeRecommendation(
	orderItems: Array<{ sku: string; quantity: number }>,
	productCategory: string // e.g. 'HOD'
): SizeRecommendation | null {
	if (!orderItems.length) return null;

	const targetGroup = categoryGroup(productCategory);

	// Parse sizes from SKUs in the same category group
	const sizeCounts: Record<string, number> = {};

	for (const item of orderItems) {
		const parts = item.sku.split('-');
		if (parts.length < 5) continue; // not a valid KDO SKU

		const [, cat, , size] = parts;
		if (categoryGroup(cat) !== targetGroup) continue;

		const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
		if (!validSizes.includes(size)) continue;

		sizeCounts[size] = (sizeCounts[size] ?? 0) + item.quantity;
	}

	if (!Object.keys(sizeCounts).length) return null;

	// Pick most frequently bought size
	const [topSize, count] = Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0];
	const totalItems = Object.values(sizeCounts).reduce((s, n) => s + n, 0);
	const ratio = count / totalItems;

	const confidence: SizeRecommendation['confidence'] =
		ratio >= 0.8 ? 'high' : ratio >= 0.5 ? 'medium' : 'low';

	const groupLabel =
		targetGroup === 'tops' ? 'tops' : targetGroup === 'bottoms' ? 'bottoms' : 'items';

	return {
		suggestedSize: topSize,
		confidence,
		reason: `Based on your past ${groupLabel} orders`,
	};
}
