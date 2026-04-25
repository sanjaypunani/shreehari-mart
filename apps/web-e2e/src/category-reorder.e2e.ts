/**
 * E2E tests — Category drag-and-drop reorder (Admin Dashboard)
 *
 * These are skeleton tests. Each `test` block describes exactly one acceptance
 * criterion from the Frontend Design Doc and UI Spec. None of the tests are
 * implemented yet; replace every `// TODO: implement` comment with real
 * Playwright actions once the feature branch is ready.
 *
 * Test runner:  Playwright (see apps/web-e2e/playwright.config.ts)
 * Base URL:     http://localhost:4200  (set via BASE_URL env var in CI)
 * Admin path:   /categories  (the CategoriesPage that hosts SortableCategoryList)
 *
 * Prerequisites before running:
 *   - Both the API (port 3000) and the admin web app (port 4200) must be running.
 *   - The database must contain at least 3 seeded categories with distinct sortOrders.
 *
 * Playwright drag-and-drop notes:
 *   @dnd-kit uses pointer events, not the HTML5 drag API.
 *   Use page.mouse.move / page.mouse.down / page.mouse.up sequences (or the
 *   dragTo helper with `force: true`) rather than page.dragAndDrop(), which
 *   relies on the HTML5 drag events that dnd-kit ignores.
 */

import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
// Centralise all selectors here so a single DOM change only requires one fix.

const SELECTORS = {
  /** The drag handle ActionIcon on any row — use .nth(n) to pick a specific row */
  dragHandle: '[aria-label="Drag to reorder"]',
  /** Drag handle in its disabled state (search active or save in flight) */
  dragHandleDisabled: '[aria-disabled="true"][aria-label="Drag to reorder (unavailable while searching)"]',
  /** The DnDStatusBanner Alert shown when search is active */
  dndStatusBanner: 'text=Reordering unavailable',
  /** Text message inside the DnDStatusBanner */
  dndStatusBannerMessage: 'text=Clear the search field to drag and reorder categories.',
  /** The search input rendered by SearchFilter */
  searchInput: '[placeholder*="Search"]',
  /** First category row in the sortable list */
  firstRow: '[role="list"] [role="listitem"]:first-child',
  /** All category rows in the sortable list */
  allRows: '[role="list"] [role="listitem"]',
  /** Error toast title shown after a failed reorder API call */
  errorToastTitle: 'text=Reorder failed',
};

// ---------------------------------------------------------------------------
// Helper: navigate to the admin Categories page
// ---------------------------------------------------------------------------
async function goToCategoriesPage(page: Page): Promise<void> {
  // TODO: navigate to the admin app's categories page
  //   await page.goto('/categories');
  //   await page.waitForSelector(SELECTORS.allRows);
}

// ---------------------------------------------------------------------------
// Helper: read the displayed category names in order
// ---------------------------------------------------------------------------
async function getCategoryNamesInOrder(page: Page): Promise<string[]> {
  // TODO: query all row name cells and return their text content as an array
  //   e.g. return page.locator(`${SELECTORS.allRows} [data-testid="category-name"]`).allTextContents();
  return [];
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

test.describe('Category drag-and-drop reorder — Admin Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    // TODO: seed the database with a known set of categories via the API or
    //       a direct DB call so each test starts from a deterministic state.
    //   e.g. await seedCategoriesViaApi(['Vegetables', 'Fruits', 'Dairy']);
    await goToCategoriesPage(page);
  });

  test.afterEach(async ({ page }) => {
    // TODO: clean up seeded categories so tests do not bleed into each other
    //   e.g. await clearCategoriesViaApi();
  });

  // =========================================================================
  // AC-AD-1: Drag handles are visible on each row
  // =========================================================================

  test('drag handle icon is visible on each category row when search is not active', async ({ page }) => {
    // UI Spec Section 4.7 / AC-AD-5 (normal state).
    // Each SortableCategoryRow renders a DragHandle with aria-label "Drag to reorder".
    //
    // TODO: assert that the number of drag handles equals the number of category rows
    //   const handles = page.locator(SELECTORS.dragHandle);
    //   const rows    = page.locator(SELECTORS.allRows);
    //   await expect(handles).toHaveCount(await rows.count());
    // TODO: assert each handle is visible (not hidden, not opacity 0)
    //   for (let i = 0; i < await handles.count(); i++) {
    //     await expect(handles.nth(i)).toBeVisible();
    //   }
  });

  // =========================================================================
  // AC-AD-2 + AC-AD-3: Drag changes order; order persists after page refresh
  // =========================================================================

  test('dragging a category row to a new position persists the new order after a page refresh', async ({ page }) => {
    // Frontend Design Doc Section 4.3 (onDragEnd) and AC-AD-3 (persistence).
    // The test drags the last row to the top position and then refreshes the
    // page to confirm the backend persisted the new sortOrder values.
    //
    // TODO: read the initial name order
    //   const initialOrder = await getCategoryNamesInOrder(page);
    // TODO: locate the last row's drag handle and the first row's bounding box
    // TODO: perform a pointer-based drag from the last handle to just above the first row
    //   (use page.mouse.move / down / up — dnd-kit uses pointer events, not HTML5 drag)
    // TODO: assert the displayed order changed immediately (optimistic update)
    //   const updatedOrder = await getCategoryNamesInOrder(page);
    //   expect(updatedOrder[0]).toBe(initialOrder[initialOrder.length - 1]);
    // TODO: reload the page
    //   await page.reload();
    //   await page.waitForSelector(SELECTORS.allRows);
    // TODO: assert the order after reload matches the post-drag order (server persisted it)
    //   const persistedOrder = await getCategoryNamesInOrder(page);
    //   expect(persistedOrder).toEqual(updatedOrder);
  });

  // =========================================================================
  // AC-AD-2: Optimistic update — order changes immediately on drop
  // =========================================================================

  test('category order updates immediately in the UI after a drag drop, before the API responds', async ({ page }) => {
    // Frontend Design Doc Section 4.3 step c: setLocalOrder(newOrder) is called
    // before the await onReorder(...) resolves.
    //
    // TODO: intercept / slow down the PATCH /api/categories/reorder network call
    //   await page.route('**/api/categories/reorder', async (route) => {
    //     await new Promise(r => setTimeout(r, 2000));   // 2s artificial delay
    //     await route.continue();
    //   });
    // TODO: perform a drag
    // TODO: assert the new order is visible in the DOM before 2 seconds have elapsed
    //   (i.e. the optimistic update already applied, even though the API is still in flight)
  });

  // =========================================================================
  // AC-AD-4: Error rollback — order reverts if API call fails
  // =========================================================================

  test('category order reverts to the pre-drag order when the reorder API call returns an error', async ({ page }) => {
    // Frontend Design Doc Section 10.1 / UI Spec Section 6.1.
    // Intercept the PATCH endpoint and force it to fail, then assert rollback.
    //
    // TODO: read the initial order
    //   const initialOrder = await getCategoryNamesInOrder(page);
    // TODO: intercept PATCH /api/categories/reorder and force a 500 response
    //   await page.route('**/api/categories/reorder', route =>
    //     route.fulfill({ status: 500, body: JSON.stringify({ success: false, message: 'DB error' }) })
    //   );
    // TODO: perform a drag
    // TODO: assert the order changed optimistically right after the drop
    // TODO: wait for the error toast to appear
    //   await expect(page.locator(SELECTORS.errorToastTitle)).toBeVisible();
    // TODO: assert the order has reverted to initialOrder
    //   const revertedOrder = await getCategoryNamesInOrder(page);
    //   expect(revertedOrder).toEqual(initialOrder);
  });

  test('shows "Reorder failed" error toast after a failed reorder API call', async ({ page }) => {
    // UI Spec Section 3.5 and 6.1: error toast with specific title and message.
    //
    // TODO: intercept PATCH /api/categories/reorder and force a non-2xx response
    // TODO: perform a drag
    // TODO: assert toast title is "Reorder failed"
    //   await expect(page.locator(SELECTORS.errorToastTitle)).toBeVisible();
    // TODO: assert toast message text (either stale-list or generic variant)
  });

  // =========================================================================
  // AC-AD-5: DnD disabled when search is active
  // =========================================================================

  test('drag-and-drop is disabled and a status banner is visible when the search field has a value', async ({ page }) => {
    // Frontend Design Doc Section 4.4 / UI Spec Sections 3.4 and 4.6.
    //
    // TODO: type a search term into the search input
    //   await page.fill(SELECTORS.searchInput, 'Veg');
    // TODO: assert the DnDStatusBanner is visible
    //   await expect(page.locator(SELECTORS.dndStatusBanner)).toBeVisible();
    //   await expect(page.locator(SELECTORS.dndStatusBannerMessage)).toBeVisible();
    // TODO: assert all drag handles carry aria-disabled="true"
    //   const disabledHandles = page.locator(SELECTORS.dragHandleDisabled);
    //   await expect(disabledHandles).toHaveCount(await page.locator(SELECTORS.allRows).count());
  });

  test('attempting to drag a row when search is active does not change the displayed order', async ({ page }) => {
    // Frontend Design Doc Section 4.4: sensors={[]} prevents drag initiation at the
    // framework level when isDndDisabled is true.
    //
    // TODO: type a search term
    // TODO: record the current order (of visible rows)
    //   const orderBeforeDragAttempt = await getCategoryNamesInOrder(page);
    // TODO: attempt a drag gesture on the first handle
    // TODO: assert the order is unchanged after the attempted drag
    //   const orderAfterDragAttempt = await getCategoryNamesInOrder(page);
    //   expect(orderAfterDragAttempt).toEqual(orderBeforeDragAttempt);
    // TODO: assert no PATCH /api/categories/reorder request was issued
    //   (use page.on('request', ...) listener set up before the drag attempt)
  });

  test('DnD status banner disappears when the search field is cleared', async ({ page }) => {
    // UI Spec Section 4.6: banner is controlled by isDndDisabled which clears
    // when searchValue becomes an empty string.
    //
    // TODO: fill the search input with a value
    //   await page.fill(SELECTORS.searchInput, 'Fruits');
    // TODO: assert banner is visible
    //   await expect(page.locator(SELECTORS.dndStatusBanner)).toBeVisible();
    // TODO: clear the search input
    //   await page.fill(SELECTORS.searchInput, '');
    // TODO: assert banner is no longer visible
    //   await expect(page.locator(SELECTORS.dndStatusBanner)).not.toBeVisible();
    // TODO: assert drag handles are in their normal (non-disabled) state
    //   await expect(page.locator(SELECTORS.dragHandle).first()).not.toHaveAttribute('aria-disabled');
  });

  // =========================================================================
  // AC-AD-6 / AC-AD-7: Accessibility — aria attributes and keyboard reorder
  // =========================================================================

  test('drag handle has correct aria-label and aria-describedby in the normal state', async ({ page }) => {
    // UI Spec Section 5.2.
    //
    // TODO: locate the first drag handle
    //   const handle = page.locator(SELECTORS.dragHandle).first();
    // TODO: assert aria-label === "Drag to reorder"
    //   await expect(handle).toHaveAttribute('aria-label', 'Drag to reorder');
    // TODO: assert aria-describedby === "category-list-keyboard-hint"
    //   await expect(handle).toHaveAttribute('aria-describedby', 'category-list-keyboard-hint');
    // TODO: assert aria-disabled is NOT set
    //   await expect(handle).not.toHaveAttribute('aria-disabled');
  });

  test('drag handle has aria-disabled="true" and updated aria-label when search is active', async ({ page }) => {
    // UI Spec Section 5.2 / AC-AD-6.
    //
    // TODO: fill search input
    //   await page.fill(SELECTORS.searchInput, 'test');
    // TODO: locate the first (disabled) drag handle
    // TODO: assert aria-disabled === "true"
    //   await expect(handle).toHaveAttribute('aria-disabled', 'true');
    // TODO: assert aria-label === "Drag to reorder (unavailable while searching)"
    //   await expect(handle).toHaveAttribute('aria-label', 'Drag to reorder (unavailable while searching)');
  });

  test('keyboard reorder via Space/Enter and arrow keys changes the category order', async ({ page }) => {
    // UI Spec Section 5.1 / AC-AD-7: KeyboardSensor + sortableKeyboardCoordinates.
    //
    // TODO: tab to the drag handle of the first row
    //   await page.keyboard.press('Tab');  // repeat until first DragHandle has focus
    // TODO: press Space to pick up the item
    //   await page.keyboard.press('Space');
    // TODO: press ArrowDown to move the item to the second position
    //   await page.keyboard.press('ArrowDown');
    // TODO: press Space to drop it
    //   await page.keyboard.press('Space');
    // TODO: assert the order changed (first item is now second)
    //   const newOrder = await getCategoryNamesInOrder(page);
    //   // assert newOrder reflects the move
    // TODO: assert focus remains on the drag handle of the moved row (AC-AD-7 / UI Spec 5.5)
    //   const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    //   expect(focusedElement).toBe('Drag to reorder');
  });
});
