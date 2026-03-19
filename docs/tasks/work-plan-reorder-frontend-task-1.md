# Task 1: Extract `useReorder` Hook

**Status:** Ready
**Date:** 2026-03-19
**Work Plan:** `docs/work-plan-reorder.md`

---

## Objective

Extract the reorder async logic into a single shared hook at `apps/web/src/hooks/use-api.ts` so that all three surfaces (Account page, Order List page, Order Detail page) share one implementation. This eliminates duplication and ensures any future bug fix is applied in one place.

The hook encapsulates:
- `executeReorder` — the async workhorse (parallel fetch via `Promise.allSettled`, `calculateItemPrice`, `addItem`, toast notifications, `router.push`)
- `handleReorder` — entry point; checks cart state, gates the `ConfirmDialog` or calls `executeReorder` directly
- `handleConfirmReorder` — called by `ConfirmDialog` `onConfirm`; clears cart then calls `executeReorder`
- `pendingOrderRef` — stores the deferred order across the cart-conflict modal cycle
- `useDisclosure` state — `confirmOpen` / `closeConfirm`
- Loading state — `isReordering: boolean` (single-order surfaces) and `reorderingOrderId: string | null` (multi-order surfaces), controlled by the `multiOrder` flag

The `ConfirmDialog` component itself is NOT included in the hook — each surface renders its own `<ConfirmDialog>` in JSX using the values the hook returns.

---

## Files Changed

| File | Change |
|------|--------|
| `apps/web/src/hooks/use-api.ts` | Add `useReorder` export at the bottom of the file |

---

## Acceptance Criteria

1. `useReorder()` (no argument) returns `{ handleReorder, handleConfirmReorder, isReordering, confirmOpen, closeConfirm }` where `isReordering` is a `boolean`.
2. `useReorder(true)` returns `{ handleReorder, handleConfirmReorder, reorderingOrderId, confirmOpen, closeConfirm }` where `reorderingOrderId` is `string | null`.
3. When `handleReorder(order)` is called and the cart is empty, `executeReorder` is called immediately — no modal is opened.
4. When `handleReorder(order)` is called and the cart has items, `confirmOpen` becomes `true` and `executeReorder` is NOT called yet.
5. When `handleConfirmReorder()` is called, `useCartStore.getState().clearCart()` is called before `executeReorder`.
6. `executeReorder` filters out items where `productId` is falsy before calling `Promise.allSettled`.
7. If all items are filtered out (zero valid items), a red error toast is shown and `router.push` is NOT called.
8. Each fulfilled product result with `isAvailable === false` adds the item's `productName` to `skippedNames` and does NOT call `addItem`.
9. Each rejected product result adds the item's `productName` to `skippedNames` and does NOT call `addItem`.
10. If `skippedNames.length > 0` and at least one item was added, the yellow warning toast is shown (color `'yellow'`, autoClose `6000`).
11. If `skippedNames.length === 0` and at least one item was added, the green success toast is shown (color `'green'`, autoClose `3000`).
12. `CartItem.price` is computed via `calculateItemPrice(orderedQty, orderItem.unit, product.price, product.quantity, product.unit)` — never raw `product.price`.
13. `CartItem.quantity` is always `1` regardless of the original order quantity.
14. `toApiAssetUrl(product.imageUrl)` is used for `CartItem.image`; `''` is acceptable when `imageUrl` is null/undefined.
15. The `finally` block always resets the loading state even when an unexpected error is thrown.
16. `router.push('/cart')` is called only when `addedItems.length > 0`.
17. The hook does not render any JSX — it is a plain logic hook.

---

## Implementation Steps

1. **Open** `apps/web/src/hooks/use-api.ts` and read the existing file to understand current exports and import patterns.

2. **Add imports** at the top of the file (or co-located with the new hook if the file uses per-hook import groups):
   ```ts
   import { useRouter } from 'next/navigation';
   import { notifications } from '@mantine/notifications';
   import { useDisclosure } from '@mantine/hooks';
   import React from 'react';
   import { productsApi } from '../lib/api/services';
   import { useCartStore } from '../store/cart-store';
   import { calculateItemPrice } from '../utils/index';
   import { toApiAssetUrl } from '../config/api';
   ```
   Do not duplicate imports that already exist at the top of the file.

3. **Define the TypeScript interfaces** immediately before the hook function:
   ```ts
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
   ```

4. **Write the hook signature**:
   ```ts
   export function useReorder(multiOrder?: boolean) { ... }
   ```

5. **Inside the hook**, declare state:
   - `const router = useRouter()`
   - `const [isReordering, setIsReordering] = React.useState(false)` (used when `!multiOrder`)
   - `const [reorderingOrderId, setReorderingOrderId] = React.useState<string | null>(null)` (used when `multiOrder`)
   - `const [confirmOpen, { open: openConfirm, close: closeConfirm }] = useDisclosure(false)`
   - `const pendingOrderRef = React.useRef<ReorderOrder | null>(null)`

6. **Implement `executeReorder(order: ReorderOrder)`** as an `async` function inside the hook:
   - Filter valid items: `const validItems = (order.items ?? []).filter(item => !!item.productId)`
   - Guard: if `validItems.length === 0`, show red error toast (`color: 'red'`, `title: 'Unable to reorder'`, `message: 'None of the items could be added. They may be unavailable.'`, `autoClose: 5000`) and return
   - Set loading: `multiOrder ? setReorderingOrderId(order.id) : setIsReordering(true)`
   - Wrap the rest in `try { ... } finally { multiOrder ? setReorderingOrderId(null) : setIsReordering(false) }`
   - Inside `try`: `const results = await Promise.allSettled(validItems.map(item => productsApi.getById(item.productId)))`
   - Declare `const addedItems: string[] = []` and `const skippedNames: string[] = []`
   - Loop `results.forEach((result, index) => { ... })`:
     - If `result.status === 'rejected'`: push `validItems[index].productName` to `skippedNames`, return
     - Unwrap product: `const rawProduct = (result.value as any)?.data?.data ?? (result.value as any)?.data ?? result.value`
     - If `!rawProduct || rawProduct.isAvailable === false`: push `validItems[index].productName` to `skippedNames`, return
     - Map fields: `basePrice = Number(rawProduct.price || 0)`, `baseQuantity = Number(rawProduct.quantity || 1)`, `baseUnit = (rawProduct.unit || validItems[index].unit) as 'gm' | 'kg' | 'pc'`
     - `orderedQty = Number(validItems[index].orderedQuantity) > 0 ? Number(validItems[index].orderedQuantity) : baseQuantity`
     - Compute price: `const itemPrice = calculateItemPrice(orderedQty, validItems[index].unit, basePrice, baseQuantity, baseUnit)`
     - Call `useCartStore.getState().addItem({ id: rawProduct.id, name: rawProduct.name, image: toApiAssetUrl(rawProduct.imageUrl), price: itemPrice, quantity: 1, orderedQuantity: orderedQty, unit: validItems[index].unit, productQuantity: `${orderedQty} ${validItems[index].unit}`, baseQuantity, basePrice, baseUnit, isAvailable: true, selectedVariant: `${orderedQty}${validItems[index].unit}` })`
     - Push `rawProduct.name` to `addedItems`
   - Post-loop:
     - If `addedItems.length === 0`: show red error toast (same as the guard above), return
     - Else if `skippedNames.length > 0`: show yellow warning toast (`color: 'yellow'`, `title: 'Some items were unavailable'`, `message: \`The following items could not be added: ${skippedNames.join(', ')}.\``, `autoClose: 6000`)
     - Else: show green success toast (`color: 'green'`, `title: 'Added to cart'`, `message: 'Items from this order were added to your cart.'`, `autoClose: 3000`)
     - Call `router.push('/cart')`

7. **Implement `handleReorder(order: ReorderOrder)`**:
   ```ts
   const handleReorder = (order: ReorderOrder) => {
     if (!order.items?.length || (multiOrder ? !!reorderingOrderId : isReordering)) return;
     const cartItems = useCartStore.getState().items;
     if (cartItems.length > 0) {
       pendingOrderRef.current = order;
       openConfirm();
     } else {
       executeReorder(order);
     }
   };
   ```

8. **Implement `handleConfirmReorder()`**:
   ```ts
   const handleConfirmReorder = () => {
     useCartStore.getState().clearCart();
     if (pendingOrderRef.current) {
       executeReorder(pendingOrderRef.current);
       pendingOrderRef.current = null;
     }
   };
   ```

9. **Return** the appropriate shape from the hook:
   ```ts
   return {
     handleReorder,
     handleConfirmReorder,
     isReordering,           // boolean — for single-order surfaces
     reorderingOrderId,      // string | null — for multi-order surfaces
     confirmOpen,
     closeConfirm,
   };
   ```

10. **Verify** the file compiles without TypeScript errors by inspecting the existing import patterns in `use-api.ts` and ensuring no duplicate identifiers are introduced.

---

## Dependencies

None — this is the foundational task. All other tasks depend on this one.
