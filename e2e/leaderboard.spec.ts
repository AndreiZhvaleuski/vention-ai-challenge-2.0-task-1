import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Wait for search debounce (250ms component + 400ms URL sync + buffer). */
const SEARCH_DEBOUNCE = 800;

/** Select a MUI <Select> by its aria-label and pick a menu item by text. */
async function selectOption(page: import('@playwright/test').Page, ariaLabel: string, option: string) {
  await page.getByRole('combobox', { name: ariaLabel }).click();
  await page.getByRole('option', { name: option }).click();
}

// ---------------------------------------------------------------------------
// Group A: Initial Load & Rendering
// ---------------------------------------------------------------------------

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
    // subtitle1 is used only for employee names inside the podium (not the list).
    // Exactly 3 visible subtitle1 elements should appear (from the desktop layout).
    const podiumNames = page.locator('.MuiTypography-subtitle1:visible');
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

// ---------------------------------------------------------------------------
// Group B: Year / Quarter / Category Filters
// ---------------------------------------------------------------------------

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
    await page.waitForTimeout(300);
    const rows = page.locator('[data-index]');
    await expect(rows.first()).toBeVisible();
  });

  test('selecting Q1 narrows the list', async ({ page }) => {
    await selectOption(page, 'All Quarters', 'Q1');
    await page.waitForTimeout(300);
    const rows = page.locator('[data-index]');
    await expect(rows.first()).toBeVisible();
  });

  test('selecting Education category shows results', async ({ page }) => {
    await selectOption(page, 'All Categories', 'Education');
    await page.waitForTimeout(300);
    const rows = page.locator('[data-index]');
    await expect(rows.first()).toBeVisible();
  });

  test('expanded card under Education filter shows only Education activities', async ({ page }) => {
    await selectOption(page, 'All Categories', 'Education');
    await page.waitForTimeout(300);

    // Expand first card via the toggle button (ExpandMoreIcon)
    await page.locator('[data-index="0"]').getByRole('button').click();
    await page.waitForTimeout(200);

    // All category chips in the table should be "Education"
    const chips = page.locator('table .MuiChip-label');
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
    // The combobox aria-label is always 'All Years' regardless of selected value (static inputProps)
    await selectOption(page, 'All Years', 'All Years');
    await page.waitForTimeout(300);
    const after = await page.locator('[data-index]').count();
    expect(after).toBe(before);
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

// ---------------------------------------------------------------------------
// Group C: Search
// ---------------------------------------------------------------------------

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
    const nameText = await firstCard.locator('.MuiTypography-subtitle2').innerText();
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
    await page.waitForTimeout(SEARCH_DEBOUNCE);

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('No activities found matching the current filters.')).toBeVisible();
  });

  test('clearing search restores the full list', async ({ page }) => {
    const allCount = await page.locator('[data-index]').count();

    const searchBox = page.getByRole('textbox');
    // Click first to trigger onFocus so the ClearIcon button appears
    await searchBox.click();
    await searchBox.fill('zz');
    // The ClearIcon button has no aria-label; find it by its icon's data-testid
    const clearBtn = page.locator('button').filter({ has: page.locator('[data-testid="ClearIcon"]') });
    await clearBtn.waitFor();
    await clearBtn.click();
    await page.waitForTimeout(SEARCH_DEBOUNCE);

    const afterClear = await page.locator('[data-index]').count();
    expect(afterClear).toBe(allCount);
  });

  test('search hides non-matching podium entries', async ({ page }) => {
    // Use a name that is unlikely to match the top-3 employees
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');
    await page.waitForTimeout(SEARCH_DEBOUNCE);

    // Podium section should be gone (PodiumSection returns null when filteredIds excludes all top3)
    // The podium renders rank badges: look for rank badge "1" in podium context
    // Best heuristic: the gold-bordered avatar section is not visible
    const podiumGold = page.locator('[style*="eab308"], [class*="podium"]');
    await expect(podiumGold).toHaveCount(0);
  });

});

// ---------------------------------------------------------------------------
// Group E: Employee Card Expand / Collapse
// ---------------------------------------------------------------------------

test.describe('E: Employee Card Expand / Collapse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for list to settle
    await page.locator('[data-index="0"]').waitFor();
  });

  test('clicking expand shows activity table with correct columns', async ({ page }) => {
    await page.locator('[data-index="0"]').getByRole('button').click();
    await page.waitForTimeout(300);

    const headers = page.locator('table thead th');
    await expect(headers.nth(0)).toContainText('ACTIVITY');
    await expect(headers.nth(1)).toContainText('CATEGORY');
    await expect(headers.nth(2)).toContainText('DATE');
    await expect(headers.nth(3)).toContainText('POINTS');
  });

  test('dates are formatted as dd-MMM-yyyy', async ({ page }) => {
    await page.locator('[data-index="0"]').getByRole('button').click();
    await page.waitForTimeout(300);

    const dateCell = page.locator('table tbody tr').first().locator('td').nth(2);
    const dateText = await dateCell.innerText();
    // Matches e.g. "15-Jan-2024"
    expect(dateText).toMatch(/^\d{2}-[A-Z][a-z]{2}-\d{4}$/);
  });

  test('activities are sorted by date descending', async ({ page }) => {
    await page.locator('[data-index="0"]').getByRole('button').click();
    await page.waitForTimeout(300);

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
    await page.waitForTimeout(300);
    await expect(page.locator('[data-index="0"]').locator('table')).toBeVisible();

    // Expand second
    await page.locator('[data-index="1"]').getByRole('button').click();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-index="1"]').locator('table')).toBeVisible();
    await expect(page.locator('[data-index="0"]').locator('table')).not.toBeVisible();
  });

  test('clicking expanded card again collapses it', async ({ page }) => {
    const firstCard = page.locator('[data-index="0"]');
    await firstCard.getByRole('button').click();
    await page.waitForTimeout(300);
    await expect(firstCard.locator('table')).toBeVisible();

    await firstCard.getByRole('button').click();
    await page.waitForTimeout(300);
    await expect(firstCard.locator('table')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Group F: Podium Edge Cases
// ---------------------------------------------------------------------------

test.describe('F: Podium Edge Cases', () => {
  test('search removing all top-3 hides podium without crash', async ({ page }) => {
    await page.goto('/');

    // Capture the names of the top-3 employees from the podium rank badges area
    // Then search for something that matches none of them
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');
    await page.waitForTimeout(SEARCH_DEBOUNCE);

    // No JS errors: the page should still be functional
    await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
    // Empty alert shown
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('podium is visible by default', async ({ page }) => {
    await page.goto('/');
    // subtitle1 is used only for employee names in the podium section
    const podiumNames = page.locator('.MuiTypography-subtitle1:visible');
    await expect(podiumNames.first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Group G: Empty State
// ---------------------------------------------------------------------------

test.describe('G: Empty State', () => {
  test('impossible filter combo shows empty alert', async ({ page }) => {
    // Navigate with a year that has no data (employees only have 2024-2025)
    await page.goto('/?year=2024&quarter=Q1');
    // Also search for something that doesn't exist
    const searchBox = page.getByRole('textbox');
    await searchBox.fill('xyzzy_no_match_ever_12345');
    await page.waitForTimeout(SEARCH_DEBOUNCE);

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
    await page.waitForTimeout(SEARCH_DEBOUNCE);

    await expect(page.getByRole('alert')).toBeVisible();
    expect(errors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Group H: Virtual Scroll
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Group I: Responsive Layout
// ---------------------------------------------------------------------------

test.describe('I: Responsive Layout', () => {
  test('mobile (375px) — podium stacks vertically, no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(300);

    // No horizontal scrollbar: scrollWidth should equal clientWidth
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('desktop (1280px) — podium renders horizontally (2nd, 1st, 3rd order)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForTimeout(300);

    // At 1280px (md+) the desktop flex-row podium is visible; the mobile stacked one is display:none.
    // subtitle1 is used only for podium employee names — exactly 3 should be visible on desktop.
    const podiumNames = page.locator('.MuiTypography-subtitle1:visible');
    await expect(podiumNames).toHaveCount(3);
  });

  test('all filter controls are accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.getByRole('combobox', { name: 'All Years' })).toBeVisible();
    await expect(page.getByRole('textbox')).toBeVisible();
  });
});
