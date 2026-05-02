import type { Page } from '@playwright/test';

/** Wait for search debounce (250ms component debounce + buffer). */
export const SEARCH_DEBOUNCE = 400;

/** Select a MUI <Select> by its aria-label and pick a menu item by text. */
export async function selectOption(page: Page, ariaLabel: string, option: string) {
  await page.getByRole('combobox', { name: ariaLabel }).click();
  await page.getByRole('option', { name: option }).click();
}
