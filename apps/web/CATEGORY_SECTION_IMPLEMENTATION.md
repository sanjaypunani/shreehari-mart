# Category Section Components - Implementation Guide

## ✅ Components Created

### Overview

Created a modular, reusable category section following the theme system and UI component standards for the mobile-first grocery shopping app.

---

## Component Structure

```
components/
└── home/
    ├── CategoryCard.tsx       // Individual category card
    ├── CategoryGrid.tsx       // Grid layout for categories
    └── index.ts              // Export barrel
```

---

## 1. CategoryCard Component

**File**: `components/home/CategoryCard.tsx`

### Purpose

Displays a single category with image and name, with hover effects and click handling.

### Props Interface

```tsx
interface CategoryCardProps {
  id: string; // Unique category identifier
  name: string; // Category display name
  image: string; // Category image URL
  onClick?: (id: string) => void; // Click handler
}
```

### Features

✅ **Theme Integration**

- Uses `colors`, `spacing`, `radius`, `shadow`, `typography` from theme
- Consistent with global design system

✅ **Responsive Design**

- Aspect ratio 1:1 for square images
- Flexible width (100%)
- Word break for long names

✅ **Interactive States**

- Hover effect: translateY(-2px) + shadow
- Smooth transitions (0.2s ease)
- Cursor pointer on hover

✅ **UI Components Used**

- `Text` with proper variant
- `Image` with placeholder support
- `UnstyledButton` from Mantine

### Visual Design

```
┌─────────────────┐
│                 │
│   [Category]    │ ← Image (aspect 1:1)
│     Image       │   Background: surface
│                 │   Border radius: md
├─────────────────┤
│  Category Name  │ ← Text (sm, medium weight)
└─────────────────┘
```

### Theme Values Used

```tsx
// Colors
backgroundColor: colors.background; // '#ffffff'
backgroundColor: colors.surface; // '#f8fafc' (image container)

// Spacing
padding: spacing.sm; // '0.5rem'
marginBottom: spacing.xs; // '0.25rem'
marginTop: spacing.xs; // '0.25rem'

// Radius
borderRadius: radius.md; // '0.75rem'

// Typography
fontWeight: typography.fontWeight.medium; // 500
lineHeight: typography.lineHeight.tight; // 1.1

// Shadow (on hover)
boxShadow: shadow.md; // '0 4px 6px rgba(0,0,0,0.1)'
```

---

## 2. CategoryGrid Component

**File**: `components/home/CategoryGrid.tsx`

### Purpose

Container component that displays categories in a responsive grid layout.

### Props Interface

```tsx
interface CategoryGridProps {
  title?: string; // Section title
  categories: CategoryCardProps[]; // Array of categories
  onCategoryClick?: (id: string) => void; // Click handler
  columns?: {
    // Responsive columns
    base?: number; // Mobile (default: 3)
    xs?: number; // Extra small (default: 4)
    sm?: number; // Small (default: 4)
    md?: number; // Medium (default: 6)
    lg?: number; // Large (default: 8)
  };
}
```

### Features

✅ **Responsive Grid**

- Mobile: 3 columns
- Tablet: 4 columns
- Desktop: 6-8 columns
- Customizable breakpoints

✅ **Section Header**

- Optional title (default: "Grocery & Kitchen")
- Heading component with proper hierarchy

✅ **Grid Spacing**

- Consistent spacing between cards
- Padding around entire section

### Default Column Configuration

```tsx
{
  base: 3,  // 📱 Mobile (smallest screens)
  xs: 4,    // 📱 Small mobile
  sm: 4,    // 📱 Large mobile
  md: 6,    // 💻 Tablet
  lg: 8     // 🖥️  Desktop
}
```

---

## 3. Usage Example

### Basic Usage

```tsx
import { CategoryGrid } from '@/components/home';

const categories = [
  {
    id: 'fresh-vegetables',
    name: 'Fresh Vegetables',
    image: 'https://example.com/vegetables.jpg',
  },
  // ... more categories
];

<CategoryGrid
  title="Grocery & Kitchen"
  categories={categories}
  onCategoryClick={(id) => console.log('Clicked:', id)}
/>;
```

### Custom Column Layout

```tsx
<CategoryGrid
  title="Popular Categories"
  categories={categories}
  columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
  onCategoryClick={handleCategoryClick}
/>
```

### Without Title

```tsx
<CategoryGrid categories={categories} onCategoryClick={handleCategoryClick} />
```

---

## 4. Integration in Home Page

**File**: `app/components/root.tsx`

### Current Implementation

```tsx
'use client';

import { CategoryGrid } from '@/components/home';

const categories = [
  { id: 'fresh-vegetables', name: 'Fresh Vegetables', image: '...' },
  { id: 'fresh-fruits', name: 'Fresh Fruits', image: '...' },
  // ... 8 categories total
];

export const HomeRoot = () => {
  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId);
    // Will navigate to category page later
  };

  return (
    <Container size="xl" p={0}>
      <Stack gap={0}>
        <CategoryGrid
          title="Grocery & Kitchen"
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      </Stack>
    </Container>
  );
};
```

---

## 5. Sample Categories Data

```tsx
const categories = [
  {
    id: 'fresh-vegetables',
    name: 'Fresh Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
  },
  {
    id: 'fresh-fruits',
    name: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
  },
  {
    id: 'dairy-bread-eggs',
    name: 'Dairy, Bread and Eggs',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da',
  },
  {
    id: 'cereals-breakfast',
    name: 'Cereals and Breakfast',
    image: 'https://images.unsplash.com/photo-1574673670145-7a7b5ed9ae45',
  },
  {
    id: 'atta-rice-dal',
    name: 'Atta, Rice and Dal',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
  },
  {
    id: 'oils-ghee',
    name: 'Oils and Ghee',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
  },
  {
    id: 'masalas',
    name: 'Masalas',
    image: 'https://images.unsplash.com/photo-1596040033229-a0b13f5b9b33',
  },
  {
    id: 'dry-fruits-seeds',
    name: 'Dry Fruits and Seeds Mix',
    image: 'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea',
  },
];
```

---

## 6. Theme Consistency

### ✅ Colors

- Background: `colors.background` (#ffffff)
- Surface (image container): `colors.surface` (#f8fafc)
- Text: `colors.text.primary` (#111827)

### ✅ Spacing

- Card padding: `spacing.sm` (0.5rem)
- Grid spacing: `spacing.sm` (0.5rem)
- Section padding: `spacing.md` (1rem)
- Element gaps: `spacing.xs` (0.25rem)

### ✅ Typography

- Font weight: `typography.fontWeight.medium` (500)
- Line height: `typography.lineHeight.tight` (1.1)
- Size: `sm` from Text component

### ✅ Radius

- Card: `radius.md` (0.75rem)
- Image container: `radius.md` (0.75rem)

### ✅ Shadow

- Hover effect: `shadow.md` (0 4px 6px rgba(0,0,0,0.1))

---

## 7. UI Component Standards

### ✅ Following Best Practices

```tsx
// Using standardized UI components
import { Text, Image } from '../ui';

// Not using raw Mantine components
❌ <Text c="dimmed">           // Don't
✅ <Text variant="secondary">  // Do

// Using theme values
❌ color: '#f8fafc'            // Don't
✅ color: colors.surface       // Do

// Using theme spacing
❌ padding: '8px'              // Don't
✅ padding: spacing.sm         // Do
```

---

## 8. Responsive Behavior

### Mobile (base: 3 columns)

```
┌────┬────┬────┐
│ 1  │ 2  │ 3  │
├────┼────┼────┤
│ 4  │ 5  │ 6  │
├────┼────┼────┤
│ 7  │ 8  │    │
└────┴────┴────┘
```

### Tablet (md: 6 columns)

```
┌───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │
├───┼───┼───┼───┼───┼───┤
│ 7 │ 8 │   │   │   │   │
└───┴───┴───┴───┴───┴───┘
```

### Desktop (lg: 8 columns)

```
┌──┬──┬──┬──┬──┬──┬──┬──┐
│1 │2 │3 │4 │5 │6 │7 │8 │
└──┴──┴──┴──┴──┴──┴──┴──┘
```

---

## 9. Accessibility Features

### ✅ Semantic HTML

- Uses `UnstyledButton` for clickable cards
- Proper alt text for images
- Heading hierarchy for section title

### ✅ Keyboard Navigation

- Buttons are focusable
- Can be navigated with Tab key
- Enter/Space to activate

### ✅ Screen Reader Support

- Category names are readable
- Image alt attributes
- Semantic structure

---

## 10. Performance Optimizations

### ✅ Image Loading

- Lazy loading enabled by default
- Placeholder while loading
- Error handling with fallback

### ✅ Hover Effects

- CSS transitions (not JavaScript animations)
- Hardware-accelerated transforms
- Smooth 0.2s ease timing

### ✅ Component Structure

- Modular and reusable
- Minimal re-renders
- Clean separation of concerns

---

## 11. Future Enhancements

### Planned Features

- [ ] Category icons/badges
- [ ] Product count per category
- [ ] Skeleton loading state
- [ ] Infinite scroll for more categories
- [ ] Filter/search categories
- [ ] Sort by popularity
- [ ] Featured categories section

### API Integration

```tsx
// Will replace static data with API call
const { data: categories, isLoading } = useCategories();

if (isLoading) {
  return <CategoryGridSkeleton />;
}

<CategoryGrid categories={categories} />;
```

### Navigation

```tsx
// Will add routing
const handleCategoryClick = (categoryId: string) => {
  router.push(`/category/${categoryId}`);
};
```

---

## 12. Component File Structure

```
apps/web/src/
├── app/
│   ├── page.tsx              // Home page entry
│   └── components/
│       └── root.tsx          // Home root component
│
└── components/
    ├── home/
    │   ├── CategoryCard.tsx  // ✅ Individual card
    │   ├── CategoryGrid.tsx  // ✅ Grid container
    │   └── index.ts          // ✅ Exports
    │
    ├── ui/                   // Shared UI components
    │   ├── Text.tsx
    │   ├── Image.tsx
    │   ├── Heading.tsx
    │   └── ...
    │
    └── index.ts              // Main exports
```

---

## 13. Testing Checklist

- [x] Component renders without errors
- [x] Theme values properly applied
- [x] Responsive grid works on all breakpoints
- [x] Images load with placeholder
- [x] Hover effects work smoothly
- [x] Click handlers fire correctly
- [x] Accessible with keyboard
- [x] Category names display correctly
- [x] No TypeScript errors
- [x] Follows UI component standards

---

## 14. Design Specifications

### Card Dimensions

- Width: 100% (responsive to grid)
- Height: Auto (based on content)
- Image: 1:1 aspect ratio
- Padding: 0.5rem (spacing.sm)

### Grid Spacing

- Gap between cards: 0.5rem
- Section padding: 1rem
- Mobile optimized for 3 columns

### Interactive States

- **Default**: No shadow, no transform
- **Hover**: translateY(-2px), shadow.md
- **Active**: (handled by click event)
- **Transition**: 0.2s ease

---

## Summary

### ✅ Created Components

1. **CategoryCard** - Individual category display
2. **CategoryGrid** - Responsive grid layout
3. **HomeRoot** - Page integration with sample data

### ✅ Features Implemented

- Mobile-first responsive design
- Theme system integration
- UI component standards compliance
- Hover effects and interactions
- Image lazy loading
- Clean modular structure

### ✅ Ready For

- API integration
- Navigation implementation
- State management
- Advanced features (filters, search, etc.)

---

**Status**: ✅ Complete - Design Only (No Functionality)  
**Updated**: October 26, 2025  
**Pattern**: Modular Component Architecture  
**Theme**: Fully Integrated  
**Standards**: UI Component Compliant
