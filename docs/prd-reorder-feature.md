# PRD: Reorder Feature

**Status:** Draft
**Date:** 2026-03-19
**Scope:** Frontend only — `apps/web/` (Next.js 16)
**Effort:** Small-Medium

---

## Overview

The Reorder feature allows customers to repeat a past order in a single tap. When a customer views a completed order and clicks "Reorder", the app fetches the current product data for each item in that order, populates the Zustand cart store with those items at their latest prices, and navigates the customer to `/cart` — ready to review and place the order without manually searching for each product again.

---

## Problem Statement

Customers who order the same groceries regularly (a common pattern for a neighborhood mart like Shreehari Mart) must currently browse the catalog from scratch every time. There is no mechanism to repeat a past order. This creates friction, increases time-to-checkout, and reduces order frequency. Because the order history page already shows exactly what was ordered previously, surfacing a one-tap reorder action there is the lowest-effort, highest-value improvement available.

---

## Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Reduce repeat-order friction | % of returning customers who reorder within 7 days | Increase by 15% within 60 days of launch |
| Faster checkout for repeat buyers | Time from opening order history to reaching cart | Under 5 seconds for a typical 5-item order |
| Maintain pricing correctness | % of reorders that show the correct current price (not historical) | 100% — zero tolerance for stale pricing |

---

## User Stories

1. **As a returning customer**, I want to tap "Reorder" on a past delivered order so that I can quickly add those items to my cart without browsing the catalog.

2. **As a customer reviewing my past order**, I want the cart to show the current prices for reordered items so that I am not surprised by a price discrepancy at checkout.

3. **As a customer who already has items in my cart**, I want to be informed before reordering so that I can decide whether to merge or replace my existing cart.

4. **As a customer whose original product is no longer available**, I want to be clearly notified which items could not be added so that I can choose alternatives manually.

---

## Functional Requirements

### Core Flow

1. A "Reorder" button must be displayed on both the Order Details page (`apps/web/src/app/account/orders/[id]/page.tsx`) and the Order List page (`apps/web/src/app/account/orders/page.tsx`) — once per order row/card — when the order has at least one item.
2. The button must be visible for orders of any status (not limited to `delivered`), since customers may want to repeat pending or cancelled orders too.
3. Clicking "Reorder" must trigger an async product-fetch sequence — one API call per unique product in the order — using `productsApi.getById(productId)` for each item.
4. Each order item must expose a `productId` field. The existing `AccountOrderItem` interface must be extended to include `productId: string`.
5. The reorder logic must use the fetched product's current `basePrice`, `baseQuantity`, `baseUnit`, and `isAvailable` fields — never the historical `finalPrice` from the order.
6. For each successfully fetched product, a `CartItem` must be constructed and added via `useCartStore.getState().addItem(...)`.
7. `orderedQuantity` in the cart must match the value recorded in the original order item (preserving the customer's original quantity intent).
8. The `quantity` field of the `CartItem` (cart multiplier) must default to `1`.
9. If any product fetch fails or the product is marked `isAvailable: false`, that item must be skipped and the user must be notified via a Mantine `notifications` toast listing the skipped product names. When a fetch fails (rejected promise), the item's display name must be sourced from `item.productName` on the order item (not from the unavailable fetch response). When a fetch succeeds but `isAvailable === false`, the name may be sourced from either `item.productName` or `product.name`.
10. After processing all items, the app must navigate to `/cart` using `useRouter().push('/cart')`.

### Cart Conflict Handling

11. If the cart is not empty when "Reorder" is tapped, a confirmation dialog (Mantine `Modal` or inline confirmation) must ask the user: "Your cart has existing items. Do you want to replace them with this order?" with two options — "Replace Cart" and "Cancel".
12. If the user confirms "Replace Cart", `clearCart()` must be called before adding reorder items.
13. If the user cancels, no changes must be made to the cart or navigation.

### Loading & Error States

14. While the product fetches are in-flight, the "Reorder" button must display a loading spinner and be disabled to prevent double-taps.
15. If all items fail to fetch (network error or all products unavailable), the app must show an error notification and must NOT navigate to `/cart`.
16. If at least one item was successfully added, the app must navigate to `/cart` even if some items were skipped.

---

## Non-Functional Requirements

### Performance

- Product fetches must be run in parallel using `Promise.allSettled` — not sequentially — to minimize total wait time.
- For a typical order of 5–10 items, total fetch time must not exceed 3 seconds on a 4G connection.

### UX

- The "Reorder" button must use the existing Mantine `Button` component styled consistently with the page's primary action color (`colors.primary`).
- The button label must read "Reorder" in normal state and show a `Loader` in loading state (button text hidden or replaced).
- Toast notifications (Mantine `notifications`) must be used for all feedback — no blocking alerts.
- Skipped items must be listed by product name in the notification message, not just a count.

### Accessibility

- The "Reorder" button must have an `aria-label="Reorder items from this order"` attribute.
- The confirmation modal must trap focus and be dismissible via the Escape key (Mantine `Modal` default behavior satisfies this).

### Reliability

- If `productId` is missing from an order item (legacy orders without the field), that item must be silently skipped without crashing.
- The feature must not modify order history data or trigger any side effects beyond cart mutation and navigation.

---

## User Flow

```
1. Customer opens Order Details page (/account/orders/[id])
   └─ Order loads successfully (or error shown — no Reorder button if error)

2. Customer taps "Reorder" button
   ├─ [Cart is empty] → skip to step 4
   └─ [Cart has items] → show confirmation dialog
       ├─ Customer taps "Cancel" → nothing happens, stays on Order Details
       └─ Customer taps "Replace Cart" → clearCart(), continue to step 4

3. Button enters loading state (spinner, disabled) — only after confirmation is given (or immediately if cart was empty)

4. Parallel fetch: productsApi.getById(productId) for every order item
   ├─ Each SUCCESS → build CartItem with current price, orderedQuantity from order
   └─ Each FAILURE / isAvailable=false → record skipped item name

5. addItem(...) called for each successfully fetched product

6. If skipped items exist → show warning toast listing skipped product names

7. If at least one item was added:
   └─ router.push('/cart') — customer lands on cart page with items pre-filled

8. If zero items were added:
   └─ Show error toast "None of the items could be added. They may be unavailable."
      Stay on Order Details page.

9. Cart page (/cart):
   └─ Customer sees pre-filled cart with current prices, reviews, and places order
```

---

## Out of Scope

- **No backend changes.** This feature is frontend-only. No new API endpoints will be created.
- **No "merge cart" option.** The conflict resolution is binary: replace or cancel. Merging carts (combining quantities) is deferred to a future iteration.
- **No "merge cart" option.** The conflict resolution is binary: replace or cancel. Merging carts (combining quantities) is deferred to a future iteration.
- **No smart substitutions.** If a product is unavailable, it is skipped. No recommendations or alternatives are suggested.
- **No saved reorder lists or "Buy Again" section.** This is a single-action feature, not a persistent template system.
- **No quantity editing in the reorder flow.** Customers edit quantities on the cart page after navigation, not during the reorder action.
- **No analytics events.** Tracking (e.g., segment events for `reorder_initiated`, `reorder_completed`) is deferred unless the analytics infrastructure is in place.

---

## Assumptions & Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Use `Promise.allSettled` for parallel fetches | Prevents one failed product from blocking all others; gracefully surfaces partial results |
| 2 | Always fetch current product data, never use `finalPrice` from order | Prevents price inconsistency; keeps the business rule clear and auditable |
| 3 | Cart `quantity` (multiplier) defaults to `1` on reorder | Quantity variants (250gm, 500gm, etc.) are captured by `orderedQuantity`; the multiplier is always reset to 1 per the existing `addItem` contract |
| 4 | Replace-or-cancel for cart conflicts; no merge | Merge logic is complex and error-prone for quantity normalization across unit types; deferred |
| 5 | `AccountOrderItem` must include `productId` | Without `productId`, current product data cannot be fetched; the order API response must expose this field (backend verification required before implementation) |
| 6 | Navigate to `/cart` even if some items were skipped | A partial reorder is better than no reorder; the customer can add missing items manually |
| 7 | Show Reorder button for all order statuses | Customers may want to repeat cancelled orders or in-progress orders; filtering by status adds complexity without clear benefit |

---

## Implementation Notes

### Files to Modify

**`apps/web/src/app/account/orders/[id]/page.tsx`** (Order Detail page)

- Extend `AccountOrderItem` interface to add `productId: string` (currently missing).
- Update `normalizeOrder` to extract `productId` from the API payload.
- Add a `useReorder` local function or inline handler that:
  1. Checks cart state via `useCartStore.getState()`.
  2. Shows a confirmation modal if cart is non-empty.
  3. Sets a local `reordering` boolean state to control button loading.
  4. Calls `Promise.allSettled(order.items.map(item => productsApi.getById(item.productId)))`.
  5. Maps settled results to `CartItem` objects using the `CartItem` interface from `cart-store.ts`.
  6. Calls `useCartStore.getState().addItem(cartItem)` for each success.
  7. Shows `notifications.show(...)` for skipped items.
  8. Calls `router.push('/cart')` if at least one item was added.
- Render a `<Button>` (Mantine) below the order summary card. Conditionally render `<Loader size="xs" />` inside when `reordering === true`.

**`apps/web/src/app/account/orders/page.tsx`** (Order List page)

- Add a "Reorder" button to each order row/card.
- Reuse the same `useReorder` hook (see below) — pass the order's `items` array to it.
- The list page already fetches orders; ensure each order's items include `productId`.

**`apps/web/src/hooks/use-api.ts`** (optional but recommended)

- If the reorder logic is extracted into a reusable hook (e.g., `useReorder`), add it here. This is recommended if the same logic needs to be triggered from the order list page in a future iteration.
- A `useReorder` hook would accept `orderItems: AccountOrderItem[]`, handle all async logic, and return `{ reorder, isReordering }`.

### CartItem Field Mapping

When building a `CartItem` from a fetched product and an order item:

```
CartItem.id              = product.id
CartItem.name            = product.name
CartItem.image           = product.image (or '' if absent)
CartItem.price           = calculateItemPrice(orderItem.orderedQuantity, orderItem.unit, product.basePrice, product.baseQuantity, product.baseUnit)
                           — use `calculateItemPrice` from `src/utils/index.ts` directly; do not use a manual formula (it handles cross-unit conversions correctly)
CartItem.quantity        = 1
CartItem.orderedQuantity = orderItem.orderedQuantity
CartItem.unit            = orderItem.unit
CartItem.productQuantity = `${orderItem.orderedQuantity} ${orderItem.unit}`
CartItem.baseQuantity    = product.baseQuantity
CartItem.basePrice       = product.basePrice
CartItem.baseUnit        = product.baseUnit
CartItem.isAvailable     = product.isAvailable
```

### Backend Verification Prerequisite

Before implementation begins, confirm with the backend team that `GET /orders/:id` returns `productId` on each order item object. If not, a minor backend change is required to expose this field — this is not a new endpoint, just an addition to the existing response payload. This should be verified before frontend work starts.

### Existing Utilities

- `calculateItemPrice` in `apps/web/src/utils/` — review for use in price computation during cart item construction.
- `notifications` from `@mantine/notifications` — already used in `apps/web/src/app/cart/page.tsx`, so the dependency is available.
- Mantine `Modal` — available via `@mantine/core`; check `apps/web/src/components/ui/` for any existing modal wrapper before creating a new one.
