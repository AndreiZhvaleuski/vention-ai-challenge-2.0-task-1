/**
 * Shared data-testid constants used by both source components and Playwright tests.
 * Centralising them here ensures a rename is a single-file change.
 */
export const TEST_IDS = {
  PODIUM_ENTRY: 'podium-entry',
  PODIUM_NAME: 'podium-name',
  EMPLOYEE_NAME: 'employee-name',
  ACTIVITY_CATEGORY: 'activity-category',
  TOTAL_COL: 'total-col',
} as const;
