import { test, expect } from '@playwright/test';

test('homepage loads and shows brand name', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/KŌDO/i);
});
