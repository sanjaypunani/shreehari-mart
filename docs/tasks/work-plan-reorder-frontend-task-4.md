# Task 4: Update `account/orders/[id]/page.tsx` — Add Reorder Button

**Status:** Ready (depends on Task 1)
**Date:** 2026-03-19
**Work Plan:** `docs/work-plan-reorder.md`

---

## Objective

Add the Reorder button to the Order Detail page (`/account/orders/[id]`). The page already exists and renders order details, bill summary, and item list. This task:

1. Extends the `AccountOrderItem` interface to include `productId: string`.
2. Updates the `normalizeOrder` function to extract `productId` from the API response.
3. Wires in `useReorder()` (single-order mode, no `multiOrder` flag).
4. Adds a full-width "Reorder" `Button` after the Bill Details card.
5. Renders a `ConfirmDialog` for cart conflict handling.

---

## Files Changed

| File | Change |
|------|--------|
| `apps/web/src/app/account/orders/[id]/page.tsx` | Extend interface; update `normalizeOrder`; add `useReorder`; add Reorder button + `ConfirmDialog` to JSX |

---

## Acceptance Criteria

1. `AccountOrderItem` interface has `productId: string` as a required field.
2. `normalizeOrder` maps `productId` from the API payload: `productId: String(resolvedItem.productId || '')`.
3. `useReorder()` (no argument — single-order mode) is called in the component; `isReordering`, `handleReorder`, `handleConfirmReorder`, `confirmOpen`, and `closeConfirm` are destructured.
4. The Reorder button is rendered inside `{order && (...)}` — it does not appear when `order` is null.
5. The Reorder button is placed after the Bill Details `<Card>` inside the existing `<Stack p={spacing.md} gap={spacing.md}>`.
6. The Reorder button is `fullWidth`.
7. The Reorder button has `size="md"`.
8. The Reorder button has `loading={isReordering}`.
9. The Reorder button has `disabled={!order.items?.length}`.
10. The Reorder button has `aria-label="Reorder items from this order"`.
11. The Reorder button style matches: `minHeight: 44`, `borderRadius: radius.md`, `backgroundColor: colors.primary`, `fontWeight: typography.fontWeight.semibold`.
12. A `<ConfirmDialog>` is rendered in the JSX with the exact props from the UI spec (Section 4.2) — placed outside the `{order && (...)}` conditional so it mounts regardless of order state.
13. No new `isReordering` `useState` is added to this file — `isReordering` comes from `useReorder()`.
14. No `useDisclosure` is added to this file — `confirmOpen` and `closeConfirm` come from `useReorder()`.
15. No `pendingOrderRef` is added to this file — it is internal to `useReorder()`.
16. `handleReorder` is called with `order` (the full `AccountOrder` object), not just `order.id`.
17. The `handleReorder` type accepts `ReorderOrder` from the hook — the local `AccountOrder` type must satisfy this interface (i.e., must have `id: string` and `items` with `productId`, `productName`, `orderedQuantity`, `unit`).
18. No TypeScript errors. Existing order detail logic (fetch, normalize, display) is untouched.

---

## Implementation Steps

1. **Read** `apps/web/src/app/account/orders/[id]/page.tsx` in full to understand the current interfaces (`AccountOrder`, `AccountOrderItem`), the `normalizeOrder` function, the component state, the existing JSX structure, and existing imports.

2. **Extend the `AccountOrderItem` interface** — add `productId: string` as a required field:
   ```ts
   interface AccountOrderItem {
     id: string;
     productId: string;    // ADD — required for reorder fetch
     productName: string;
     orderedQuantity: number;
     unit: 'gm' | 'kg' | 'pc';
     finalPrice: number;
   }
   ```

3. **Update `normalizeOrder`** — inside the `rawItems.map(...)` block, add the `productId` extraction line alongside the other field mappings:
   ```ts
   productId: String(resolvedItem.productId || ''),
   ```
   Place it after `id` and before or alongside `productName`. Ensure this is inside the map callback, not outside it.

4. **Add import** for `useReorder`:
   ```ts
   import { useReorder } from '../../../../hooks/use-api'; // adjust relative path
   ```

5. **Add import** for `ConfirmDialog`:
   ```ts
   import { ConfirmDialog } from '../../../../components/ui/Modal'; // adjust relative path
   ```
   If `Button` from `@mantine/core` is not already imported, add it. If `Button` is already imported (likely — the page has other buttons), do not duplicate the import.

6. **Inside the component function**, add the `useReorder` call after existing hooks:
   ```ts
   const {
     handleReorder,
     handleConfirmReorder,
     isReordering,
     confirmOpen,
     closeConfirm,
   } = useReorder();
   ```

7. **Locate the Bill Details card** in the JSX — it is the last `<Card>` inside `<Stack p={spacing.md} gap={spacing.md}>`. Add the Reorder button immediately after it, inside the same `<Stack>`:
   ```tsx
   {order && (
     <Button
       fullWidth
       size="md"
       onClick={() => handleReorder(order)}
       loading={isReordering}
       disabled={!order.items?.length}
       aria-label="Reorder items from this order"
       style={{
         minHeight: 44,
         borderRadius: radius.md,
         backgroundColor: colors.primary,
         fontWeight: typography.fontWeight.semibold,
       }}
     >
       Reorder
     </Button>
   )}
   ```

8. **Add `<ConfirmDialog>`** at the top level of the return statement (outside any conditional), as a sibling of the main content:
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

9. **Check the `handleReorder` call site** — the hook expects a `ReorderOrder` object: `{ id: string; items?: ReorderOrderItem[] }`. Confirm the local `AccountOrder` type satisfies this (it will, since `id` is present and items have `productId`, `productName`, `orderedQuantity`, `unit` after the interface extension in step 2).

10. **Verify** no TypeScript errors. Run a mental type-check: `order` is typed as `AccountOrder | null`; the `{order && (...)}` guard narrows it to `AccountOrder` before passing to `handleReorder`.

---

## Dependencies

- **Task 1 must be complete** — `useReorder` must exist in `apps/web/src/hooks/use-api.ts`.
- Task 2 and Task 3 have no dependency relationship with Task 4 — they can be worked in parallel after Task 1 is done.
