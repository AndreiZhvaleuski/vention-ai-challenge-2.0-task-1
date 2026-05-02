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

  test('total points section has fixed width for alignment', async ({ page }) => {
    // Get first two cards to compare their total column widths
    const firstCard = page.locator('[data-index="0"]');
    const secondCard = page.locator('[data-index="1"]');

    // Get the computed width of total points section from both cards
    const firstTotalWidth = await firstCard.evaluate((el) => {
      // Find the total column by looking for star icon
      const starIcon = el.querySelector('[data-testid="StarIcon"]');
      if (starIcon) {
        const totalCol = starIcon.closest('div')?.parentElement;
        if (totalCol) {
          return window.getComputedStyle(totalCol).width;
        }
      }
      return null;
    });

    const secondTotalWidth = await secondCard.evaluate((el) => {
      const starIcon = el.querySelector('[data-testid="StarIcon"]');
      if (starIcon) {
        const totalCol = starIcon.closest('div')?.parentElement;
        if (totalCol) {
          return window.getComputedStyle(totalCol).width;
        }
      }
      return null;
    });

    // Both should have the same fixed width
    expect(firstTotalWidth).toBe(secondTotalWidth);
    expect(firstTotalWidth).not.toBeNull();
  });

  test('divider alignment is consistent across cards', async ({ page }) => {
    // Verify divider visual alignment by checking x-coordinates
    const firstCard = page.locator('[data-index="0"]');
    const secondCard = page.locator('[data-index="1"]');

    const firstDividerBox = await firstCard.evaluate((el) => {
      const dividers = el.querySelectorAll('hr[class*="MuiDivider"]');
      if (dividers.length > 0) {
        const divider = dividers[dividers.length - 1]; // Get the vertical divider
        const rect = divider.getBoundingClientRect();
        return rect.left;
      }
      return null;
    });

    const secondDividerBox = await secondCard.evaluate((el) => {
      const dividers = el.querySelectorAll('hr[class*="MuiDivider"]');
      if (dividers.length > 0) {
        const divider = dividers[dividers.length - 1]; // Get the vertical divider
        const rect = divider.getBoundingClientRect();
        return rect.left;
      }
      return null;
    });

    // Both dividers should be at approximately the same horizontal position
    // (within a small tolerance for scrollbar width differences)
    if (firstDividerBox && secondDividerBox) {
      expect(Math.abs(firstDividerBox - secondDividerBox)).toBeLessThan(10);
    }
  });
});
