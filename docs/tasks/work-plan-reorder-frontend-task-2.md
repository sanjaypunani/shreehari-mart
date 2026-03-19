# Task 2: Fix `account/page.tsx` — Bug Fixes + ConfirmDialog

**Status:** Ready (depends on Task 1)
**Date:** 2026-03-19
**Work Plan:** `docs/work-plan-reorder.md`

---

## Objective

Patch the existing Reorder implementation on the Account page (`/account`) to fix four known bugs and wire in the `useReorder` hook from Task 1. After this task:

- The cart conflict check shows a `ConfirmDialog` instead of silently clobbering the cart.
- `CartItem.price` is computed via `calculateItemPrice` instead of raw `basePrice`.
- The toast logic correctly shows yellow for partial-skip, red for all-fail, and green only for full success.
- The Reorder button has `aria-label="Reorder items from this order"`.

The `ConfirmDialog` component is rendered in JSX inside this file — the hook does not render it.

---

## Files Changed

| File | Change |
|------|--------|
| `apps/web/src/app/account/page.tsx` | Replace inline `handleReorder` with `useReorder` hook; add `ConfirmDialog` to JSX; fix `aria-label`; fix price calculation; fix toast logic |

---

## Acceptance Criteria

1. `useReorder(true)` is imported from `../../../hooks/use-api` (or the correct relative path) and called at the top of the component; the inline `handleReorder`, inline `executeReorder` (if one existed), and manual loading state management for reordering are removed.
2. `reorderingOrderId`, `handleReorder`, `handleConfirmReorder`, `confirmOpen`, and `closeConfirm` are all destructured from `useReorder(true)`.
3. The Reorder button has `aria-label="Reorder items from this order"`.
4. The Reorder button has `disabled={!order.items?.length}`.
5. The Reorder button still shows `loading={reorderingOrderId === order.id}`.
6. A `<ConfirmDialog>` is rendered in the JSX with the exact props from the UI spec (Section 4.2):
   - `isOpen={confirmOpen}`
   - `onClose={closeConfirm}`
   - `onConfirm={handleConfirmReorder}`
   - `title="Replace your cart?"`
   - `message="Your cart has existing items. Do you want to replace them with this order?"`
   - `confirmText="Replace Cart"`
   - `cancelText="Cancel"`
   - `variant="warning"`
   - `loading={false}`
7. `ConfirmDialog` is imported from `../../components/ui/Modal` (verify actual relative path from `account/page.tsx`).
8. `useDisclosure` is NOT added to this file — it is handled inside `useReorder`.
9. `pendingOrderRef` is NOT declared in this file — it is handled inside `useReorder`.
10. The old inline logic that assigned `basePrice` directly to `CartItem.price` is gone — pricing now flows through `calculateItemPrice` inside the hook.
11. The old toast logic that showed green toast unconditionally is gone — the hook now controls toast logic.
12. No TypeScript errors introduced. Existing non-reorder logic (auth, order fetch, etc.) is untouched.

---

## Implementation Steps

1. **Read** `apps/web/src/app/account/page.tsx` in full to understand the current structure, all existing state declarations, and the existing `handleReorder` implementation.

2. **Identify** all existing reorder-related state and logic to remove:
   - `const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null)` — will be replaced by the hook's value
   - The existing `handleReorder` async function — remove entirely
   - Any `useState` for `confirmOpen` (if already partially implemented) — remove; the hook owns it
   - Any `useRef` for `pendingOrderRef` — remove; the hook owns it
   - Import of `calculateItemPrice` if already imported inline — keep the import only if used elsewhere; the hook also imports it internally

3. **Add import** for `useReorder`:
   ```ts
   import { useReorder } from '../../../hooks/use-api'; // adjust relative path as needed
   ```

4. **Add import** for `ConfirmDialog`:
   ```ts
   import { ConfirmDialog } from '../../components/ui/Modal'; // adjust relative path
   ```

5. **Inside the component function**, replace the old reorder state declarations and `handleReorder` definition with:
   ```ts
   const {
     handleReorder,
     handleConfirmReorder,
     reorderingOrderId,
     confirmOpen,
     closeConfirm,
   } = useReorder(true);
   ```

6. **In the JSX**, find the Reorder `<Button>` inside the order card's `<Group grow>` and update its props:
   - Add `aria-label="Reorder items from this order"`
   - Add `disabled={!order.items?.length}`
   - Confirm `loading={reorderingOrderId === order.id}` is present (it was already there)
   - Confirm `onClick={() => handleReorder(order)}` calls the hook's `handleReorder`

7. **Add `<ConfirmDialog>`** to the JSX. Place it at the top-level return, outside the order list loop but inside the root `<Box>` or fragment. Props per the UI spec:
   ```tsx
   <ConfirmDialog
     isOpen={confirmOpen}
     onClose={closeConfirm}
     onConfirm={handleConfirmReorder}
     title="Replace your cart?"
     message="Your cart has existing items. Do you want to replace them with this order?"
     confirmText="Replace Cart"
     cancelText="Cancel"
     variant="warning"
     loading={false}
   />
   ```

8. **Remove orphaned imports** — if `calculateItemPrice`, `useDisclosure`, `productsApi`, or `toApiAssetUrl` were imported only for the old inline `handleReorder`, remove them now. Do not remove imports used elsewhere in the file.

9. **Verify** the file has no TypeScript errors and no duplicate state identifiers.

---

## Dependencies

- **Task 1 must be complete** — `useReorder` must exist in `apps/web/src/hooks/use-api.ts` before this file can import it.
