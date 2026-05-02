import { test, expect } from '@playwright/test';
import { selectOption } from './helpers';

test.describe('G: Empty State', () => {
  test('impossible filter combo shows empty alert', async ({ page }) => {
    await page.goto('/');
    await selectOption(page, 'All Years', '2024');
    await selectOption(page, 'All Quarters', 'Q1');
    // Also search for something that doesn't exist
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('No activities found matching the current filters.')).toBeVisible();
  });

  test('no console errors during empty state', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');

    await expect(page.getByRole('alert')).toBeVisible();
    expect(errors).toHaveLength(0);
  });
});
