import { test, expect } from '@playwright/test';

test('account page shows sign-in form when not authenticated', async ({ page }) => {
	await page.goto('/account');
	await expect(page).toHaveTitle(/Account/);
	await expect(page.getByRole('heading', { name: /KŌDO/i })).toBeVisible();
});

test('policies pages load correctly', async ({ page }) => {
	const policies = ['shipping', 'returns', 'privacy', 'terms', 'size-guide'];
	for (const policy of policies) {
		await page.goto(`/policies/${policy}`);
		await expect(page).toHaveTitle(/KŌDO/);
	}
});
