# Design System Documentation

This document describes the custom theme and UI components built for the Shreehari Mart web application.

## Theme Configuration

The theme is based on Mantine UI and customized to match our design requirements.

### Color Palette

```typescript
{
  primary: '#247c62',      // Main brand color (green)
  secondary: '#fde35a',    // Accent color (yellow)
  background: '#ffffff',   // Background
  surface: '#f8fafc',      // Surface/card background
  border: '#e5e7eb',       // Borders
  success: '#22c55e',      // Success states
  error: '#ef4444',        // Error states
  warning: '#f59e0b',      // Warning states
  text: {
    primary: '#111827',    // Main text
    secondary: '#4b5563',  // Secondary text
    inverse: '#ffffff',    // Text on dark backgrounds
  }
}
```

### Typography

- **Font Family**: 'Inter', 'Poppins', sans-serif
- **Font Sizes**: xs (0.75rem) → 3xl (1.875rem)
- **Font Weights**: regular (400), medium (500), semibold (600), bold (700)
- **Line Heights**: tight (1.1), normal (1.5), relaxed (1.75)

### Spacing & Layout

- **Spacing Scale**: xs (0.25rem), sm (0.5rem), md (1rem), lg (1.5rem), xl (2rem)
- **Border Radius**: sm (0.375rem), md (0.75rem), lg (1.25rem), xl (2rem), full (9999px)
- **Shadows**: sm, md, lg

## Core UI Components

All components are located in `src/components/ui/` and are built on top of Mantine components with custom theming.

### 1. Typography

#### Text

```tsx
import { Text } from '@/components/ui';

<Text variant="primary">Primary text</Text>
<Text variant="secondary">Secondary text</Text>
<Text variant="inverse">Inverse text</Text>
```

**Props**: All Mantine Text props + `variant: 'primary' | 'secondary' | 'inverse'`

#### Heading

```tsx
import { Heading } from '@/components/ui';

<Heading order={1}>Main Title</Heading>
<Heading order={2} variant="secondary">Subtitle</Heading>
```

**Props**: All Mantine Title props + `variant: 'primary' | 'secondary' | 'inverse'`, `order: 1-6`

#### Paragraph

```tsx
import { Paragraph } from '@/components/ui';

<Paragraph>Main paragraph text with relaxed line height.</Paragraph>
<Paragraph variant="secondary">Supporting text.</Paragraph>
```

**Props**: All Mantine Text props + `variant: 'primary' | 'secondary'`

### 2. Buttons

#### Button

```tsx
import { Button } from '@/components/ui';

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

**Variants**:

- `primary` - Filled with primary color
- `secondary` - Filled with secondary color
- `outline` - Outlined with primary color
- `ghost` - Subtle/transparent background

**Sizes**: xs, sm, md (default), lg, xl

#### IconButton

```tsx
import { IconButton } from '@/components/ui';

<IconButton variant="primary">
  <YourIconComponent />
</IconButton>;
```

**Props**: Same variants as Button + all Mantine ActionIcon props

#### LoadingButton

```tsx
import { LoadingButton } from '@/components/ui';

<LoadingButton variant="primary" loading={isLoading}>
  Submit
</LoadingButton>;
```

**Props**: Same as Button + `loading: boolean`

#### LinkButton

```tsx
import { LinkButton } from '@/components/ui';

<LinkButton variant="primary">Click here</LinkButton>;
```

**Props**: All Mantine Anchor props + `variant: 'primary' | 'secondary'`

### 3. Icons

#### Icon

Simple icon wrapper with size control.

```tsx
import { Icon } from '@/components/ui';

<Icon size={24}>
  <YourSVGIcon />
</Icon>;
```

#### IconWrapper

Icon with background container.

```tsx
import { IconWrapper } from '@/components/ui';

<IconWrapper variant="primary" size={40}>
  <YourIcon />
</IconWrapper>;
```

**Variants**: primary, secondary, outline

### 4. Avatars

#### Avatar

```tsx
import { Avatar } from '@/components/ui';

<Avatar name="John Doe" />
<Avatar name="Jane Smith" src="/path/to/image.jpg" />
```

**Props**: All Mantine Avatar props + `name: string` (for initials fallback)

#### AvatarGroup

```tsx
import { AvatarGroup } from '@/components/ui';

<AvatarGroup
  avatars={[
    { name: 'John Doe', src: '/avatar1.jpg' },
    { name: 'Jane Smith' },
    { name: 'Bob Johnson' },
  ]}
  max={3}
/>;
```

**Props**: `avatars: Array<{ name: string, src?: string }>`, `max?: number`

### 5. Badges & Tags

#### Badge

```tsx
import { Badge } from '@/components/ui';

<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
```

**Variants**: primary, secondary, success, error, warning, outline

#### Chip

Light variant badges, optionally removable.

```tsx
import { Chip } from '@/components/ui';

<Chip variant="primary">Category</Chip>
<Chip variant="success" removable onRemove={() => {}}>
  Removable Tag
</Chip>
```

**Props**: Same variants as Badge + `removable?: boolean`, `onRemove?: () => void`

### 6. Divider

```tsx
import { Divider } from '@/components/ui';

<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />
<Divider label="Section" labelPosition="center" />
<Divider orientation="vertical" />
```

**Variants**: solid, dashed, dotted

## Theme Showcase

Visit `/theme` page to see all components with their variants in action.

## Usage in Components

```tsx
'use client';

import { Button, Heading, Text, Badge } from '@/components/ui';
import { Stack, Group } from '@mantine/core';

export function MyComponent() {
  return (
    <Stack gap="md">
      <Heading order={1}>Welcome</Heading>
      <Text variant="secondary">This is a description</Text>
      <Group gap="sm">
        <Button variant="primary">Primary Action</Button>
        <Button variant="outline">Cancel</Button>
      </Group>
      <Badge variant="success">Active</Badge>
    </Stack>
  );
}
```

## File Structure

```
apps/web/src/
├── theme/
│   ├── colors.ts           # Color definitions
│   ├── typography.ts       # Typography settings
│   ├── spacing.ts          # Spacing, radius, shadows
│   ├── mantine-theme.ts    # Mantine theme config
│   └── index.ts            # Theme exports
└── components/
    └── ui/
        ├── Text.tsx
        ├── Heading.tsx
        ├── Paragraph.tsx
        ├── Button.tsx
        ├── IconButton.tsx
        ├── LinkButton.tsx
        ├── LoadingButton.tsx
        ├── Icon.tsx
        ├── IconWrapper.tsx
        ├── Avatar.tsx
        ├── AvatarGroup.tsx
        ├── Badge.tsx
        ├── Chip.tsx
        ├── Divider.tsx
        └── index.ts         # Component exports
```

## Next Steps

Future component additions will include:

- Form inputs (Input, Select, Checkbox, Radio, etc.)
- Cards and containers
- Modals and dialogs
- Navigation components
- Tables and data display
- Feedback components (Toast, Alert, etc.)
