# Design Doc: Reorder Feature — Frontend

**Status:** Draft
**Date:** 2026-03-19
**Author:** technical-designer subagent
**PRD:** `docs/prd-reorder-feature.md`
**UI Spec:** `docs/ui-spec/ui-spec-reorder-feature.md`
**Backend Design Doc:** `docs/design-doc-reorder-backend.md`

---

## 1. Overview

The Reorder feature enables customers to repeat a past order in a single tap from any of three surfaces: the Account page (`/account`), the Order List page (`/account/orders`), and the Order Detail page (`/account/orders/[id]`). When activated, it fetches current product data for each item in parallel via `productsApi.getById`, constructs `CartItem` objects with live pricing via `calculateItemPrice`, and populates the Zustand `useCartStore` — then navigates to `/cart`. If the cart is already non-empty a `ConfirmDialog` asks the customer to replace or cancel before any mutation occurs. Unavailable or unfetchable products are skipped and reported via Mantine `notifications` toasts. The feature is entirely frontend-only: no new API endpoints, no new backend changes.

---

## 2. Architecture Decision

**Why frontend-only with no backend endpoint:**

The backend design doc (`docs/design-doc-reorder-backend.md`) confirms that all required data is already present in existing API responses:

- `GET /api/orders/:id` already returns `productId` on every `OrderItemDto` (verified in `libs/types/src/index.ts` and `apps/api/src/app/controllers/orders.controller.ts`).
- `GET /api/products/:id` already returns `isAvailable`, `price`, `quantity`, and `unit` — the four fields needed for `CartItem` construction.
- The `CartItem` is constructed and lives entirely in the Zustand store (`apps/web/src/store/cart-store.ts`), which persists to `localStorage` under the key `shreehari-mart-cart`. No server-side cart state exists.

A dedicated `POST /api/orders/reorder` endpoint would duplicate logic already available client-side and introduce a round-trip that returns the same product data the frontend must ultimately process anyway. The parallel `Promise.allSettled` pattern on the client achieves the same result without a new endpoint.

**Critical pricing rule:** The historical `OrderItemDto.finalPrice` and `OrderItemDto.pricePerBaseUnit` fields must never be used when constructing the reorder `CartItem`. Only current product data from `GET /api/products/:id` feeds into pricing, routed through `calculateItemPrice`.

---

## 3. Files Changed

### 3.1 Modified Files

**`apps/web/src/app/account/page.tsx`**

- Extend the `AccountOrder.items` inline type to add `productId: string` (it already exists in this file — the field is present in the account page's order shape; verify it is required, not optional).
- Add `ConfirmDialog` import from `../../components/ui/Modal`.
- Add `useDisclosure` for cart conflict modal state and `pendingOrderRef` to hold the deferred order.
- Refactor the existing `handleReorder` function to:
  1. Run the empty-items guard.
  2. Check `useCartStore.getState().items.length > 0` — if non-empty, store the order in `pendingOrderRef.current` and call `openConfirm()` instead of proceeding.
  3. Extract the core async logic into a separate `executeReorder(order)` function (see Section 4).
- Add `handleConfirmReorder` which calls `useCartStore.getState().clearCart()` then `executeReorder(pendingOrderRef.current)`.
- Render `<ConfirmDialog>` in the JSX (see Section 5 for props).
- The existing `loading={reorderingOrderId === order.id}` guard already prevents double-tap. No change needed there.
- Add `aria-label="Reorder items from this order"` to the Reorder button (currently absent).
- Fix the `CartItem.price` field: the existing implementation assigns `basePrice` directly to `CartItem.price`. It must instead use `calculateItemPrice(item.orderedQuantity, item.unit, product.price, product.quantity, product.unit)` imported from `../../utils/index.ts`.
- Add import: `import { calculateItemPrice } from '../../utils/index.ts'`.
- Add skipped-item tracking: items where the product fetch fails OR `product.isAvailable === false` must be collected and reported via the yellow warning toast rather than being silently skipped.
- Fix toast logic: the existing implementation shows the success toast unconditionally even when items are skipped. Replace with conditional: yellow warning toast if `skippedNames.length > 0`, green success toast if `skippedNames.length === 0`. If zero items were added, show red error toast and do NOT navigate.

**`apps/web/src/app/account/orders/[id]/page.tsx`**

- Extend the `AccountOrderItem` interface to add `productId: string`:
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
- Update `normalizeOrder` to extract `productId` from the API payload inside the `rawItems.map(...)` block:
  ```ts
  productId: String(resolvedItem.productId || ''),
  ```
- Add imports: `Button` from `@mantine/core`, `ConfirmDialog` from `../../../../components/ui/Modal`, `useDisclosure` from `@mantine/hooks`, `notifications` from `@mantine/notifications`, `productsApi` from `../../../../lib/api/services`, `calculateItemPrice` from `../../../../utils/index.ts`, `useCartStore` from `../../../../store/cart-store`, `toApiAssetUrl` from `../../../../config/api`.
- Add local state: `const [isReordering, setIsReordering] = React.useState(false)`.
- Add `useDisclosure` for modal: `const [confirmOpen, { open: openConfirm, close: closeConfirm }] = useDisclosure(false)`.
- Add `pendingOrderRef`: `const pendingOrderRef = React.useRef<AccountOrder | null>(null)`.
- Implement `handleReorder(order)`, `handleConfirmReorder()`, and `executeReorder(order)` (see Section 4).
- Add the Reorder `<Button>` to the JSX, placed after the Bill Details `<Card>` inside the existing `<Stack p={spacing.md} gap={spacing.md}>`, conditional on `order !== null` (see Section 5 for exact props).
- Render `<ConfirmDialog>` in the JSX (can be placed anywhere at the top level of the return, outside the inner `<Stack>`).

### 3.2 New Files

**`apps/web/src/app/account/orders/page.tsx`** (does not exist — must be created)

- New `'use client'` Next.js page at the `/account/orders` route.
- Mirrors the account page's order list section as a standalone page with a back-button header.
- Fetches orders via `ordersApi.getAll({ customerId: auth.user.customerId, page: 1, limit: 20 })` inside a `React.useEffect`.
- Uses `reorderingOrderId: string | null` state (same pattern as `account/page.tsx`).
- Renders each order as a `Card` with `Group grow` two-button row: "View Details" + "Reorder".
- Includes `ConfirmDialog` for cart conflict handling (same pattern as other surfaces).
- Implements `handleReorder`, `handleConfirmReorder`, and `executeReorder` — ideally by importing the `useReorder` hook (see Section 8).
- Shows a loading skeleton (4 `Skeleton` elements per card), an empty state ("No orders yet"), and an error state.
- Full page layout: `Box (minHeight: 100vh, bg: colors.surface, pb: calc(90px + safe-area-bottom))` with a top header bar containing a back `ActionIcon`, centered "My Orders" title, and a 34px spacer.

### 3.3 Hook File (Recommended Addition)

**`apps/web/src/hooks/use-api.ts`**

- Add a `useReorder` export function at the bottom of the file (see Section 8 for interface).
- This file already exports React Query hooks; `useReorder` is a plain async action hook (no React Query involvement) that fits naturally alongside the others.

---

## 4. Core Logic: executeReorder Function

This function is the async workhorse of the reorder flow. It is called after any cart-conflict confirmation has been resolved (or immediately if the cart was empty).

### Pseudo-code

```
async function executeReorder(order: AccountOrder): Promise<void> {
  // GUARD: filter out items missing productId (legacy orders)
  const validItems = order.items.filter(item => !!item.productId)

  // GUARD: nothing to fetch
  if (validItems.length === 0) {
    show red error toast: "None of the items could be added. They may be unavailable."
    return
  }

  // Enter loading state
  setIsReordering(true)   // OR: setReorderingOrderId(order.id) on multi-order surfaces

  try {
    // Parallel fetch — one call per unique product, no sequential blocking
    const results = await Promise.allSettled(
      validItems.map(item => productsApi.getById(item.productId))
    )

    const addedItems: string[]  = []
    const skippedNames: string[] = []

    results.forEach((result, index) => {
      const orderItem = validItems[index]

      if (result.status === 'rejected') {
        // Network error or 4xx/5xx from API
        skippedNames.push(orderItem.productName)
        return
      }

      // Unwrap the API envelope: response.data.data || response.data
      const rawProduct = (result.value as any)?.data || result.value
      const product = rawProduct

      if (!product || product.isAvailable === false) {
        // Product exists but is marked unavailable
        skippedNames.push(orderItem.productName)
        return
      }

      // Map API field names: product.price → basePrice, product.quantity → baseQuantity, product.unit → baseUnit
      const basePrice    = Number(product.price || 0)
      const baseQuantity = Number(product.quantity || 1)
      const baseUnit     = (product.unit || orderItem.unit) as 'gm' | 'kg' | 'pc'
      const orderedQty   = Number(orderItem.orderedQuantity) > 0
                             ? Number(orderItem.orderedQuantity)
                             : baseQuantity

      // Use calculateItemPrice — never raw basePrice
      const itemPrice = calculateItemPrice(
        orderedQty,
        orderItem.unit,
        basePrice,
        baseQuantity,
        baseUnit
      )

      useCartStore.getState().addItem({
        id:              product.id,
        name:            product.name,
        image:           toApiAssetUrl(product.imageUrl),   // '' if absent
        price:           itemPrice,
        quantity:        1,
        orderedQuantity: orderedQty,
        unit:            orderItem.unit,
        productQuantity: `${orderedQty} ${orderItem.unit}`,
        baseQuantity:    baseQuantity,
        basePrice:       basePrice,
        baseUnit:        baseUnit,
        isAvailable:     true,
        selectedVariant: `${orderedQty}${orderItem.unit}`,
      })

      addedItems.push(product.name)
    })

    // POST-PROCESSING
    if (addedItems.length === 0) {
      show red error toast: "None of the items could be added. They may be unavailable."
      return   // do NOT navigate
    }

    if (skippedNames.length > 0) {
      show yellow warning toast:
        title:   "Some items were unavailable"
        message: `The following items could not be added: ${skippedNames.join(', ')}.`
        autoClose: 6000
    } else {
      show green success toast:
        title:   "Added to cart"
        message: "Items from this order were added to your cart."
        autoClose: 3000
    }

    router.push('/cart')

  } finally {
    setIsReordering(false)   // OR: setReorderingOrderId(null)
  }
}
```

### Key Implementation Notes

1. `productsApi.getById(id)` returns `Promise<ApiResponse<any>>` where the actual product object is at `response.data` (Axios wraps the HTTP body in `response.data`; the HTTP body itself is `{ success: true, data: { ...product } }`). The product is therefore at `(result.value as any)?.data?.data || (result.value as any)?.data`. Inspect the existing account page `handleReorder` which uses `(response.value as any)?.data || response.value` — apply the same unwrapping pattern.

2. API field name mapping (from backend design doc): the `Product` entity uses `price`, `quantity`, `unit` — not `basePrice`, `baseQuantity`, `baseUnit`. These must be mapped before building the `CartItem`.

3. `toApiAssetUrl` (imported from `apps/web/src/config/api`) must wrap `product.imageUrl` to resolve relative asset paths to absolute URLs. If `product.imageUrl` is `null` or `undefined`, `toApiAssetUrl` returns `''` or a default — this satisfies `CartItem.image: string`.

4. The `finally` block must always reset the loading state, even if an unexpected error is thrown within the `try` block, to prevent the button being permanently stuck in loading.

5. `addItem` in `useCartStore` replaces an existing item if `CartItem.id` already exists in the cart (see `cart-store.ts` line 101–105). This is correct behavior: if the customer is replacing the cart, `clearCart()` was already called before `executeReorder`. If the cart was empty, `addItem` always appends.

---

## 5. State Management

### 5.1 Account Page (`apps/web/src/app/account/page.tsx`)

| State | Type | Purpose |
|-------|------|---------|
| `reorderingOrderId` | `string \| null` | Tracks which order is currently being reordered; drives `loading={reorderingOrderId === order.id}` on each button. Only one order can reorder at a time — the guard `if (!order.items?.length \|\| reorderingOrderId) return` enforces this. |
| `confirmOpen` | `boolean` (via `useDisclosure`) | Controls `ConfirmDialog` open/close. |
| `pendingOrderRef` | `React.MutableRefObject<AccountOrder \| null>` | Stores the order that triggered the conflict modal so `handleConfirmReorder` can retrieve it without stale closure issues. Using `useRef` instead of `useState` avoids a re-render when the value is set. |

**Loading guard:** `if (!order.items?.length || reorderingOrderId) return;` — this double guard prevents (a) reordering an empty order and (b) triggering a second reorder while one is in flight on any card.

### 5.2 Order Detail Page (`apps/web/src/app/account/orders/[id]/page.tsx`)

| State | Type | Purpose |
|-------|------|---------|
| `isReordering` | `boolean` (via `useState`) | Drives `loading={isReordering}` on the single Reorder button. No need for `reorderingOrderId` since there is only one order on this page. |
| `confirmOpen` | `boolean` (via `useDisclosure`) | Controls `ConfirmDialog`. |
| `pendingOrderRef` | `React.MutableRefObject<AccountOrder \| null>` | Same as account page — defers `executeReorder` until the user confirms cart replacement. |

**Loading guard:** Mantine's `loading` prop on the `Button` implicitly adds `aria-disabled="true"` and `pointer-events: none` — no additional disabled prop is needed. The button is entirely non-interactive while `isReordering === true`.

### 5.3 Order List Page (`apps/web/src/app/account/orders/page.tsx`)

| State | Type | Purpose |
|-------|------|---------|
| `reorderingOrderId` | `string \| null` (via `useState`) | Same pattern as the account page — one loading indicator per order card. |
| `confirmOpen` | `boolean` (via `useDisclosure`) | Controls `ConfirmDialog`. |
| `pendingOrderRef` | `React.MutableRefObject<AccountOrder \| null>` | Same deferred-order pattern. |
| `orders` | `AccountOrder[]` (via `useState`) | Fetched order list for this page. |
| `loadingOrders` | `boolean` (via `useState`) | Controls skeleton rendering. |

### 5.4 Cart Store (no new state)

`useCartStore` from `apps/web/src/store/cart-store.ts` is used via `useCartStore.getState()` (direct access outside React render) for three operations:
- `useCartStore.getState().items` — read items to detect non-empty cart.
- `useCartStore.getState().clearCart()` — wipe cart before reorder when user confirms.
- `useCartStore.getState().addItem(cartItem)` — add each successfully fetched item.

`getState()` is used (not a selector hook) because `executeReorder` is an async function that runs outside the React render cycle. This avoids stale closure issues with `items` and `addItem` captured at render time.

### 5.5 ConfirmDialog Props (all surfaces)

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

Note: `ConfirmDialog` in `apps/web/src/components/ui/Modal.tsx` (line 124–128) calls both `onConfirm()` and `onClose()` internally when the confirm button is clicked. Do NOT call `closeConfirm()` inside `handleConfirmReorder` — doing so would close the modal twice and cause a state flicker.

---

## 6. CartItem Construction

The `CartItem` interface (from `apps/web/src/store/cart-store.ts`) requires the following fields. The table maps each field to its source during a reorder.

| `CartItem` Field | Type | Source |
|------------------|------|--------|
| `id` | `string` | `product.id` — from `GET /api/products/:id` response |
| `name` | `string` | `product.name` — current product name |
| `image` | `string` | `toApiAssetUrl(product.imageUrl)` — `''` if `imageUrl` is null/undefined |
| `price` | `number` | `calculateItemPrice(orderItem.orderedQuantity, orderItem.unit, product.price, product.quantity, product.unit)` — **never raw `basePrice`** |
| `quantity` | `number` | `1` — cart multiplier always resets to 1 on reorder |
| `orderedQuantity` | `number` | `orderItem.orderedQuantity` — preserves the customer's original quantity intent (e.g., 500 for 500gm) |
| `unit` | `'gm' \| 'kg' \| 'pc'` | `orderItem.unit` — from `OrderItemDto` |
| `productQuantity` | `string` | `` `${orderItem.orderedQuantity} ${orderItem.unit}` `` — display string (e.g., `"500 gm"`) |
| `baseQuantity` | `number` | `product.quantity` — current base quantity from API |
| `basePrice` | `number` | `product.price` — current base price from API |
| `baseUnit` | `'gm' \| 'kg' \| 'pc'` | `product.unit` — current base unit from API |
| `isAvailable` | `boolean` | `true` — only available products reach this point; unavailable products are skipped before `addItem` is called |
| `selectedVariant` | `string` (optional) | `` `${orderItem.orderedQuantity}${orderItem.unit}` `` — e.g., `"500gm"` |

### calculateItemPrice Signature

```ts
// apps/web/src/utils/index.ts
export function calculateItemPrice(
  orderedQuantity: number,   // orderItem.orderedQuantity
  unit: 'gm' | 'kg' | 'pc', // orderItem.unit
  productPrice: number,      // product.price  (NOT CartItem.basePrice naming)
  productQuantity: number,   // product.quantity
  productUnit: 'gm' | 'kg' | 'pc'  // product.unit
): number
```

This function delegates to `calculateOrderItemPrice` from `@shreehari/utils`, which handles cross-unit conversions (gm ↔ kg) correctly. The function must always be used — never compute a manual ratio like `(orderedQuantity / productQuantity) * productPrice`.

### API Field Name Mapping

The API returns `price`, `quantity`, `unit` on the product object. The `CartItem` interface names the same concepts `basePrice`, `baseQuantity`, `baseUnit`. The mapping is:

```ts
const basePrice    = Number(product.price    || 0)
const baseQuantity = Number(product.quantity || 1)
const baseUnit     = product.unit as 'gm' | 'kg' | 'pc'
```

---

## 7. Error Handling

### 7.1 Individual Product Fetch Fails (network error, 404, 5xx)

- `Promise.allSettled` catches the rejection; the settled result has `status: 'rejected'`.
- The item is skipped. The display name is sourced from `orderItem.productName` on the original order item — not from the failed response.
- The name is added to `skippedNames[]`.
- No crash; other items in the batch continue processing.

### 7.2 Product Fetched but `isAvailable === false`

- The settled result has `status: 'fulfilled'`, but `product.isAvailable === false`.
- The item is skipped. Display name sourced from `orderItem.productName` (or `product.name` — both are acceptable since the fetch succeeded).
- The name is added to `skippedNames[]`.
- Yellow warning toast is shown if any other items were successfully added.

### 7.3 All Items Failed / All Products Unavailable (zero items added)

- `addedItems.length === 0` after processing all settled results.
- Show red error toast: `{ color: 'red', title: 'Unable to reorder', message: 'None of the items could be added. They may be unavailable.', autoClose: 5000 }`.
- Do NOT call `router.push('/cart')`.
- Reset loading state (`setIsReordering(false)` or `setReorderingOrderId(null)`) in the `finally` block.
- Customer remains on the current page.

### 7.4 Legacy Order Without `productId`

- Before calling `Promise.allSettled`, filter: `const validItems = order.items.filter(item => !!item.productId)`.
- `productId` is normalized to `''` by `normalizeOrder` when absent from the API payload (`String(resolvedItem.productId || '')`), so the filter reliably catches it.
- If `validItems.length === 0` after filtering, treat as "zero items added" — show red error toast, do not navigate.
- No console errors, no crashes.

### 7.5 Order Has Zero Items (`items` array is empty)

- The Reorder button is rendered with `disabled={!order.items?.length}`.
- The `handleReorder` guard `if (!order.items?.length || ...) return;` prevents any execution.
- No modal, no toast, no navigation.

### 7.6 Cart Conflict — User Cancels

- `ConfirmDialog` calls `onClose()` — `closeConfirm()` is called.
- `pendingOrderRef.current` is left set but ignored.
- No cart mutation, no loading state change, no navigation.
- Button returns to its normal (non-loading) state because loading was never set.

### 7.7 Unexpected Thrown Error Inside executeReorder

- The `try/finally` block in `executeReorder` ensures `setIsReordering(false)` (or `setReorderingOrderId(null)`) is always called.
- If an unexpected error escapes the `forEach` loop (which should not happen since `Promise.allSettled` never rejects), it will propagate to the caller. Consider wrapping the outer `try` body with a catch to show the red error toast as a fallback: `catch { notifications.show({ color: 'red', title: 'Unable to reorder', message: 'An unexpected error occurred.' }) }`.

### 7.8 Order Detail Page — Order Not Loaded

- The Reorder button is conditionally rendered: `{order && (<Button ...>)}`.
- If `order === null` (either loading or error state), the button is not rendered at all.
- The `errorMessage` Alert is shown instead.

---

## 8. Shared Hook Recommendation

**Recommendation: Extract `useReorder` into `apps/web/src/hooks/use-api.ts`.**

The `executeReorder` logic is identical across all three surfaces. Duplicating it inline in three files creates a maintenance hazard: a bug fix (e.g., the `calculateItemPrice` correction or the `skippedNames` tracking) would need to be applied in three places. The `use-api.ts` file is the right home — it already houses all custom API hooks for the web app.

### Interface

```ts
// apps/web/src/hooks/use-api.ts

import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { productsApi } from '../lib/api/services';
import { useCartStore } from '../store/cart-store';
import { calculateItemPrice } from '../utils/index.ts';
import { toApiAssetUrl } from '../config/api';

interface ReorderOrderItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
}

interface ReorderOrder {
  id: string;
  items?: ReorderOrderItem[];
}

interface UseReorderReturn {
  handleReorder: (order: ReorderOrder) => void;
  handleConfirmReorder: () => void;
  isReordering: boolean;                 // for single-order surfaces (detail page)
  reorderingOrderId: string | null;      // for multi-order surfaces (list pages)
  confirmOpen: boolean;
  closeConfirm: () => void;
}

export function useReorder(multiOrder?: boolean): UseReorderReturn
```

- `multiOrder: true` — the hook manages `reorderingOrderId: string | null` state (for account and list pages where multiple cards are visible).
- `multiOrder: false` (default) — the hook manages `isReordering: boolean` state (for the detail page with a single order).
- The hook encapsulates `executeReorder`, `handleReorder`, `handleConfirmReorder`, `pendingOrderRef`, and `useDisclosure` state.
- Callers on the account page and list page pass `order.id` as the reordering identifier; callers on the detail page just check `isReordering`.

### Minimum viable interface (if `multiOrder` flag is too complex)

If simplicity is preferred over a single hook for all surfaces, define two separate hooks:
- `useReorder()` — for single-order surfaces; returns `{ handleReorder, isReordering, confirmOpen, closeConfirm, handleConfirmReorder }`.
- `useReorderList()` — for multi-order surfaces; returns `{ handleReorder, reorderingOrderId, confirmOpen, closeConfirm, handleConfirmReorder }`.

Either approach eliminates the duplication across pages.

---

## 9. Implementation Order (Tasks)

1. **Extend `AccountOrderItem` interface in `orders/[id]/page.tsx`** — add `productId: string` field and update `normalizeOrder` to extract it. This is a prerequisite for all reorder functionality on the detail page.

2. **Implement `useReorder` hook in `use-api.ts`** — write `executeReorder` with the full logic (parallel fetch, `calculateItemPrice`, `addItem`, toast notifications, navigation). Include `ConfirmDialog` state management. This is the single source of truth.

3. **Wire `useReorder` into `account/page.tsx`** — replace the existing inline `handleReorder` with the hook. Add the `ConfirmDialog` to the JSX. Add `aria-label` to the Reorder button. Fix the `CartItem.price` field by using `calculateItemPrice`.

4. **Wire `useReorder` into `account/orders/[id]/page.tsx`** — add imports, add `isReordering` state (or use the hook), implement `handleReorder` / `handleConfirmReorder`, add the full-width Reorder `<Button>` after the Bill Details card, add `<ConfirmDialog>`.

5. **Create `apps/web/src/app/account/orders/page.tsx`** — new page with order list, loading skeleton, empty state, and Reorder button per card using `useReorder`. This page does not yet exist.

6. **Add `aria-label` and `disabled` guard to all Reorder buttons** — verify all three surfaces have `aria-label="Reorder items from this order"` and `disabled={!order.items?.length}`.

7. **Manual QA across all three surfaces** — verify the full interaction flow on each page (see Section 10).

---

## 10. Testing Considerations

### Manual Testing Checklist

**Happy path — all items available:**
- Tap "Reorder" on an order with 3+ items.
- Verify green toast appears: `"Added to cart"`.
- Verify navigation to `/cart`.
- Verify cart shows correct items with current prices (not historical `finalPrice`).
- Verify `CartItem.quantity` is `1` for each item regardless of original order quantity multiplier.
- Verify `CartItem.orderedQuantity` matches the original order item's `orderedQuantity`.

**Cart conflict — replace:**
- Fill cart with an item manually, then tap "Reorder" on a different order.
- Verify `ConfirmDialog` appears with title `"Replace your cart?"`.
- Click "Replace Cart".
- Verify previous cart items are gone; new items from the reorder are present.

**Cart conflict — cancel:**
- Fill cart, tap "Reorder", then click "Cancel" in the dialog.
- Verify cart is unchanged.
- Verify no navigation occurred.
- Verify button is not in loading state.

**Partial skip — some items unavailable:**
- Mock one product as `isAvailable: false` (or delete it from the DB temporarily).
- Trigger reorder on an order containing that product and one available product.
- Verify yellow toast lists the unavailable product name.
- Verify navigation to `/cart` still occurs.
- Verify cart contains only the available product.

**All items unavailable:**
- Mock all products in an order as unavailable.
- Trigger reorder.
- Verify red error toast appears.
- Verify no navigation to `/cart`.
- Verify button returns to normal state.

**Legacy order without `productId`:**
- Simulate an order item where `productId` is `''` after normalization.
- Verify no crash.
- Verify the item is silently skipped.
- If all items lack `productId`, verify red error toast and no navigation.

**Double-tap prevention:**
- Rapidly click the Reorder button twice.
- Verify `productsApi.getById` is called only once (not twice).

**Keyboard accessibility:**
- Tab to the Reorder button and press Enter — verify the flow triggers.
- With `ConfirmDialog` open, press Escape — verify it closes without reordering.
- With `ConfirmDialog` open, Tab through buttons — verify focus is trapped within the modal.

### Unit / Integration Tests

The following functions are candidates for Jest unit tests:

- `executeReorder` (or `useReorder` hook via `renderHook`) — mock `productsApi.getById` and `useCartStore`, assert `addItem` call count, `notifications.show` arguments, and `router.push` call condition.
- `calculateItemPrice` (already in `apps/web/src/utils/index.ts`) — verify cross-unit cases: gm ordered with kg base product, kg ordered with gm base product, pc ordered.
- `normalizeOrder` in `orders/[id]/page.tsx` — verify `productId` is extracted correctly from the API payload, including the empty-string fallback for missing `productId`.

Test file location: `apps/web/src/hooks/__tests__/use-reorder.test.ts` (new file, if the hook is extracted) and `apps/web/src/app/account/orders/[id]/__tests__/page.test.ts`.
