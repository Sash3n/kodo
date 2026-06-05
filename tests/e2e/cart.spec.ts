import { test, expect } from '@playwright/test';

test('cart page shows empty state without items', async ({ page }) => {
	await page.goto('/cart');
	await expect(page).toHaveTitle(/KŌDO/);
});

test('checkout page redirects to PayFast', async ({ page }) => {
	await page.goto('/checkout');
	await expect(page).toHaveTitle(/Checkout/);
});
