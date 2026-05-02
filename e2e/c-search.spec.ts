import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../src/testIds';
import { SEARCH_DEBOUNCE } from './helpers';

test.describe('C: Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('typing a partial name filters the list', async ({ page }) => {
    const allCount = await page.locator('[data-index]').count();

    const searchBox = page.getByRole('textbox');
    await searchBox.fill('a');
    await page.waitForTimeout(SEARCH_DEBOUNCE);

    const filtered = await page.locator('[data-index]').count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThanOrEqual(allCount);
  });

  test('search is case-insensitive', async ({ page }) => {
    // First find a name from the list to search for
    const firstCard = page.locator('[data-index="0"]');
    const nameText = await firstCard.locator(`[data-testid="${TEST_IDS.EMPLOYEE_NAME}"]`).innerText();
    const firstName = nameText.split(' ')[0];

    const searchBox = page.getByRole('textbox');

    // Search uppercase
    await searchBox.fill(firstName.toUpperCase());
    await page.waitForTimeout(SEARCH_DEBOUNCE);
    const upperCount = await page.locator('[data-index]').count();

    // Search lowercase
    await searchBox.fill(firstName.toLowerCase());
    await page.waitForTimeout(SEARCH_DEBOUNCE);
    const lowerCount = await page.locator('[data-index]').count();

    expect(upperCount).toBe(lowerCount);
    expect(upperCount).toBeGreaterThan(0);
  });

  test('no-match search shows empty state alert', async ({ page }) => {
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('No activities found matching the current filters.')).toBeVisible();
  });

  test('clearing search restores the full list', async ({ page }) => {
    const allCount = await page.locator('[data-index]').count();

    const searchBox = page.getByRole('textbox');
    // Click first to trigger onFocus so the ClearIcon button appears
    await searchBox.click();
    await searchBox.fill('zz');
    const clearBtn = page.getByRole('button', { name: 'Clear search' });
    await clearBtn.waitFor();
    await clearBtn.click();

    await expect(page.locator('[data-index]')).toHaveCount(allCount);
  });

  test('search hides non-matching podium entries', async ({ page }) => {
    // Use a name that is unlikely to match the top-3 employees
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');

    await expect(page.locator(`[data-testid="${TEST_IDS.PODIUM_ENTRY}"]`)).toHaveCount(0);
  });
});
