# Frontend Task 7 — Web Full-Screen Search

**Track:** Web Frontend
**Depends on:** Task 6 (web hooks and `useProducts` with `categoryId` param)
**Blocks:** Nothing (final web task)

---

## Objective

Deliver the full-screen product search experience on the web app:

1. Create `ProductSearchDialog` — a full-screen Mantine `Modal` with debounced search input, loading/empty/results states, and add-to-cart functionality.
2. Modify `MobileHeader` to open `ProductSearchDialog` when the read-only `SearchInput` is clicked or focused.

---

## Files Changed

| File | Status |
|------|--------|
| `apps/web/src/components/ProductSearchDialog.tsx` | New |
| `apps/web/src/components/MobileHeader.tsx` | Modified |

---

## Implementation Steps

### Step 1 — `apps/web/src/components/ProductSearchDialog.tsx` (new file)

Create the full-screen search dialog. The complete reference implementation is in `ui-spec-category-search.md` section 8. Below is the authoritative specification.

#### File header
```typescript
'use client';
```

#### Imports
```typescript
import React, { useEffect } from 'react';
import { Modal, Box, Group, ActionIcon, ScrollArea, Loader, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconArrowLeft, IconX, IconPlus } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../theme';
import { Text, SearchInput, Image } from './ui';
import { useProducts } from '../hooks/use-api';
import { useCartStore } from '../store/cart-store';
import { toApiAssetUrl } from '../config/api';
import { ProductDto } from '@shreehari/types';
```

`Text`, `SearchInput`, and `Image` are imported from `'./ui'` (local design system), NOT from `@mantine/core`. This matches the pattern in `CategoryDetail.tsx` and `MobileHeader.tsx`.

#### Props interface
```typescript
interface ProductSearchDialogProps {
  opened: boolean;
  onClose: () => void;
}
```

#### State
```typescript
const [searchQuery, setSearchQuery] = React.useState('');
const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
```

#### Hooks
```typescript
const addItem = useCartStore((state) => state.addItem);

const { data: productsResponse, isLoading } = useProducts(
  { search: debouncedQuery, isAvailable: true, limit: 30 },
  { enabled: debouncedQuery.length >= 2 }
);

const products = productsResponse?.data ?? [];
```

`enabled: debouncedQuery.length >= 2` — no API call fires while query is fewer than 2 characters.

#### Reset effect
```typescript
useEffect(() => {
  if (!opened) {
    setSearchQuery('');
  }
}, [opened]);
```

#### `handleAddToCart` function
Exact field mapping from `CategoryDetail.tsx`:
```typescript
const handleAddToCart = (product: ProductDto) => {
  addItem({
    id: product.id,
    name: product.name,
    image: toApiAssetUrl(product.imageUrl),
    price: parseFloat(product.price.toString()),
    unit: product.unit,
    productQuantity: `${product.quantity}${product.unit}`,
    orderedQuantity: product.quantity,
    baseQuantity: product.quantity,
    basePrice: parseFloat(product.price.toString()),
    baseUnit: product.unit,
    isAvailable: true,
  });
};
```

#### Modal config
```tsx
<Modal
  opened={opened}
  onClose={onClose}
  fullScreen
  withCloseButton={false}
  padding={0}
  aria-label="Product search"
  styles={{
    body: { height: '100%', display: 'flex', flexDirection: 'column' },
    content: { height: '100dvh' },
  }}
>
```

`fullScreen` fills the viewport. `withCloseButton={false}` removes the default X button — the back arrow `ActionIcon` serves as the close trigger.

#### Dialog header (sticky)
```tsx
<Box
  style={{
    backgroundColor: colors.background,
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: shadow.sm,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  }}
>
  <Group gap={spacing.sm} align="center">
    <ActionIcon variant="transparent" color="dark" onClick={onClose} aria-label="Close search">
      <IconArrowLeft size={24} />
    </ActionIcon>
    <Box style={{ flex: 1 }}>
      <SearchInput
        placeholder='Search for "Tomatoes"'
        size="md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        data-autofocus
        autoFocus
        aria-label="Search products"
        aria-autocomplete="list"
        aria-controls="search-results-list"
      />
    </Box>
    {searchQuery.length > 0 && (
      <ActionIcon variant="transparent" color="gray" onClick={() => setSearchQuery('')} aria-label="Clear search">
        <IconX size={20} />
      </ActionIcon>
    )}
  </Group>
</Box>
```

#### Results area (four mutually exclusive states)

Wrap all states in a single `<ScrollArea style={{ flex: 1 }} id="search-results-list">`:

**Idle state** (`debouncedQuery.length < 2`):
```tsx
<Box p={spacing.lg} style={{ textAlign: 'center', paddingTop: '64px' }}>
  <Text variant="secondary" size="md">Search for products…</Text>
  <Text variant="secondary" size="sm" style={{ marginTop: spacing.xs }}>
    Type at least 2 characters to see results
  </Text>
</Box>
```

**Loading state** (`debouncedQuery.length >= 2 && isLoading`):
```tsx
<Box p={spacing.lg} style={{ display: 'flex', justifyContent: 'center', paddingTop: '64px' }}>
  <Loader size="md" color={colors.primary} />
</Box>
```

**Empty results** (`debouncedQuery.length >= 2 && !isLoading && products.length === 0`):
```tsx
<Box p={spacing.lg} style={{ textAlign: 'center', paddingTop: '64px' }}>
  <Text variant="secondary" size="md">
    No products found for &ldquo;{debouncedQuery}&rdquo;
  </Text>
</Box>
```

**Results list** (`debouncedQuery.length >= 2 && !isLoading && products.length > 0`):
```tsx
<Stack gap={0} role="list" aria-label="Search results">
  {products.map((product: ProductDto) => (
    <Box
      key={product.id}
      role="listitem"
      style={{
        borderBottom: `1px solid ${colors.border}`,
        padding: `${spacing.sm} ${spacing.md}`,
      }}
    >
      <Group gap={spacing.sm} justify="space-between" align="center">
        {/* Product image + info */}
        <Group gap={spacing.sm} style={{ flex: 1, minWidth: 0 }}>
          <Box style={{
            width: 56, height: 56,
            borderRadius: radius.sm,
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: colors.surface,
          }}>
            <Image
              src={toApiAssetUrl(product.imageUrl)}
              alt={product.name}
              width="100%"
              height="100%"
              fit="contain"
              withPlaceholder
            />
          </Box>
          <Box style={{ minWidth: 0 }}>
            <Text
              size="sm"
              fw={typography.fontWeight.semibold}
              variant="primary"
              style={{ lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {product.name}
            </Text>
            <Text variant="secondary" size="xs" style={{ marginTop: 2 }}>
              {product.quantity}{product.unit}
            </Text>
            <Text size="sm" fw={typography.fontWeight.bold} style={{ color: colors.text.primary, marginTop: 4 }}>
              ₹{product.price}
            </Text>
          </Box>
        </Group>

        {/* Add button */}
        <ActionIcon
          size={36}
          radius="md"
          variant="outline"
          onClick={() => handleAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
          style={{
            backgroundColor: 'white',
            borderColor: colors.primary,
            color: colors.primary,
            borderWidth: '1px',
            flexShrink: 0,
          }}
        >
          <IconPlus size={18} strokeWidth={2.5} />
        </ActionIcon>
      </Group>
    </Box>
  ))}
</Stack>
```

---

### Step 2 — `apps/web/src/components/MobileHeader.tsx`

#### 2a. Add imports

```typescript
import { useDisclosure } from '@mantine/hooks';
import { ProductSearchDialog } from './ProductSearchDialog';
```

#### 2b. Add `useDisclosure` at top of `MobileHeader` function body

```typescript
const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
```

#### 2c. Replace the existing `<SearchInput>` with a read-only trigger

```tsx
// BEFORE:
<SearchInput placeholder='Search for "Grapes"' size="md" />

// AFTER:
<SearchInput
  placeholder='Search for "Grapes"'
  size="md"
  readOnly
  onClick={openSearch}
  onFocus={openSearch}
  style={{ cursor: 'pointer' }}
  aria-label="Open product search"
  aria-haspopup="dialog"
/>
```

`readOnly` prevents the mobile keyboard from appearing before the dialog opens. The actual editable input is inside `ProductSearchDialog`. `SearchInput` extends `TextInputProps` from `@mantine/core`, which supports all standard HTML input attributes including `readOnly`, `onClick`, and `onFocus`.

#### 2d. Conditionally mount `ProductSearchDialog`

Add at the bottom of the `MobileHeader` return statement, inside the outer `<Box>`:

```tsx
{searchOpened && (
  <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
)}
```

Conditional mounting (`{searchOpened && ...}`) ensures `searchQuery` state in `ProductSearchDialog` resets to `''` every time the dialog opens, since the component unmounts when closed.

---

## Accessibility Checklist

All of the following must be present:

| Element | Attribute |
|---------|-----------|
| `<Modal>` | `aria-label="Product search"` |
| Back `ActionIcon` | `aria-label="Close search"` |
| `SearchInput` inside dialog | `aria-label="Search products"`, `aria-autocomplete="list"`, `aria-controls="search-results-list"` |
| Clear `ActionIcon` | `aria-label="Clear search"` |
| `ScrollArea` | `id="search-results-list"` |
| Results `Stack` | `role="list"`, `aria-label="Search results"` |
| Each result `Box` | `role="listitem"` |
| Each Add `ActionIcon` | `aria-label={"Add " + product.name + " to cart"}` |
| `SearchInput` in `MobileHeader` | `aria-label="Open product search"`, `aria-haspopup="dialog"` |

Mantine `Modal` provides `role="dialog"`, `aria-modal="true"`, Escape key close, backdrop click close, and focus trap automatically.

---

## Acceptance Criteria

1. Clicking (or tabbing to focus) the `SearchInput` in `MobileHeader` opens `ProductSearchDialog` as a full-screen modal.
2. `ProductSearchDialog` opens with `SearchInput` auto-focused.
3. Initial state shows "Search for products…" / "Type at least 2 characters to see results".
4. Typing 1 character does not trigger an API call.
5. Typing 2+ characters, after 300 ms debounce, triggers `GET /api/products?search=<query>&isAvailable=true&limit=30`.
6. While loading, a centered `Loader` spinner renders.
7. When results arrive, scrollable result rows render with image, name, quantity/unit, price, and an Add button.
8. Tapping "Add" on a result calls `useCartStore.addItem` with the correct field mapping (verify `price` is `parseFloat(product.price.toString())`, not a raw string).
9. The cart count in `CartBar` increments after adding.
10. Pressing Escape closes the dialog.
11. Clicking the back arrow `ActionIcon` closes the dialog.
12. Closing and re-opening resets the search input to empty.
13. When results are empty, "No products found for …" renders.
14. The `readOnly` `SearchInput` in `MobileHeader` does NOT open the mobile keyboard on tap.
15. All ARIA attributes from the checklist above are present in the rendered DOM.
16. `tsc --noEmit` passes for `apps/web`.
17. `nx serve web` starts without errors.

---

## Dependencies

- **Task 6** must be complete: `useProducts` hook accepts `{ search, isAvailable, limit }` params with `{ enabled }` option; `toApiAssetUrl` is importable.
- **Task 3** must be complete: `GET /api/products?search=` returns results using `ILIKE` search.
