export function formatZAR(cents: number): string {
	return `R ${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
}

const SKU_REGEX =
	/^KDO-(HOD|TEE|TRK|JKT|CAP|ACC)-(BLK|WHT|NVY|OLV|OAT|ECR|AMB|GRY)-(XS|S|M|L|XL|XXL)-\d{3}$/;

export function isValidSKU(sku: string): boolean {
	return SKU_REGEX.test(sku);
}
