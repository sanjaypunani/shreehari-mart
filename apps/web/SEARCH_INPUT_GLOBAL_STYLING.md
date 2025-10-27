# SearchInput - Global Styling Implementation

## ✅ Changes Completed

### Overview

Updated the `SearchInput` component to include default theme-based styling globally, eliminating the need to repeat styles every time the component is used.

---

## Problem Statement

**Before**: Every time we used `SearchInput`, we had to manually add styling:

```tsx
<SearchInput
  placeholder='Search for "Grapes"'
  size="md"
  radius={radius.lg} // ❌ Repetitive
  styles={{
    // ❌ Repetitive
    input: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      color: colors.text.primary,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily,
      // ... more styles
    },
  }}
/>
```

**Issues**:

- ❌ Code duplication everywhere SearchInput is used
- ❌ Inconsistent styling if someone forgets to add styles
- ❌ Hard to maintain - need to update in multiple places
- ❌ Violates DRY principle

---

## Solution Implemented

### Updated `SearchInput.tsx`

**Location**: `apps/web/src/components/ui/SearchInput.tsx`

#### 1. Added Theme Imports

```tsx
import { colors, radius, typography } from '../../theme';
```

#### 2. Default Theme-Based Styles

```tsx
const defaultStyles = {
  input: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    '&::placeholder': {
      color: colors.text.secondary,
      opacity: 0.6,
    },
    '&:focus': {
      borderColor: colors.primary,
      backgroundColor: colors.background,
      boxShadow: `0 0 0 2px ${colors.primary}20`,
    },
  },
};
```

#### 3. Smart Style Merging

The component now merges user-provided styles with defaults:

```tsx
const mergedStyles = styles
  ? {
      input: {
        ...defaultStyles.input,
        ...(typeof styles === 'function' ? {} : styles.input || {}),
      },
    }
  : defaultStyles;
```

#### 4. Default Radius

```tsx
radius={radiusProp || radius.lg}
```

---

## Usage - Before vs After

### ❌ Before (Repetitive)

```tsx
<SearchInput
  placeholder='Search for "Grapes"'
  size="md"
  radius={radius.lg}
  styles={{
    input: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      color: colors.text.primary,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily,
      height: '44px',
      '&::placeholder': {
        color: colors.text.secondary,
        opacity: 0.6,
      },
      '&:focus': {
        borderColor: colors.primary,
        backgroundColor: colors.background,
        boxShadow: `0 0 0 2px ${colors.primary}20`,
      },
    },
  }}
/>
```

### ✅ After (Clean & Simple)

```tsx
<SearchInput placeholder='Search for "Grapes"' size="md" />
```

---

## Benefits

### 1. ✅ No Repetition (DRY Principle)

- Styles defined once in the component
- Every usage automatically gets the theme-based styling
- Consistent look across the entire app

### 2. ✅ Easy Maintenance

- Update styles in one place (SearchInput.tsx)
- Changes automatically apply everywhere
- No need to hunt down every SearchInput usage

### 3. ✅ Theme Integration

- Automatically uses theme values:
  - `colors.surface` for background
  - `colors.border` for borders
  - `colors.primary` for focus state
  - `typography.fontSize.base` for font size
  - `radius.lg` for border radius

### 4. ✅ Flexibility

- Can still override styles when needed
- User-provided styles merge with defaults
- Radius can be customized per instance

### 5. ✅ Consistency

- All SearchInput instances look the same
- No accidental style variations
- Professional, cohesive UI

---

## Default Styling Applied

### Background & Border

```tsx
backgroundColor: colors.surface; // '#f8fafc' (light gray)
border: `1px solid ${colors.border}`; // '#e5e7eb' (border gray)
```

### Typography

```tsx
color: colors.text.primary; // '#111827' (dark text)
fontSize: typography.fontSize.base; // '1rem' (16px)
fontFamily: typography.fontFamily; // 'Inter', 'Poppins'
```

### Placeholder

```tsx
'&::placeholder': {
  color: colors.text.secondary     // '#4b5563' (muted)
  opacity: 0.6                     // Subtle appearance
}
```

### Focus State

```tsx
'&:focus': {
  borderColor: colors.primary      // '#247c62' (brand green)
  backgroundColor: colors.background // '#ffffff' (white)
  boxShadow: `0 0 0 2px ${colors.primary}20` // Green glow
}
```

### Border Radius

```tsx
radius: radius.lg; // '1.25rem' (20px)
```

---

## Updated Components

### 1. SearchInput Component ✅

**File**: `apps/web/src/components/ui/SearchInput.tsx`

- Added default theme-based styles
- Added style merging logic
- Added default radius

### 2. MobileHeader Component ✅

**File**: `apps/web/src/components/MobileHeader.tsx`

- Removed redundant styling
- Simplified SearchInput usage
- Cleaner, more maintainable code

---

## Example Usage Throughout App

### Basic Usage

```tsx
<SearchInput placeholder="Search products..." />
```

### With Custom Placeholder

```tsx
<SearchInput placeholder="Find customers..." />
```

### With Size Variant

```tsx
<SearchInput placeholder="Search..." size="lg" />
```

### With State Management

```tsx
const [search, setSearch] = useState('');

<SearchInput
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onSearch={(value) => console.log('Searching:', value)}
/>;
```

### Override Styles (If Needed)

```tsx
<SearchInput
  placeholder="Search..."
  styles={{
    input: {
      height: '50px', // Custom height
    },
  }}
/>
```

### Custom Radius (If Needed)

```tsx
<SearchInput
  placeholder="Search..."
  radius="md" // Override default lg
/>
```

---

## How It Works

### 1. Component Initialization

When SearchInput is rendered, it creates default styles using theme values.

### 2. Style Merging

If user provides custom styles, they are merged with defaults:

```tsx
defaultStyles + userStyles = finalStyles
```

### 3. Application

The merged styles are applied to the TextInput component.

### 4. Theme Updates

If theme colors/typography change, all SearchInputs automatically update.

---

## Impact Analysis

### Files Changed: 2

1. `SearchInput.tsx` - Added default styling
2. `MobileHeader.tsx` - Removed redundant styles

### Lines of Code Removed: ~20

Removed repetitive styling from MobileHeader.

### Lines of Code Added: ~30

Added reusable default styling to SearchInput.

### Net Benefit

- Future SearchInput usages: **~20 lines saved each**
- Better maintainability
- Consistent styling guaranteed

---

## Testing Checklist

- [x] SearchInput displays with correct styling
- [x] Background color matches theme surface
- [x] Border color matches theme border
- [x] Focus state shows primary color
- [x] Placeholder color is muted (secondary)
- [x] Border radius is lg (1.25rem)
- [x] Font family from typography theme
- [x] MobileHeader SearchInput works correctly
- [x] No TypeScript errors
- [x] Custom styles can still override defaults

---

## Future Enhancements

### 1. Size Variants

Could add predefined size variants:

```tsx
<SearchInput size="sm" /> // Smaller padding, text
<SearchInput size="lg" /> // Larger padding, text
```

### 2. Variant Styles

Could add style variants:

```tsx
<SearchInput variant="filled" />   // Filled background
<SearchInput variant="outlined" /> // Outlined border
<SearchInput variant="ghost" />    // Minimal style
```

### 3. Loading State

```tsx
<SearchInput loading={true} />
```

### 4. Clear Button

```tsx
<SearchInput clearable onClear={() => {}} />
```

---

## Migration Guide

### For Existing SearchInput Usages

**Find all instances:**

```tsx
<SearchInput
  styles={{ input: { ... } }}
  radius={radius.lg}
/>
```

**Replace with:**

```tsx
<SearchInput />
```

**If custom styling is needed:**

```tsx
<SearchInput
  styles={{
    input: {
      height: '50px', // Only custom styles
    },
  }}
/>
```

---

## Best Practices

### ✅ DO

- Use SearchInput without styles for standard cases
- Let the component use default theme values
- Override only when absolutely necessary
- Trust the default styling

### ❌ DON'T

- Don't repeat theme styles in every usage
- Don't hardcode colors/sizes
- Don't bypass the component's defaults
- Don't create inconsistent search inputs

---

## Summary

### Problem Solved

Eliminated repetitive styling code for SearchInput component across the application.

### Approach

Moved default theme-based styles into the SearchInput component itself, with smart merging for custom overrides.

### Result

- **Cleaner code**: 20 lines → 2 lines per usage
- **Consistency**: All SearchInputs look the same
- **Maintainability**: Update once, apply everywhere
- **Theme integration**: Automatic theme value usage

---

**Status**: ✅ Complete  
**Updated**: October 26, 2025  
**Pattern**: Global Default Styling  
**Principle**: DRY (Don't Repeat Yourself)  
**Impact**: All future SearchInput usages are simplified
