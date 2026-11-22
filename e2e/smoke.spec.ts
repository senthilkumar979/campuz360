import { test, expect } from '@playwright/test';

test('shell home renders brand', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /One platform/i })).toBeVisible();
});
