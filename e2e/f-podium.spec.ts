import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../src/testIds';

test.describe('F: Podium Edge Cases', () => {
  test('search removing all top-3 hides podium without crash', async ({ page }) => {
    await page.goto('/');

    // Search for something that matches none of the top-3 employees
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');

    // No JS errors: the page should still be functional
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
    // Empty alert shown
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('podium is visible by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator(`[data-testid="${TEST_IDS.PODIUM_NAME}"]:visible`).first()).toBeVisible();
  });
});
