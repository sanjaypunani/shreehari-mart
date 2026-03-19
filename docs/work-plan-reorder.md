# Work Plan: Reorder Feature

**Status:** Ready for implementation
**Date:** 2026-03-19
**Scope:** Frontend-only (`apps/web/`)
**Design Docs:**
- `docs/design-doc-reorder-frontend.md`
- `docs/design-doc-reorder-backend.md`
- `docs/ui-spec/ui-spec-reorder-feature.md`

---

## Overview

The Reorder feature lets customers repeat a past order in a single tap from three surfaces: the Account page, the Order List page, and the Order Detail page. Tapping "Reorder" fetches current product data in parallel, builds `CartItem` objects with live pricing, and navigates to `/cart`. If the cart is non-empty a `ConfirmDialog` prompts before any mutation.

This is a **frontend-only** feature. No backend changes are required — `productId` is already present on every `OrderItemDto`, and the required product data is already available via `GET /api/products/:id`.

---

## Task Summary Table

| Task | File(s) Changed | Type | Depends On |
|------|----------------|------|------------|
| [Task 1](tasks/work-plan-reorder-frontend-task-1.md) — Extract `useReorder` hook | `apps/web/src/hooks/use-api.ts` | New export in existing file | None |
| [Task 2](tasks/work-plan-reorder-frontend-task-2.md) — Fix `account/page.tsx` | `apps/web/src/app/account/page.tsx` | Modify existing file | Task 1 |
| [Task 3](tasks/work-plan-reorder-frontend-task-3.md) — Create Order List page | `apps/web/src/app/account/orders/page.tsx` | New file | Task 1 |
| [Task 4](tasks/work-plan-reorder-frontend-task-4.md) — Update Order Detail page | `apps/web/src/app/account/orders/[id]/page.tsx` | Modify existing file | Task 1 |

**Total files changed:** 4
- 1 new export added to an existing file (`use-api.ts`)
- 2 existing files modified (`account/page.tsx`, `account/orders/[id]/page.tsx`)
- 1 new file created (`account/orders/page.tsx`)

---

## Dependency Diagram

```
Task 1: useReorder hook
(apps/web/src/hooks/use-api.ts)
         |
         |--- Task 2: Fix account/page.tsx
         |    (apps/web/src/app/account/page.tsx)
         |
         |--- Task 3: Create orders/page.tsx  [parallel with Task 2 and Task 4]
         |    (apps/web/src/app/account/orders/page.tsx)
         |
         `--- Task 4: Update orders/[id]/page.tsx  [parallel with Task 2 and Task 3]
              (apps/web/src/app/account/orders/[id]/page.tsx)
```

Task 1 is the only prerequisite. Tasks 2, 3, and 4 are independent of each other and can be executed in parallel once Task 1 is done.

---

## Task Details

### Task 1 — Extract `useReorder` Hook

**File:** `apps/web/src/hooks/use-api.ts`
**Type:** Add new export to existing file

**What it does:**
Adds a `useReorder(multiOrder?: boolean)` export at the bottom of `use-api.ts`. The hook encapsulates the entire async reorder flow so no page duplicates the logic:

- `executeReorder(order)` — parallel `Promise.allSettled` fetch, `calculateItemPrice`, `addItem`, toast notifications, `router.push('/cart')`
- `handleReorder(order)` — checks cart state; shows `ConfirmDialog` or calls `executeReorder` directly
- `handleConfirmReorder()` — `clearCart()` then `executeReorder(pendingOrderRef.current)`
- `pendingOrderRef` — defers the order across the modal lifecycle
- `useDisclosure` state — `confirmOpen` / `closeConfirm`
- Loading state — `isReordering: boolean` (single-order mode) or `reorderingOrderId: string | null` (multi-order mode)

**The `ConfirmDialog` is NOT rendered inside the hook** — each surface renders it in its own JSX using the values the hook returns.

**Key rules enforced inside the hook:**
- Items without `productId` are filtered out before `Promise.allSettled`
- `calculateItemPrice` is always used — raw `product.price` is never assigned to `CartItem.price`
- `CartItem.quantity` is always `1`
- `toApiAssetUrl(product.imageUrl)` is used for `CartItem.image`
- Yellow toast when some items skipped + at least one added; green toast when all added; red toast when zero added
- `router.push('/cart')` only when `addedItems.length > 0`
- `finally` block always resets loading state

---

### Task 2 — Fix `account/page.tsx`

**File:** `apps/web/src/app/account/page.tsx`
**Type:** Modify existing file

**What it fixes (four known bugs):**

| Bug | Fix |
|-----|-----|
| No cart conflict check — reorder overwrites cart silently | Replace inline logic with `useReorder(true)`; `ConfirmDialog` added to JSX |
| `CartItem.price` assigned raw `basePrice` instead of calculated price | Pricing now flows through `calculateItemPrice` inside the hook |
| Toast logic shows green success even when items were skipped | Toast logic corrected inside the hook (yellow for partial, red for all-fail) |
| Reorder button missing `aria-label` | `aria-label="Reorder items from this order"` added |

The existing `reorderingOrderId` state, the inline `handleReorder` function, and any cart-related imports that were only used by the old inline implementation are removed and replaced by the `useReorder(true)` call.

---

### Task 3 — Create Order List Page

**File:** `apps/web/src/app/account/orders/page.tsx` (new file — does not currently exist)
**Type:** Create new file

This creates the `/account/orders` route as a standalone page. It mirrors the order card design from the Account page and adds:

- Full-page layout: `Box (minHeight: 100vh, bg: colors.surface)` with safe-area bottom padding
- Header bar: back `ActionIcon`, centered "My Orders" title, spacer
- Order fetch via `ordersApi.getAll({ customerId: auth.user.customerId, page: 1, limit: 20 })` in `useEffect`
- Loading skeleton: 4 skeleton cards, each with 4 `Skeleton` elements
- Empty state: "No orders yet" + "Start shopping fresh vegetables"
- Order cards: same structure as Account page cards — order number, status badge, item count, total, two-button row
- "View Details" → `router.push('/account/orders/{id}')`
- "Reorder" → `handleReorder(order)` from `useReorder(true)`
- `ConfirmDialog` for cart conflict

---

### Task 4 — Update Order Detail Page

**File:** `apps/web/src/app/account/orders/[id]/page.tsx`
**Type:** Modify existing file

Two preparatory changes + two UI additions:

**Preparatory (data layer):**
1. Extend `AccountOrderItem` interface: add `productId: string`
2. Update `normalizeOrder`: map `productId: String(resolvedItem.productId || '')`

**UI additions:**
3. Wire `useReorder()` (single-order mode — no `multiOrder` flag): destructure `isReordering`, `handleReorder`, `handleConfirmReorder`, `confirmOpen`, `closeConfirm`
4. Add full-width Reorder `<Button>` after the Bill Details card, conditional on `order !== null`
5. Render `<ConfirmDialog>` unconditionally at the top level of the return

---

## Key Implementation Rules (applies to all tasks)

These rules are enforced by the `useReorder` hook in Task 1. Tasks 2–4 inherit them by consuming the hook:

1. **Never use historical prices** — `OrderItemDto.finalPrice`, `OrderItemDto.pricePerBaseUnit`, and `OrderItemDto.baseQuantity` are display-only fields. All pricing flows through `calculateItemPrice` with live product data.

2. **API field mapping** — the product endpoint returns `price`, `quantity`, `unit`. These map to `basePrice`, `baseQuantity`, `baseUnit` in `CartItem`. The mapping must be explicit:
   ```ts
   const basePrice    = Number(product.price    || 0)
   const baseQuantity = Number(product.quantity || 1)
   const baseUnit     = product.unit as 'gm' | 'kg' | 'pc'
   ```

3. **Response envelope unwrapping** — `productsApi.getById` returns `Promise<ApiResponse<any>>`. The actual product object is at `response.data?.data?.data ?? response.data?.data ?? response.data`. This double-unwrap pattern is required due to Axios + the API envelope.

4. **`ConfirmDialog` double-close prevention** — `ConfirmDialog` in `Modal.tsx` calls both `onConfirm()` and `onClose()` internally. `handleConfirmReorder` must NOT call `closeConfirm()` — doing so would trigger a double-close and state flicker.

5. **`useCartStore.getState()`** — all cart operations (`items`, `addItem`, `clearCart`) must use `getState()` (not selector hooks) because they run inside async functions outside the React render cycle, avoiding stale closures.

---

## Manual QA Checklist (post-implementation)

Verify these scenarios on all three surfaces after all four tasks are complete:

- [ ] Happy path: all items available → green toast → navigate to `/cart` → cart shows correct items with current prices
- [ ] Cart conflict → replace: `ConfirmDialog` appears → click "Replace Cart" → old items gone → new items present
- [ ] Cart conflict → cancel: click "Cancel" → cart unchanged → no navigation → button not in loading state
- [ ] Partial skip: one product unavailable → yellow warning toast listing the skipped name → navigation still occurs → cart has only available items
- [ ] All items unavailable: red error toast → no navigation → button returns to normal state
- [ ] Legacy order (no `productId`): no crash → item silently skipped → if all items legacy, red error toast
- [ ] Double-tap: second tap does nothing while reorder is in flight
- [ ] Keyboard: Tab → Reorder button → Enter triggers flow; Escape closes `ConfirmDialog`
- [ ] Screen reader: `aria-label` on button; toast announced; modal title announced
