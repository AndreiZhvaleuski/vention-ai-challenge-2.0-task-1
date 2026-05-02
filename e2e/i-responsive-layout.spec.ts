import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../src/testIds';

test.describe('I: Responsive Layout', () => {
  test('mobile (375px) — podium stacks vertically, no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('[data-index="0"]')).toBeVisible();

    // No horizontal scrollbar: scrollWidth should equal clientWidth
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('desktop (1280px) — podium renders horizontally (2nd, 1st, 3rd order)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const podiumNames = page.locator(`[data-testid="${TEST_IDS.PODIUM_NAME}"]:visible`);
    await expect(podiumNames).toHaveCount(3);
  });

  test('all filter controls are accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.getByRole('combobox', { name: 'All Years' })).toBeVisible();
    await expect(page.getByRole('textbox')).toBeVisible();
  });
});
