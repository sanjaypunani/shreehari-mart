# Task 3: Create `account/orders/page.tsx` — Order List Page

**Status:** Ready (depends on Task 1)
**Date:** 2026-03-19
**Work Plan:** `docs/work-plan-reorder.md`

---

## Objective

Create the Order List page at `apps/web/src/app/account/orders/page.tsx`. This file does not currently exist. It provides a standalone `/account/orders` route where customers can browse their full order history and trigger a reorder from any order card.

The page mirrors the order card design from the Account page but is a dedicated full-page view with:
- A back-button header bar
- Loading skeleton (4 `Skeleton` elements per card while fetching orders)
- Empty state ("No orders yet")
- Error state
- Per-order "View Details" + "Reorder" two-button row
- `ConfirmDialog` for cart conflict handling

---

## Files Changed

| File | Change |
|------|--------|
| `apps/web/src/app/account/orders/page.tsx` | Create new file — full `'use client'` Next.js page |

---

## Acceptance Criteria

1. File starts with `'use client';`.
2. Orders are fetched inside `React.useEffect` using `ordersApi.getAll({ customerId: auth.user.customerId, page: 1, limit: 20 })`. The effect runs once on mount.
3. `loadingOrders: boolean` state controls skeleton display — 4 skeleton cards are shown while `loadingOrders === true`.
4. Each skeleton card contains exactly 4 `Skeleton` elements matching the UI spec dimensions:
   - `height: 16, width: "55%", radius: "sm"`
   - `height: 12, width: "40%", radius: "sm"`
   - `height: 14, width: "70%", radius: "sm"`
   - `height: 44, radius: "md"` (button row placeholder)
5. When `orders.length === 0` and `loadingOrders === false`, the empty state is shown:
   - `Text`: "No orders yet"
   - `Text` (secondary, centered): "Start shopping fresh vegetables"
6. Each order card has the same structure as the Account page card (Section 6.1 of the UI spec): order number, status badge, status label + date, item count + total, and `<Group grow>` two-button row.
7. "View Details" button navigates to `/account/orders/{order.id}` via `router.push`.
8. "Reorder" button calls `handleReorder(order)` from `useReorder(true)`.
9. "Reorder" button has `loading={reorderingOrderId === order.id}`.
10. "Reorder" button has `disabled={!order.items?.length}`.
11. "Reorder" button has `aria-label="Reorder items from this order"`.
12. A single `<ConfirmDialog>` is rendered outside the order list loop with the exact props from the UI spec (Section 4.2).
13. Page layout uses `Box (minHeight: '100vh', bg: colors.surface, pb: 'calc(90px + env(safe-area-inset-bottom))')`.
14. Header bar contains: `ActionIcon` with back arrow icon → `router.back()`, centered `Text` "My Orders", and a `Box (w: 34)` spacer for visual balance.
15. `useReorder(true)` is called — `reorderingOrderId`, `handleReorder`, `handleConfirmReorder`, `confirmOpen`, `closeConfirm` are all destructured.
16. No TypeScript errors. The page is properly typed with a local `Order` (or `AccountOrder`) interface that includes `productId` on each item.

---

## Implementation Steps

1. **Check** that `apps/web/src/app/account/orders/` directory exists. It should — `[id]/page.tsx` already lives there. The `page.tsx` file for the list route is simply missing.

2. **Read** `apps/web/src/app/account/page.tsx` to copy the `AccountOrder` type shape (or import it if it is exported), the order card JSX structure, the status badge/color logic, and the currency formatting utility. This page must match that card design.

3. **Read** `apps/web/src/app/account/orders/[id]/page.tsx` briefly to confirm the directory and understand any local utilities already present.

4. **Create** `apps/web/src/app/account/orders/page.tsx` with the following top-level structure:

   ```
   'use client';

   imports (React, Mantine components, hooks, api services, store, theme tokens, useReorder)

   [local interface definitions: Order / AccountOrder with productId on items]

   export default function OrdersPage() {
     [auth hook — same pattern as account/page.tsx]
     [orders state: useState<AccountOrder[]>([]) ]
     [loadingOrders state: useState(true)]
     [error state: useState<string | null>(null)]
     [router: useRouter()]
     [useReorder(true) destructuring]

     [useEffect: fetch orders on mount]

     return (
       <Box ...>
         <HeaderBar />
         <Stack p={spacing.md} gap={spacing.md}>
           {loadingOrders ? <SkeletonCards /> : null}
           {!loadingOrders && orders.length === 0 ? <EmptyState /> : null}
           {!loadingOrders && orders.map(order => <OrderCard key={order.id} order={order} />)}
         </Stack>
         <ConfirmDialog ... />
       </Box>
     );
   }
   ```

5. **Implement the fetch `useEffect`**:
   - Guard: if `!auth?.user?.customerId` return
   - Call `ordersApi.getAll({ customerId: auth.user.customerId, page: 1, limit: 20 })`
   - On success: unwrap the response (the same envelope pattern used in account/page.tsx: `response.data?.data?.data || response.data?.data || []`), call `setOrders(data)`
   - On error: call `setError('Failed to load orders')`
   - In `finally`: call `setLoadingOrders(false)`

6. **Implement the skeleton**:
   ```tsx
   {Array.from({ length: 4 }).map((_, i) => (
     <Card key={i} radius={radius.md}>
       <Stack gap={spacing.sm}>
         <Skeleton height={16} width="55%" radius="sm" />
         <Skeleton height={12} width="40%" radius="sm" />
         <Skeleton height={14} width="70%" radius="sm" />
         <Skeleton height={44} radius="md" />
       </Stack>
     </Card>
   ))}
   ```

7. **Implement the order card** — copy the card structure from `account/page.tsx` order cards. Key elements:
   - `Card` with `borderRadius: radius.md`, border, background `colors.background`
   - `Stack gap={spacing.sm}` inside
   - `Group justify="space-between"`: order number `Text` + status `Badge`
   - Status label + date `Text`
   - Item count + formatted total `Group`
   - `Group grow` with "View Details" `Button` and "Reorder" `Button`

8. **Apply the Reorder button props**:
   ```tsx
   <Button
     onClick={() => handleReorder(order)}
     loading={reorderingOrderId === order.id}
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
   ```

9. **Render the `ConfirmDialog`** once, outside the map loop:
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

10. **Implement the header bar**:
    ```tsx
    <Group justify="space-between" align="center" p={spacing.md} style={{ borderBottom: `1px solid ${colors.border}` }}>
      <ActionIcon variant="subtle" onClick={() => router.back()} aria-label="Go back">
        {/* back arrow icon — match the icon used on the [id] detail page header */}
      </ActionIcon>
      <Text size="lg" fw={typography.fontWeight.bold}>My Orders</Text>
      <Box w={34} /> {/* spacer */}
    </Group>
    ```

11. **Verify** the local `AccountOrder` / `Order` interface includes `productId: string` on each item — the `useReorder` hook's `ReorderOrderItem` requires it.

---

## Dependencies

- **Task 1 must be complete** — `useReorder` must exist in `apps/web/src/hooks/use-api.ts`.
- Task 2 has no dependency relationship with Task 3 — they can be worked in parallel after Task 1 is done.
