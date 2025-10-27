# Mobile Header - Theme Integration & Global Layout Update

## Changes Summary

### 1. **MobileHeader Component - Theme Integration** ✅

**File**: `apps/web/src/components/MobileHeader.tsx`

#### Updated Imports

```tsx
import { colors, spacing, radius, shadow, typography } from '../theme';
```

#### Theme System Applied

- **Colors**: Now uses `colors.primary` instead of hardcoded `#2563eb`
- **Spacing**: Uses `spacing.md`, `spacing.sm`, `spacing.xs` from theme
- **Radius**: Uses `radius.md`, `radius.lg` from theme
- **Shadow**: Uses `shadow.sm` from theme
- **Typography**: Uses `typography.fontWeight.semibold`, `typography.fontSize.base`, `typography.fontFamily`, `typography.lineHeight.tight`

#### Theme Values Used

```typescript
// Primary color (location icon background)
backgroundColor: colors.primary // '#247c62'

// Text colors
color: colors.primary           // '#247c62' for location text
color: colors.text.secondary    // '#4b5563' for subtitle
color: colors.text.inverse      // '#ffffff' for icons

// Spacing
px={spacing.md}                 // '1rem'
py={spacing.sm}                 // '0.5rem'
padding: spacing.sm             // '0.5rem'

// Border & Surface
border: colors.border           // '#e5e7eb'
backgroundColor: colors.surface // '#f8fafc'

// Radius
borderRadius: radius.md         // '0.75rem'
radius={radius.lg}              // '1.25rem'

// Shadow
boxShadow: shadow.sm           // '0 1px 2px rgba(0,0,0,0.05)'

// Typography
fontWeight: typography.fontWeight.semibold    // 600
fontSize: typography.fontSize.base             // '1rem'
fontFamily: typography.fontFamily              // "'Inter', 'Poppins', sans-serif"
lineHeight: typography.lineHeight.tight        // 1.1
```

### 2. **LayoutWrapper Integration** ✅

**File**: `apps/web/src/components/LayoutWrapper.tsx`

#### Changes Made

- Replaced `Header` import with `MobileHeader`
- Changed header height from fixed `60` to `'auto'` to accommodate dynamic content
- Removed padding from AppShell (`padding={0}`) for full-width header
- Wrapped MobileHeader in `AppShell.Header` component

```tsx
<AppShell header={{ height: 'auto' }} footer={{ height: 'auto' }} padding={0}>
  <AppShell.Header>
    <MobileHeader />
  </AppShell.Header>

  <AppShell.Main>{children}</AppShell.Main>
</AppShell>
```

### 3. **Home Page Cleanup** ✅

**File**: `apps/web/src/app/page.tsx`

#### Changes Made

- Removed local `MobileHeader` import
- Removed `Box` wrapper
- Removed redundant header instance
- Page now relies on global header from LayoutWrapper

```tsx
// Before
<Box>
  <MobileHeader />
  <Container>...</Container>
</Box>

// After
<Container>...</Container>
```

## Global Application Flow

```
RootLayout (layout.tsx)
  └─> Providers (providers.tsx)
       └─> MantineProvider (with mantineTheme)
            └─> LayoutWrapper (components/LayoutWrapper.tsx)
                 └─> AppShell
                      ├─> AppShell.Header
                      │    └─> MobileHeader ← GLOBAL HEADER
                      │
                      └─> AppShell.Main
                           └─> {children} ← All page content
```

## Benefits of This Approach

### ✅ Centralized Theming

- All styling values come from theme system
- Easy to update colors, spacing, typography globally
- Consistent design language across app

### ✅ Global Header

- Header appears on all pages automatically
- No need to import/add header to each page
- Single source of truth for header component

### ✅ Maintainable

- Change theme values in one place
- Update header design in one component
- Affects entire application

### ✅ Mobile-First

- Optimized for mobile devices
- Responsive spacing and touch targets
- Sticky positioning for better UX

## Theme Values Reference

### Current Theme Configuration

```typescript
// Primary Brand Color
primary: '#247c62' (Green - Shreehari Mart brand)

// Secondary Brand Color
secondary: '#fde35a' (Yellow)

// Background Colors
background: '#ffffff' (White)
surface: '#f8fafc' (Light gray)

// Text Colors
text.primary: '#111827' (Dark gray)
text.secondary: '#4b5563' (Medium gray)
text.inverse: '#ffffff' (White)

// Border
border: '#e5e7eb' (Light gray)

// Spacing Scale
xs: '0.25rem' (4px)
sm: '0.5rem' (8px)
md: '1rem' (16px)
lg: '1.5rem' (24px)
xl: '2rem' (32px)

// Border Radius
sm: '0.375rem' (6px)
md: '0.75rem' (12px)
lg: '1.25rem' (20px)
xl: '2rem' (32px)

// Shadows
sm: '0 1px 2px rgba(0,0,0,0.05)'
md: '0 4px 6px rgba(0,0,0,0.1)'
lg: '0 10px 15px rgba(0,0,0,0.15)'
```

## Testing Checklist

- [x] MobileHeader imports theme correctly
- [x] All hardcoded values replaced with theme values
- [x] LayoutWrapper uses MobileHeader
- [x] Header displays globally on all pages
- [x] No TypeScript errors
- [x] Home page cleaned up (no duplicate header)

## Next Steps (Future Enhancements)

1. **Add Functionality**
   - Location selector modal/dropdown
   - Search with debouncing
   - Profile menu with auth state
   - Cart icon with item count

2. **Responsive Behavior**
   - Desktop variant (if needed)
   - Tablet optimizations
   - Breakpoint-based changes

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Focus management
   - Screen reader support

4. **Performance**
   - Memoize expensive computations
   - Optimize re-renders
   - Lazy load heavy components

---

**Status**: ✅ Complete  
**Updated**: October 26, 2025  
**Theme System**: Fully Integrated  
**Global Layout**: Configured
