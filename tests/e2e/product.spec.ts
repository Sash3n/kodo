import { test, expect } from '@playwright/test';

test('shop page loads', async ({ page }) => {
	await page.goto('/shop');
	await expect(page).toHaveTitle(/Shop/);
	await expect(page.getByRole('heading', { name: /SHOP ALL/i })).toBeVisible();
});

test('returns page shows form', async ({ page }) => {
	await page.goto('/returns');
	await expect(page).toHaveTitle(/Returns/);
});

test('about page shows brand story', async ({ page }) => {
	await page.goto('/about');
	await expect(page).toHaveTitle(/About/);
});

test('contact page shows form', async ({ page }) => {
	await page.goto('/contact');
	await expect(page).toHaveTitle(/Contact/);
});

test('lookbook page loads', async ({ page }) => {
	await page.goto('/lookbook');
	await expect(page).toHaveTitle(/Lookbook/);
});
