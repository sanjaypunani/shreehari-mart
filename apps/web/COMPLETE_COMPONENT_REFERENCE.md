# Complete UI Component Library Reference

## 📚 All Available Components

### 🎨 Typography

- `Text` - Base text component with variants
- `Heading` - Headings (h1-h6)
- `Paragraph` - Paragraph with line height

### 🔘 Buttons

- `Button` - Primary button component
- `IconButton` - Icon-only button
- `LinkButton` - Link-styled button
- `LoadingButton` - Button with loading state

### 🎭 Icons & Avatars

- `Icon` - Icon wrapper
- `IconWrapper` - Icon with background
- `Avatar` - User avatar
- `AvatarGroup` - Multiple avatars
- `AvatarList` - Avatar list with overflow

### 🏷️ Badges & Tags

- `Badge` - Status badge
- `Chip` - Tag/chip component
- `TagList` - Multiple tags display

### ➖ Dividers

- `Divider` - Horizontal/vertical divider

### 📝 Form Components

- `Input` - Text input
- `Textarea` - Multi-line text input
- `Select` - Dropdown select
- `Checkbox` - Checkbox input
- `RadioGroup` - Radio button group
- `Switch` - Toggle switch
- `Slider` - Range slider
- `DatePicker` - Date selection
- `FileUpload` - File upload
- `SearchInput` - Search field
- `FormField` - Field wrapper with label/error
- `Form` - Form wrapper

### 🧭 Navigation

- `Breadcrumb` - Breadcrumb trail
- `Tabs` - Tab navigation
- `Pagination` - Page navigation
- `DropdownMenu` - Dropdown menu
- `SidebarMenu` - Sidebar navigation
- `Stepper` - Step-by-step wizard
- `NavLink` - Navigation link

### 📊 Data Display

- `Table` - Data table
- `DataList` - Key-value list
- `Accordion` - Collapsible sections
- `TagList` - Tag collection
- `Timeline` - Event timeline
- `MetricCard` / `Statistic` - Metric display
- `EmptyState` - Empty placeholder
- `Image` - Responsive image
- `Carousel` / `Slider` - Content carousel

### 💬 Feedback

- `Alert` - Alert messages
- `toast` / `Toast` / `Snackbar` - Notifications
- `Modal` / `Dialog` - Overlays
- `ConfirmDialog` - Confirmation modal
- `Tooltip` - Hover tooltip
- `Popover` - Floating content
- `ProgressBar` - Linear progress
- `CircularProgress` - Ring progress
- `Spinner` / `Loader` - Loading spinner
- `LoaderOverlay` - Full-page loader
- `InlineLoader` - Inline loader
- `Skeleton` - Loading placeholder
- `SkeletonText` - Text skeleton
- `SkeletonCard` - Card skeleton
- `SkeletonTable` - Table skeleton
- `SkeletonAvatar` - Avatar skeleton
- `SkeletonWrapper` - Conditional skeleton

---

## 🎯 Quick Import Guide

```tsx
// Import specific components
import {
  // Typography
  Text,
  Heading,
  Paragraph,

  // Buttons
  Button,
  IconButton,
  LoadingButton,

  // Form
  Input,
  Select,
  Checkbox,
  FormField,

  // Navigation
  Breadcrumb,
  Tabs,
  Pagination,

  // Data Display
  Table,
  DataList,
  Timeline,
  MetricCard,

  // Feedback
  Alert,
  toast,
  Modal,
  Tooltip,
  ProgressBar,
  Spinner,
  Skeleton,
} from '@/components/ui';
```

---

## 🎨 Component Categories

### By Use Case

**Content & Layout**

- Text, Heading, Paragraph
- Divider
- Image
- EmptyState

**User Input**

- All Form Components
- SearchInput
- FileUpload

**Actions**

- All Button Components
- DropdownMenu

**Navigation & Wayfinding**

- Breadcrumb
- Tabs
- Pagination
- SidebarMenu
- NavLink
- Stepper

**Data Presentation**

- Table
- DataList
- Timeline
- MetricCard
- Accordion

**Status & Feedback**

- Badge, Chip
- Alert
- Toast
- ProgressBar
- Spinner
- Skeleton

**Interactive Overlays**

- Modal, Dialog
- Tooltip
- Popover

**Visual Organization**

- TagList
- AvatarGroup, AvatarList
- Carousel

---

## 🎭 Component Variants

### Buttons

- `primary` - Primary action
- `secondary` - Secondary action
- `outline` - Outlined button
- `ghost` - Minimal button

### Alerts & Badges

- `info` - Informational (blue)
- `success` - Success state (green)
- `warning` - Warning state (yellow)
- `error` - Error state (red)
- `outline` - Outlined style

### Sizes

Most components support: `xs`, `sm`, `md`, `lg`, `xl`

---

## 💡 Common Patterns

### Form with Validation

```tsx
<Form>
  <FormField label="Email" required error={errors.email}>
    <Input type="email" />
  </FormField>

  <FormField label="Password" required>
    <Input type="password" />
  </FormField>

  <Button variant="primary">Submit</Button>
</Form>
```

### Data Table with Actions

```tsx
<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button size="xs" onClick={() => edit(row)}>
          Edit
        </Button>
      ),
    },
  ]}
  data={users}
  striped
  highlightOnHover
/>
```

### Loading States

```tsx
// Inline loading
<InlineLoader loading={isLoading}>
  <Content />
</InlineLoader>

// With skeleton
<SkeletonWrapper loading={isLoading}>
  <UserProfile />
</SkeletonWrapper>

// Full page
<LoaderOverlay visible={isLoading} label="Processing..." />
```

### Confirmations

```tsx
<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  variant="danger"
  confirmText="Delete"
  cancelText="Cancel"
/>
```

### Notifications

```tsx
// Success notification
toast.success('Saved successfully!');

// Error with title
toast.error('Failed to save', 'Error');

// Custom notification
toast.show({
  message: 'Custom notification',
  variant: 'info',
  autoClose: 3000,
});
```

### Progress Tracking

```tsx
// Linear progress
<ProgressBar
  value={uploadProgress}
  label="Uploading..."
  showValue
  variant="primary"
/>

// Circular progress
<CircularProgress
  value={completion}
  label="Completion"
  variant="success"
/>
```

---

## 📖 Documentation Files

- `THEME_DOCUMENTATION.md` - Theme and color system
- `FORM_COMPONENTS_DOCUMENTATION.md` - Form components
- `NAVIGATION_COMPONENTS_DOCUMENTATION.md` - Navigation components
- `DATA_FEEDBACK_COMPONENTS.md` - Data & Feedback components
- `COMPONENT_QUICK_REFERENCE.md` - Quick reference guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details

---

## 🌐 Live Showcase

Visit **`/theme`** page to see all components with interactive examples and code samples.

---

## 📦 Total Component Count

- **Typography:** 3 components
- **Buttons:** 4 components
- **Icons & Avatars:** 5 components
- **Badges & Tags:** 3 components
- **Dividers:** 1 component
- **Forms:** 13 components
- **Navigation:** 7 components
- **Data Display:** 10 components
- **Feedback:** 19 components (including variants)

**Grand Total: 65+ components and utilities**

All components are:
✅ TypeScript typed
✅ Accessible (ARIA)
✅ Themeable
✅ Responsive
✅ Well-documented
✅ Production-ready
