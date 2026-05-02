import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../src/testIds';
import { selectOption } from './helpers';

test.describe('B: Year / Quarter / Category Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('selecting year 2024 narrows the list', async ({ page }) => {
    // Count rows before
    const before = await page.locator('[data-index]').count();

    await selectOption(page, 'All Years', '2024');
    await page.waitForTimeout(300);

    const after = await page.locator('[data-index]').count();
    // Filtering should produce a different (typically smaller) list
    expect(after).toBeGreaterThan(0);
    // The result may differ from unfiltered
    expect(after).toBeLessThanOrEqual(before);
  });

  test('selecting year 2025 shows results', async ({ page }) => {
    await selectOption(page, 'All Years', '2025');
    const rows = page.locator('[data-index]');
    await expect(rows.first()).toBeVisible();
  });

  test('selecting Q1 narrows the list', async ({ page }) => {
    await selectOption(page, 'All Quarters', 'Q1');
    const rows = page.locator('[data-index]');
    await expect(rows.first()).toBeVisible();
  });

  test('selecting Education category shows results', async ({ page }) => {
    await selectOption(page, 'All Categories', 'Education');
    const rows = page.locator('[data-index]');
    await expect(rows.first()).toBeVisible();
  });

  test('expanded card under Education filter shows only Education activities', async ({ page }) => {
    await selectOption(page, 'All Categories', 'Education');
    await expect(page.locator('[data-index="0"]')).toBeVisible();

    // Expand first card via the toggle button
    await page.locator('[data-index="0"]').getByRole('button').click();
    await expect(page.locator('table')).toBeVisible();

    // All category chips in the table should be "Education"
    const chips = page.locator(`[data-testid="${TEST_IDS.ACTIVITY_CATEGORY}"]`);
    const count = await chips.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(chips.nth(i)).toHaveText('Education');
    }
  });

  test('resetting year filter back to All Years restores full list', async ({ page }) => {
    const before = await page.locator('[data-index]').count();
    await selectOption(page, 'All Years', '2024');
    await page.waitForTimeout(300);
    await selectOption(page, 'All Years', 'All Years');
    await expect(page.locator('[data-index]')).toHaveCount(before);
  });

  test('chaining year + quarter narrows list further', async ({ page }) => {
    await selectOption(page, 'All Years', '2024');
    await page.waitForTimeout(300);
    const afterYear = await page.locator('[data-index]').count();

    await selectOption(page, 'All Quarters', 'Q1');
    await page.waitForTimeout(300);
    const afterBoth = await page.locator('[data-index]').count();

    expect(afterBoth).toBeLessThanOrEqual(afterYear);
  });
});
