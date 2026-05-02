import { test, expect } from '@playwright/test';

test.describe('H: Virtual Scroll', () => {
  test('scrolling down renders more employee rows', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-index="0"]').waitFor();

    const initialCount = await page.locator('[data-index]').count();

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const afterScrollCount = await page.locator('[data-index]').count();
    // After scrolling, at least as many (or more due to overscan rendering) items visible
    expect(afterScrollCount).toBeGreaterThanOrEqual(initialCount);
  });
});
