import { test, expect } from '@playwright/test';
import { TEST_IDS } from '../src/testIds';

test.describe('A: Initial Load & Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title "Leaderboard" is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
  });

  test('subtitle text is visible', async ({ page }) => {
    await expect(page.getByText('Top performers based on contributions and activity')).toBeVisible();
  });

  test('podium renders 3 cards on desktop', async ({ page }) => {
    // At 1280px (md+) the mobile podium is display:none, desktop is display:flex.
    // Exactly 3 visible podium name elements should appear (from the desktop layout).
    const podiumNames = page.locator(`[data-testid="${TEST_IDS.PODIUM_NAME}"]:visible`);
    await expect(podiumNames).toHaveCount(3);
  });

  test('employee list renders at least one row', async ({ page }) => {
    // Each employee card contains a rank number and a name
    const cards = page.locator('[data-index]');
    await expect(cards.first()).toBeVisible();
  });

  test('all four filter controls are present', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: 'All Years' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'All Quarters' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'All Categories' })).toBeVisible();
    await expect(page.getByRole('textbox')).toBeVisible();
  });
});
