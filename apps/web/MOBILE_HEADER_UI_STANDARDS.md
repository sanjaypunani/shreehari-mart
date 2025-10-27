# MobileHeader - UI Component Standards Implementation

## ✅ Updates Completed

### Overview

Updated `MobileHeader` component to follow proper UI component standards by using standardized components from `components/ui` directory instead of raw Mantine components.

---

## Changes Made

### 1. **Updated Imports** ✅

**Before** (Using raw Mantine components):

```tsx
import {
  Box,
  Group,
  Stack,
  ActionIcon,
  TextInput,
  UnstyledButton,
  Text,
  Avatar,
} from '@mantine/core';
import { colors } from '../theme/colors';
```

**After** (Using standardized UI components):

```tsx
import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
import { colors, spacing, radius, shadow, typography } from '../theme';
import { Text, SearchInput, IconButton } from './ui';
```

### 2. **Component Replacements**

| Before (Raw Mantine) | After (UI Components)          | Benefit                        |
| -------------------- | ------------------------------ | ------------------------------ |
| `<Text>` (Mantine)   | `<Text variant="secondary">`   | Consistent color variants      |
| `<ActionIcon>`       | `<IconButton variant="ghost">` | Theme-aware styling            |
| `<TextInput>`        | `<SearchInput>`                | Built-in search icon & styling |

---

## Component Usage Examples

### ✅ Text Component

**Standard Usage** (following UI guidelines):

```tsx
// Primary text (default)
<Text size="sm" fw={typography.fontWeight.semibold}>
  Add your location
</Text>

// Secondary text (muted)
<Text variant="secondary" size="xs">
  To see items in your area
</Text>
```

**What Changed**:

- ❌ Removed: `c="dimmed"` and `color: colors.text.secondary` inline style
- ✅ Added: `variant="secondary"` prop (standardized way)

### ✅ IconButton Component

**Standard Usage**:

```tsx
<IconButton
  variant="ghost"
  size="lg"
  radius="xl"
  style={{
    backgroundColor: colors.text.secondary,
    width: '40px',
    height: '40px',
  }}
>
  <IconUser size={22} color={colors.text.inverse} stroke={2} />
</IconButton>
```

**What Changed**:

- ❌ Removed: `ActionIcon` from Mantine
- ✅ Added: `IconButton` from UI components with proper variant

### ✅ SearchInput Component

**Standard Usage**:

```tsx
<SearchInput
  placeholder='Search for "Grapes"'
  size="md"
  radius={radius.lg}
  styles={{
    input: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      // ... theme-based styling
    },
  }}
/>
```

**What Changed**:

- ❌ Removed: `TextInput` with manual `leftSection={<IconSearch />}`
- ✅ Added: `SearchInput` with built-in search icon
- ✅ Icon is automatically included from the component

---

## Theme System Integration

### All Theme Values Used:

```tsx
// From theme/colors.ts
colors.primary; // '#247c62' - Brand green
colors.background; // '#ffffff' - White
colors.surface; // '#f8fafc' - Light gray
colors.border; // '#e5e7eb' - Border gray
colors.text.primary; // '#111827' - Dark text
colors.text.secondary; // '#4b5563' - Muted text
colors.text.inverse; // '#ffffff' - White text

// From theme/spacing.ts
spacing.xs; // '0.25rem' (4px)
spacing.sm; // '0.5rem' (8px)
spacing.md; // '1rem' (16px)

// From theme/spacing.ts
radius.md; // '0.75rem' (12px)
radius.lg; // '1.25rem' (20px)
shadow.sm; // '0 1px 2px rgba(0,0,0,0.05)'

// From theme/typography.ts
typography.fontWeight.semibold; // 600
typography.fontSize.base; // '1rem'
typography.fontFamily; // "'Inter', 'Poppins', sans-serif"
typography.lineHeight.tight; // 1.1
```

---

## Component Architecture

```
MobileHeader Component
├─ Uses UI Components (from components/ui)
│  ├─ Text (with variant prop)
│  ├─ SearchInput (with built-in icon)
│  └─ IconButton (theme-aware)
│
├─ Uses Theme System
│  ├─ colors (from theme/colors)
│  ├─ spacing (from theme/spacing)
│  ├─ radius (from theme/spacing)
│  ├─ shadow (from theme/spacing)
│  └─ typography (from theme/typography)
│
└─ Uses Base Mantine Components
   ├─ Box (layout primitive)
   ├─ Group (flex container)
   ├─ Stack (vertical stack)
   └─ UnstyledButton (base button)
```

---

## Benefits of This Approach

### ✅ 1. Consistency

- All components use the same standardized UI components
- Consistent behavior across the application
- Predictable prop APIs

### ✅ 2. Maintainability

- Update UI component once, affects everywhere
- Centralized component logic
- Easier to refactor and improve

### ✅ 3. Theme Integration

- All components automatically use theme values
- Single source of truth for styling
- Easy to switch themes globally

### ✅ 4. Type Safety

- TypeScript support through UI component interfaces
- Autocomplete for available variants
- Compile-time error checking

### ✅ 5. Best Practices

- Following established patterns from theme page
- Using components as intended by design system
- Proper separation of concerns

---

## Comparison: Before vs After

### Before (Not Following Standards)

```tsx
import { Text, ActionIcon, TextInput } from '@mantine/core';

// Using raw components
<Text c="dimmed" style={{ color: colors.text.secondary }}>...</Text>
<ActionIcon variant="subtle">...</ActionIcon>
<TextInput leftSection={<IconSearch />} />
```

**Issues**:

- ❌ Mixing `c="dimmed"` with inline `color` style
- ❌ Using raw Mantine components instead of UI components
- ❌ Manual icon setup in TextInput
- ❌ Inconsistent with other components in the app

### After (Following Standards) ✅

```tsx
import { Text, IconButton, SearchInput } from './ui';

// Using UI components
<Text variant="secondary">...</Text>
<IconButton variant="ghost">...</IconButton>
<SearchInput placeholder="..." />
```

**Benefits**:

- ✅ Using standardized UI components
- ✅ Proper variant system
- ✅ Built-in search functionality
- ✅ Consistent with theme page examples

---

## Files Modified

1. **`MobileHeader.tsx`** - Updated to use UI components

### Import Changes:

```diff
- import { Text, ActionIcon, TextInput } from '@mantine/core';
- import { colors } from '../theme/colors';

+ import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
+ import { colors, spacing, radius, shadow, typography } from '../theme';
+ import { Text, SearchInput, IconButton } from './ui';
```

---

## Reference: UI Component Library

All available UI components (from `components/ui/index.ts`):

### Typography

- `Text` - with `variant: 'primary' | 'secondary' | 'inverse'`
- `Heading` - with `order: 1-6`
- `Paragraph` - with `variant: 'primary' | 'secondary'`

### Buttons

- `Button` - with `variant: 'primary' | 'secondary' | 'outline' | 'ghost'`
- `IconButton` - with same variants
- `LinkButton` - for navigation
- `LoadingButton` - with loading state

### Form Components

- `Input` - text input
- `SearchInput` - with built-in search icon ✅ (Used in MobileHeader)
- `Textarea` - multi-line input
- `Select` - dropdown select
- `Checkbox` - checkbox input
- `RadioGroup` - radio buttons
- `Switch` - toggle switch
- `Slider` - range slider
- `DatePicker` - date selection
- `FileUpload` - file upload

### Data Display

- `Avatar` - user avatar
- `Badge` - status badge
- `Chip` - selectable chip
- `Table` - data table
- `DataList` - key-value list
- And more...

---

## Next Steps

### ✅ Completed

- [x] Use standardized UI components
- [x] Follow theme system properly
- [x] Remove raw Mantine component usage
- [x] Use proper variant props

### 🎯 Future Enhancements

- [ ] Add functionality (location selector, search, profile menu)
- [ ] Create props interface for customization
- [ ] Add accessibility features (ARIA labels)
- [ ] Add responsive behavior for different screen sizes

---

## Testing Checklist

- [x] Component uses UI components from `components/ui`
- [x] No raw Mantine components for UI elements
- [x] Text uses `variant` prop instead of inline colors
- [x] IconButton uses proper variant
- [x] SearchInput used instead of TextInput
- [x] All theme values properly imported and used
- [x] No TypeScript errors
- [x] Follows patterns from theme page

---

**Status**: ✅ Complete - Following UI Component Standards  
**Updated**: October 26, 2025  
**Pattern Source**: `app/theme/page.tsx` (official component showcase)  
**Component Library**: `components/ui/index.ts`
