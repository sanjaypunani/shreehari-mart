# UI Specification: Reorder Feature

**Status:** Draft
**Date:** 2026-03-19
**Scope:** `apps/web/` (Next.js 16) — frontend only
**Linked PRD:** `docs/prd-reorder-feature.md`

---

## 1. Surfaces & Entry Points

The Reorder button appears on three surfaces. In every case the button is visible regardless of order status (pending, out_for_delivery, delivered, cancelled).

### 1.1 Account Page (`/account`) — Order Cards

**Status:** Button already exists as a live implementation (not a placeholder).
**Location:** Inside each order card rendered in the "Past Orders" `InfoSection`. The card contains a `<Group grow>` at the bottom with two equal-width buttons side by side.

```
[ View Details ]  [ Reorder ]
  (outline)         (filled/primary)
```

Left button: "View Details" navigates to `/account/orders/{id}`.
Right button: "Reorder" triggers `handleReorder(order)`.

### 1.2 Order List Page (`/account/orders`)

**Status:** Page file does not currently exist at `apps/web/src/app/account/orders/page.tsx`. It must be created.
**Location:** Each order row/card must include a "Reorder" button, following the same two-button row pattern as the account page (View Details + Reorder).

### 1.3 Order Detail Page (`/account/orders/[id]`)

**Status:** Page exists at `apps/web/src/app/account/orders/[id]/page.tsx`. The Reorder button must be added.
**Location:** Below the Bill Details card, as a full-width primary action button at the bottom of the scrollable content stack. Render only when `order` is non-null and not in a loading/error state.

---

## 2. Component Inventory

| Component | Source | Usage |
|-----------|--------|-------|
| `Button` (Mantine, direct) | `@mantine/core` | Reorder button on all three surfaces — used directly (not via the custom `Button` wrapper) as seen in `account/page.tsx` |
| `Button` (custom wrapper) | `apps/web/src/components/ui/Button.tsx` | Available if a clean `variant="primary"` shorthand is preferred in new surfaces |
| `Modal` (custom wrapper) | `apps/web/src/components/ui/Modal.tsx` | Base for `ConfirmDialog` |
| `ConfirmDialog` | `apps/web/src/components/ui/Modal.tsx` | Cart conflict confirmation dialog |
| `notifications` | `@mantine/notifications` | Success, warning, and error toasts |
| `Loader` | `@mantine/core` | Rendered inside the Reorder button during loading state (via Mantine `loading` prop) |
| `Card` | `@mantine/core` | Order cards on all list surfaces |
| `Group` | `@mantine/core` | Two-button row layout |
| `Stack` | `@mantine/core` | Vertical layout within cards and page content |
| `Badge` | `@mantine/core` | Order status badge on order cards |
| `Text` (custom wrapper) | `apps/web/src/components/ui/Text.tsx` | All text within order cards and modals |
| `useDisclosure` | `@mantine/hooks` | Controls the `ConfirmDialog` open/close state |
| `useCartStore` | `apps/web/src/store/cart-store.ts` | Reads `items` (to detect non-empty cart), calls `addItem`, calls `clearCart` |
| `productsApi` | `apps/web/src/lib/api/services` | `productsApi.getById(productId)` for each order item |
| `calculateItemPrice` | `apps/web/src/utils/index.ts` | Computes `CartItem.price` with correct unit conversion: `calculateItemPrice(item.orderedQuantity, item.unit, product.basePrice, product.baseQuantity, product.baseUnit)` — must be used on all new surfaces; do not use raw `basePrice` |
| `useRouter` | `next/navigation` | `router.push('/cart')` after successful reorder |

---

## 3. Reorder Button States

All three surfaces use the Mantine `Button` component directly (matching the existing account page implementation). Props below reflect the exact pattern used in `account/page.tsx`.

### 3.1 Normal State

```tsx
<Button
  onClick={() => handleReorder(order)}
  aria-label="Reorder items from this order"
  style={{
    minHeight: 44,
    borderRadius: radius.md,           // 12px
    backgroundColor: colors.primary,   // #247c62
    fontWeight: typography.fontWeight.semibold,
  }}
>
  Reorder
</Button>
```

- Label: `"Reorder"`
- Background: `colors.primary` (`#247c62`)
- Text color: `colors.text.inverse` (white — Mantine filled button default)
- Height: minimum 44px (touch target)
- Border radius: `radius.md` (12px)

### 3.2 Loading State

```tsx
<Button
  onClick={() => handleReorder(order)}
  loading={reorderingOrderId === order.id}   // account page pattern
  // OR: loading={isReordering}               // order detail / list page pattern
  disabled                                    // implicit when loading=true in Mantine
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

- Mantine `loading` prop replaces button content with a `Loader` spinner automatically.
- Button is implicitly disabled while `loading={true}` — no additional `disabled` prop required.
- Spinner color: white (Mantine default for filled buttons).
- The button label text `"Reorder"` is hidden/replaced by the spinner during loading.
- Only the button for the order currently being reordered enters loading state; other order buttons remain interactive. On the account page this is controlled by `reorderingOrderId === order.id`. On the detail page a local `isReordering` boolean is sufficient.

### 3.3 Disabled State (no items)

```tsx
<Button
  onClick={() => handleReorder(order)}
  disabled={!order.items?.length}
  aria-label="Reorder items from this order"
  style={{ ... }}
>
  Reorder
</Button>
```

- Applied when the order has zero items (`order.items?.length === 0` or `undefined`).
- Mantine applies `opacity: 0.6` and `pointer-events: none` automatically via the `disabled` prop.
- Label remains `"Reorder"` — no alternate text for the disabled state.

---

## 4. Cart Conflict Modal

When the customer taps "Reorder" and `useCartStore.getState().items.length > 0`, the `ConfirmDialog` component is shown before any loading or fetching begins.

### 4.1 Component

Use the existing `ConfirmDialog` from `apps/web/src/components/ui/Modal.tsx`.

### 4.2 Props

```tsx
<ConfirmDialog
  isOpen={confirmOpen}                  // controlled by useDisclosure()
  onClose={closeConfirm}                // called on Cancel or backdrop click
  onConfirm={handleConfirmReorder}      // called on "Replace Cart"
  title="Replace your cart?"
  message="Your cart has existing items. Do you want to replace them with this order?"
  confirmText="Replace Cart"
  cancelText="Cancel"
  variant="warning"
  loading={false}                       // loading prop not used here; loading state begins after confirm
/>
```

### 4.3 Exact Text Strings

| Property | Value |
|----------|-------|
| `title` | `"Replace your cart?"` |
| `message` | `"Your cart has existing items. Do you want to replace them with this order?"` |
| `confirmText` | `"Replace Cart"` |
| `cancelText` | `"Cancel"` |

### 4.4 Button Styling Inside ConfirmDialog

Per the `ConfirmDialog` implementation in `Modal.tsx`:

- Cancel button: Mantine `Button` with `variant="outline"` — disabled while `loading`.
- Confirm button: Mantine `Button` with `variant={getConfirmButtonVariant()}` — for `variant="warning"` this resolves to `"warning"`. The button also accepts a `loading` prop.
- Buttons are right-aligned via `Group justify="flex-end"`.

### 4.5 Behavior

| Action | Result |
|--------|--------|
| Customer taps "Replace Cart" | `onConfirm()` called → `clearCart()` → `closeConfirm()` → loading state starts → fetch begins |
| Customer taps "Cancel" | `onClose()` called → modal closes, cart unchanged, button returns to normal state |
| Customer taps backdrop | Same as "Cancel" (Mantine default: `closeOnClickOutside={true}` when not loading) |
| Customer presses Escape | Same as "Cancel" (Mantine default: `closeOnEscape={true}`) |
| Focus trap | Mantine `Modal` traps focus inside the dialog automatically |

### 4.6 State Management

```tsx
const [confirmOpen, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
const pendingOrderRef = React.useRef<AccountOrder | null>(null);

const handleReorder = (order: AccountOrder) => {
  const cartItems = useCartStore.getState().items;
  if (cartItems.length > 0) {
    pendingOrderRef.current = order;
    openConfirm();
  } else {
    executeReorder(order);
  }
};

const handleConfirmReorder = () => {
  useCartStore.getState().clearCart();
  // NOTE: ConfirmDialog calls onClose() (= closeConfirm) internally alongside onConfirm().
  // Do NOT call closeConfirm() here — it will be called automatically, and calling it
  // again would cause a double-close / state flicker.
  if (pendingOrderRef.current) {
    executeReorder(pendingOrderRef.current);
    pendingOrderRef.current = null;
  }
};
```

---

## 5. Toast Notifications

All toasts use `notifications.show(...)` from `@mantine/notifications`. Toasts are non-blocking and auto-dismiss.

### 5.1 Partial Skip Warning (some items added, some skipped)

Shown when at least one item was added to the cart but one or more items were skipped (fetch failed or `isAvailable === false`). The app still navigates to `/cart` after this toast.

```ts
notifications.show({
  color: 'yellow',
  title: 'Some items were unavailable',
  message: `The following items could not be added: ${skippedNames.join(', ')}.`,
  autoClose: 6000,
});
```

- `skippedNames` is an array of `item.productName` strings (sourced from the order item, not the failed fetch response).
- Toast is shown before `router.push('/cart')`.
- `autoClose: 6000` — 6 seconds, giving the customer time to read the product list.

### 5.2 All Items Failed — Error Toast (zero items added)

Shown when every product fetch failed or every product is unavailable. Navigation to `/cart` does NOT occur.

```ts
notifications.show({
  color: 'red',
  title: 'Unable to reorder',
  message: 'None of the items could be added. They may be unavailable.',
  autoClose: 5000,
});
```

- Customer remains on the current page.
- Button returns to normal state after the toast appears.

### 5.3 Success Toast (all items added, none skipped)

Shown when all items were successfully fetched and added. The app navigates to `/cart`.

```ts
notifications.show({
  color: 'green',
  title: 'Added to cart',
  message: 'Items from this order were added to your cart.',
  autoClose: 3000,
});
```

Note: The existing account page implementation already uses this exact toast text. This spec codifies it as the standard.

### 5.4 Toast Priority Order

If skipped items exist alongside successfully added items, show the yellow warning toast (5.1) instead of the green success toast (5.3). The two are mutually exclusive: show the warning when `skippedNames.length > 0`, show success when `skippedNames.length === 0`.

---

## 6. Screen-by-Screen Specs

### 6.1 Account Page (`/account`) — Order Card

**File:** `apps/web/src/app/account/page.tsx`

**Status:** Implementation complete. Spec documents the existing behavior.

**Card structure (existing):**

```
Card (borderRadius: radius.md, border: 1px solid colors.border, bg: colors.background)
└── Stack (gap: spacing.sm)
    ├── Group (justify: space-between, align: flex-start)
    │   ├── Text (size: sm, fw: semibold)  → "Order #XXXXXXXX"
    │   └── Badge (size: sm, radius: xl)   → status label with statusToneMap colors
    ├── Text (size: xs, variant: secondary)  → "{statusLabel} • {date}"
    ├── Group (justify: space-between, align: center)
    │   ├── Text (size: sm, variant: secondary)  → "{n} items"
    │   └── Text (size: sm, fw: bold)             → formatted currency total
    └── Group (grow)                               ← button row
        ├── Button (variant: default, outline style)  → "View Details"
        └── Button (filled, backgroundColor: colors.primary)  → "Reorder"
```

**Reorder button — account page specific:**

- Loading guard: `loading={reorderingOrderId === order.id}` — only one order can be reordering at a time across the entire order list.
- While any order is reordering: `if (!order.items?.length || reorderingOrderId) return;` prevents double-trigger.
- Cart conflict check: Current implementation on the account page does NOT show the `ConfirmDialog` — it calls `handleReorder` which proceeds directly. The ConfirmDialog must be added to match the PRD requirement (see Section 4).

**Gap from PRD (requires fix):** The existing `handleReorder` on the account page does not check if the cart is non-empty before fetching. The `ConfirmDialog` flow must be implemented here.

### 6.2 Order List Page (`/account/orders`)

**File:** `apps/web/src/app/account/orders/page.tsx` (does not yet exist — must be created)

**Layout:**

```
Box (minHeight: 100vh, bg: colors.surface, pb: calc(90px + safe-area-bottom))
└── [Header Bar]
    ├── ActionIcon (back arrow) → router.back()
    ├── Text (size: lg, fw: bold) → "My Orders"
    └── Box (w: 34) [spacer]
└── Stack (p: spacing.md, gap: spacing.md)
    └── [Order list — same card structure as Section 6.1]
```

**Order card — same structure as account page (Section 6.1).**

**Reorder button — order list page specific:**

- Loading state: `loading={reorderingOrderId === order.id}` with local `useState<string | null>(null)`.
- The `ConfirmDialog` must be included (see Section 4).
- Each order item must include `productId` — ensure the orders API call fetches items with `productId`.
- `CartItem.price` must be computed via `calculateItemPrice(item.orderedQuantity, item.unit, product.basePrice, product.baseQuantity, product.baseUnit)` from `apps/web/src/utils/index.ts` — do not assign `basePrice` directly.
- `aria-label="Reorder items from this order"` on every Reorder button.

**Empty state:**

```
Stack (align: center, gap: spacing.sm, py: spacing.lg)
├── Text (size: md, fw: bold) → "No orders yet"
└── Text (size: sm, variant: secondary, ta: center) → "Start shopping fresh vegetables"
```

**Loading skeleton (per card, while fetching orders):**

```
Card (borderRadius: radius.md)
└── Stack (gap: spacing.sm)
    ├── Skeleton (height: 16, width: "55%", radius: sm)
    ├── Skeleton (height: 12, width: "40%", radius: sm)
    ├── Skeleton (height: 14, width: "70%", radius: sm)
    └── Skeleton (height: 44, radius: md)   ← represents button row
```

### 6.3 Order Detail Page (`/account/orders/[id]`)

**File:** `apps/web/src/app/account/orders/[id]/page.tsx`

**Current state:** No Reorder button exists. Must be added below the Bill Details card.

**Where to insert:**

The `<Stack p={spacing.md} gap={spacing.md}>` that wraps the page content currently ends after the Bill Details `Card`. Add the Reorder button as a new element inside this Stack, after the Bill Details card, conditional on `order !== null`.

**Button placement:**

```tsx
{order && (
  <Button
    fullWidth
    size="md"
    onClick={() => handleReorder(order)}
    loading={isReordering}
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

- `fullWidth` — the button spans the full content width, consistent with the primary action pattern used elsewhere in the app (e.g., cart page CTA).
- `size="md"` — standard size for standalone action buttons.
- `isReordering` — local `useState<boolean>(false)` in the detail page.
- The `ConfirmDialog` must also be rendered in this page (see Section 4).

**`calculateItemPrice` usage (required):**

`CartItem.price` must be computed via `calculateItemPrice(item.orderedQuantity, item.unit, product.basePrice, product.baseQuantity, product.baseUnit)` imported from `apps/web/src/utils/index.ts`. Do not assign raw `basePrice` or any historical price.

**Interface extension required:**

The `AccountOrderItem` interface in `apps/web/src/app/account/orders/[id]/page.tsx` currently lacks `productId`. It must be extended:

```ts
interface AccountOrderItem {
  id: string;
  productId: string;    // ADD THIS — required for reorder fetch
  productName: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
  finalPrice: number;
}
```

The `normalizeOrder` function must also extract `productId` from the API payload:

```ts
productId: String(resolvedItem.productId || ''),
```

If `productId` is an empty string (legacy order), the item is silently skipped during reorder without crashing.

---

## 7. Interaction Flow Diagram (ASCII)

```
Customer taps "Reorder" button
         |
         v
  [Guard: items?.length > 0?]
         |
    No --+--------> Return early (no-op)
         |
        Yes
         |
         v
  [Check cart: items.length > 0?]
         |
    No --+--------> Skip to [FETCH]
         |
        Yes
         |
         v
  [Show ConfirmDialog]
  "Replace your cart?"
  [Replace Cart] / [Cancel]
         |              |
      Cancel           OK
         |              |
    (modal closes)   clearCart()
    (no change)         |
                        |
                        v
                    [FETCH]
                        |
                  Button → loading=true
                  (spinner, disabled)
                        |
                        v
         Promise.allSettled(
           order.items.map(item =>
             productsApi.getById(item.productId)
           )
         )
          /                  \
    fulfilled              rejected
    + isAvailable=true    OR isAvailable=false
         |                    |
      Build CartItem       Record skipped name
      addItem(cartItem)    (from item.productName)
         |
         v
  [After all settled]
         |
  Any items added?
         |              |
        Yes            No
         |              |
  skipped > 0?    Show error toast:
    |       |     "None of the items
   Yes      No    could be added."
    |       |          |
  Show    Show    button → normal
  yellow  green   Stay on page
  warning success
  toast   toast
    |       |
    +-------+
         |
         v
   router.push('/cart')
         |
         v
   Cart page (/cart)
   [Pre-filled with reordered items at current prices]
```

---

## 8. Edge Cases & Empty States

### 8.1 Zero Items Added (all fetches failed or all products unavailable)

- Do NOT navigate to `/cart`.
- Show the red error toast (Section 5.2): `"None of the items could be added. They may be unavailable."`
- Return the Reorder button to normal state (not loading, not disabled).
- Customer remains on the current page with no cart changes.

### 8.2 All Items Failed Due to Network Error

- Same outcome as 8.1. `Promise.allSettled` ensures a network error on one product does not block others; if all reject, zero items are added.
- The error toast message is the same generic message — individual network error details are not surfaced to the customer.

### 8.3 Legacy Order Without `productId`

- If `item.productId` is missing (`""`, `undefined`, or `null` after normalization), skip that item silently.
- Do not include it in the `Promise.allSettled` call — filter items first: `order.items.filter(item => !!item.productId)`.
- If filtering results in an empty array (all items lack `productId`), treat as the "zero items" case (8.1) and show the error toast.
- No crash, no console error surfaced to the user.

### 8.4 Product Fetched Successfully but `isAvailable === false`

- Skip the item (do not add to cart).
- Add `item.productName` (from the order item, not the fetch response) to the skipped names list.
- Show yellow warning toast listing the skipped product names if any items were successfully added alongside this skip.
- If all items are skipped due to unavailability, show the red error toast (8.1).

### 8.5 Order with No Items (`items` is empty array or undefined)

- The Reorder button is rendered as `disabled` (see Section 3.3).
- The `handleReorder` guard `if (!order.items?.length || ...) return;` prevents execution.
- No modal, no toast, no navigation.

### 8.6 Order Detail Page — Error Loading Order

- If `order === null` (load failed or not yet loaded), the Reorder button is not rendered at all.
- The error `Alert` is shown instead.
- This prevents attempting a reorder on a partially-loaded or errored order.

### 8.7 Double-Tap Prevention

- On the account page: `reorderingOrderId` state ensures `handleReorder` returns immediately if any reorder is already in progress (`if (!order.items?.length || reorderingOrderId) return;`).
- On the detail page: `loading={isReordering}` makes the button disabled+loading, preventing interaction.
- On the list page: same `reorderingOrderId` pattern as the account page.

---

## 9. Accessibility

### 9.1 Reorder Button

```tsx
aria-label="Reorder items from this order"
```

- Applied on all three surfaces.
- When the button is in loading state, the `aria-label` remains unchanged — Mantine's `loading` prop adds `aria-disabled="true"` and `data-loading="true"` attributes automatically.
- Minimum tap target: `minHeight: 44px` satisfies WCAG 2.5.5 (Target Size).

### 9.2 ConfirmDialog (Cart Conflict Modal)

- Mantine `Modal` traps focus within the dialog when open — no additional implementation required.
- Dismissible via Escape key: Mantine default `closeOnEscape={true}` (inherited through `ConfirmDialog → Modal`).
- Dismissible via backdrop click: `closeOnClickOutside={true}` (Mantine default; overridden to `false` while `loading` per the `ConfirmDialog` implementation).
- Cancel and Confirm buttons are reachable via Tab key within the focus trap.
- The modal `title` ("Replace your cart?") is announced by screen readers as the accessible name of the dialog.

### 9.3 Toast Notifications

- `notifications.show(...)` from `@mantine/notifications` renders notifications in a live region by default — screen readers announce new toasts automatically.
- `autoClose` durations are set long enough to read: 3s for success, 6s for partial-skip warnings (product name lists may be long), 5s for error.

### 9.4 Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Moves focus between "View Details" and "Reorder" buttons in the button row |
| Enter / Space | Activates the focused button |
| Escape | Closes the ConfirmDialog if open |
| Tab (in modal) | Cycles between Cancel and Replace Cart buttons (focus trap) |

### 9.5 Color Contrast

- Reorder button: white text (`colors.text.inverse`) on `#247c62` background. Contrast ratio ≈ 4.6:1 — meets WCAG AA (3:1 minimum for large text, 4.5:1 for normal text).
- Error toast: Mantine red color token — meets Mantine's built-in contrast requirements.
- Warning toast: Mantine yellow color token — verify contrast with Mantine's default yellow; use `color: 'orange'` if yellow fails AA contrast in the notification context.
