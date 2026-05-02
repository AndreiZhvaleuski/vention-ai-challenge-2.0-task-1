import { test, expect } from '@playwright/test';

test.describe('E: Employee Card Expand / Collapse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for list to settle
    await page.locator('[data-index="0"]').waitFor();
  });

  test('clicking expand shows activity table with correct columns', async ({ page }) => {
    await page.locator('[data-index="0"]').getByRole('button').click();

    const headers = page.locator('table thead th');
    await expect(headers.nth(0)).toContainText('ACTIVITY');
    await expect(headers.nth(1)).toContainText('CATEGORY');
    await expect(headers.nth(2)).toContainText('DATE');
    await expect(headers.nth(3)).toContainText('POINTS');
  });

  test('dates are formatted as dd-MMM-yyyy', async ({ page }) => {
    await page.locator('[data-index="0"]').getByRole('button').click();
    await expect(page.locator('table')).toBeVisible();

    const dateCell = page.locator('table tbody tr').first().locator('td').nth(2);
    const dateText = await dateCell.innerText();
    // Matches e.g. "15-Jan-2024"
    expect(dateText).toMatch(/^\d{2}-[A-Z][a-z]{2}-\d{4}$/);
  });

  test('activities are sorted by date descending', async ({ page }) => {
    await page.locator('[data-index="0"]').getByRole('button').click();
    await expect(page.locator('table')).toBeVisible();

    const dateCells = page.locator('table tbody tr td:nth-child(3)');
    const count = await dateCells.count();
    if (count < 2) return; // skip if only 1 activity

    const dates: Date[] = [];
    for (let i = 0; i < count; i++) {
      const text = await dateCells.nth(i).innerText();
      dates.push(new Date(text));
    }
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime());
    }
  });

  test('expanding second card collapses first', async ({ page }) => {
    // Expand first
    await page.locator('[data-index="0"]').getByRole('button').click();
    await expect(page.locator('[data-index="0"]').locator('table')).toBeVisible();

    // Expand second
    await page.locator('[data-index="1"]').getByRole('button').click();
    await expect(page.locator('[data-index="1"]').locator('table')).toBeVisible();
    await expect(page.locator('[data-index="0"]').locator('table')).not.toBeVisible();
  });

  test('clicking expanded card again collapses it', async ({ page }) => {
    const firstCard = page.locator('[data-index="0"]');
    await firstCard.getByRole('button').click();
    await expect(firstCard.locator('table')).toBeVisible();

    await firstCard.getByRole('button').click();
    await expect(firstCard.locator('table')).not.toBeVisible();
  });
});
