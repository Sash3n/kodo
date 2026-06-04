import { describe, it, expect } from 'vitest';
import { formatZAR, isValidSKU } from './format';

describe('formatZAR', () => {
	it('formats cents to ZAR string', () => {
		expect(formatZAR(95000)).toBe('R 950.00');
		expect(formatZAR(89900)).toBe('R 899.00');
		expect(formatZAR(100)).toBe('R 1.00');
	});
});

describe('isValidSKU', () => {
	it('accepts valid SKUs', () => {
		expect(isValidSKU('KDO-HOD-BLK-L-001')).toBe(true);
		expect(isValidSKU('KDO-TEE-AMB-M-003')).toBe(true);
		expect(isValidSKU('KDO-TRK-OLV-XL-001')).toBe(true);
	});

	it('rejects invalid SKUs', () => {
		expect(isValidSKU('KDO-HOD-BLK-L')).toBe(false);
		expect(isValidSKU('HOD-BLK-L-001')).toBe(false);
		expect(isValidSKU('KDO-XXX-BLK-L-001')).toBe(false);
		expect(isValidSKU('')).toBe(false);
	});
});
