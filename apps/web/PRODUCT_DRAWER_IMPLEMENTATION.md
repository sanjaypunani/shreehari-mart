# Product Detail Drawer Implementation

## Overview

Implemented a bottom drawer (sheet) component that opens when clicking on a product image or the plus icon in the product grid.

## Components Created

### 1. ProductDetailDrawer Component

**Location:** `apps/web/src/components/products/ProductDetailDrawer.tsx`

**Features:**

- Bottom positioned drawer using Mantine's Drawer component
- Rounded top corners (using theme radius.xl)
- Sticky header with close button
- Product image display with discount badge
- Product name and quantity information
- Price display (current and original with strikethrough)
- Quantity controls (increment/decrement)
- Add to cart button
- Uses global theme variables (colors, spacing, radius, typography)

**Props:**

- `opened`: boolean - Controls drawer visibility
- `onClose`: function - Handler for closing the drawer
- `product`: object - Product data to display

## Changes Made

### 1. ProductDetailDrawer.tsx (New File)

- Created complete drawer UI matching the reference design
- Integrated with global theme variables
- Implemented quantity controls (static UI only)
- Responsive layout with proper spacing

### 2. root.tsx

- Added state management for drawer (`drawerOpened`, `selectedProduct`)
- Updated `handleProductClick` to open drawer with selected product
- Updated `handleAddToCart` to open drawer with selected product
- Added `ProductDetailDrawer` component to render tree

### 3. ProductCard.tsx

- Removed click handler from outer Box
- Added click handler directly to image container
- Made image container independently clickable
- Plus button continues to trigger add to cart action

### 4. index.ts (products)

- Exported `ProductDetailDrawer` component
- Exported `ProductDetailDrawerProps` type

## Theme Integration

The component uses the following theme variables:

- **Colors:** `colors.primary`, `colors.background`, `colors.surface`, `colors.border`, `colors.text.primary`, `colors.text.secondary`, `colors.text.inverse`, `colors.success`
- **Spacing:** `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`
- **Radius:** `radius.sm`, `radius.md`, `radius.lg`, `radius.xl`
- **Typography:** `typography.fontWeight.medium`, `typography.fontWeight.semibold`, `typography.fontWeight.bold`, `typography.lineHeight.tight`

## User Interactions (Static UI)

1. **Click on product image** → Opens drawer with product details
2. **Click on plus icon** → Opens drawer with product details
3. **Click close (X) button** → Closes drawer
4. **Click outside drawer** → Closes drawer (Mantine default behavior)
5. **Increment/Decrement quantity** → Updates quantity display (no cart functionality)
6. **Click ADD button** → No action (static UI only)

## Design Features

- Rounded top corners for modern look
- Smooth drawer animation (Mantine default)
- Discount badge displayed prominently
- Clean, minimalist layout
- Proper spacing and visual hierarchy
- Mobile-friendly bottom sheet design
- Matches reference image design

## Next Steps (Future Implementation)

- Add actual cart functionality
- Implement quantity persistence
- Add product details/description
- Add product variants (if applicable)
- Connect to backend API for real product data
- Add loading states
- Add error handling
