# Data Display & Feedback Components Documentation

## 📊 Data Display Components

### Table

Tabular data display with sorting, custom rendering, and row interactions.

**Props:**

- `columns` - Array of column definitions
- `data` - Array of data rows
- `striped` - Alternating row colors
- `highlightOnHover` - Hover effect on rows
- `onRowClick` - Row click handler
- `emptyState` - Custom empty state component

**Example:**

```tsx
<Table
  columns={[
    { key: 'id', label: 'ID', width: 80 },
    { key: 'name', label: 'Name' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'error'}>
          {value}
        </Badge>
      ),
    },
  ]}
  data={[
    { id: 1, name: 'John', status: 'active' },
    { id: 2, name: 'Jane', status: 'inactive' },
  ]}
  striped
  highlightOnHover
/>
```

### DataList

Key-value pair listing with horizontal or vertical layout.

**Props:**

- `items` - Array of { label, value, icon? }
- `orientation` - 'horizontal' | 'vertical'
- `striped` - Alternating backgrounds
- `withDivider` - Dividers between items

### Accordion

Expandable/collapsible content sections.

**Props:**

- `items` - Array of accordion items
- `variant` - 'default' | 'contained' | 'separated' | 'filled'
- `multiple` - Allow multiple open items
- `defaultValue` - Initially open items

### TagList

Display multiple tags/chips in a group.

**Props:**

- `tags` - Array of tags (strings or objects)
- `removable` - Show remove buttons
- `onRemove` - Remove handler
- `variant` - Color variant

### Timeline

Ordered event list with icons and timestamps.

**Props:**

- `items` - Array of timeline events
- `active` - Active item index
- `variant` - 'default' | 'compact'

### MetricCard / Statistic

Display metrics with trends and icons.

**Props:**

- `label` - Metric label
- `value` - Metric value
- `icon` - Optional icon
- `trend` - Trend data { value, direction, label }
- `variant` - Color variant

### EmptyState

Placeholder for empty data states.

**Props:**

- `title` - Main message
- `description` - Supporting text
- `icon` - Optional icon
- `action` - Optional action button

### Image

Responsive image with lazy loading and placeholder.

**Props:**

- `src` - Image source
- `alt` - Alt text
- `fit` - 'contain' | 'cover' | 'fill'
- `withPlaceholder` - Show loading skeleton
- `fallback` - Fallback image on error

### AvatarList

Display multiple avatars with overflow handling.

**Props:**

- `avatars` - Array of avatar data
- `max` - Maximum visible avatars
- `withTooltip` - Show name tooltips
- `spacing` - Avatar overlap spacing

### Carousel

Rotating visual content slider.

**Props:**

- `slides` - Array of slide content
- `height` - Carousel height
- `withIndicators` - Show dot indicators
- `withControls` - Show arrow controls
- `draggable` - Enable swipe/drag

---

## 💬 Feedback Components

### Alert

Display informational or error messages.

**Variants:** `info` | `success` | `warning` | `error`

**Props:**

- `variant` - Alert type
- `title` - Alert title
- `withCloseButton` - Show close button
- `icon` - Custom icon

**Example:**

```tsx
<Alert variant="success" title="Success" withCloseButton>
  Your changes have been saved!
</Alert>
```

### Toast / Snackbar

Short-lived notification messages.

**Methods:**

- `toast.show({ message, variant, title? })`
- `toast.success(message, title?)`
- `toast.error(message, title?)`
- `toast.warning(message, title?)`
- `toast.info(message, title?)`

**Example:**

```tsx
toast.success('Operation completed successfully!', 'Success');
```

### Modal / Dialog

Overlay for focused tasks and confirmations.

**Props:**

- `isOpen` - Open state
- `onClose` - Close handler
- `title` - Modal title
- `size` - Modal size
- `footer` - Custom footer content
- `centered` - Center on screen

**Example:**

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Edit User">
  <Form>...</Form>
</Modal>

<ConfirmDialog
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleDelete}
  title="Confirm Delete"
  message="Are you sure you want to delete this item?"
  variant="danger"
/>
```

### Tooltip

Hover information overlay.

**Props:**

- `label` - Tooltip content
- `position` - Placement position
- `withArrow` - Show arrow
- `multiline` - Allow text wrapping
- `openDelay` - Delay before showing

**Example:**

```tsx
<Tooltip label="This is helpful info">
  <Button>Hover me</Button>
</Tooltip>
```

### Popover

Floating custom content container.

**Props:**

- `trigger` - Element that triggers popover
- `content` - Popover content
- `position` - Placement position
- `withArrow` - Show arrow
- `opened` - Controlled open state

**Example:**

```tsx
<Popover
  trigger={<Button>Click me</Button>}
  content={
    <Stack>
      <Text>Custom content</Text>
      <Button>Action</Button>
    </Stack>
  }
/>
```

### ProgressBar

Linear progress indicator.

**Props:**

- `value` - Current value
- `max` - Maximum value (default: 100)
- `label` - Progress label
- `showValue` - Show percentage
- `variant` - Color variant
- `striped` - Striped style
- `animated` - Animate stripes

**Example:**

```tsx
<ProgressBar value={75} label="Upload Progress" showValue variant="primary" />
```

### CircularProgress

Ring-style progress indicator.

**Props:**

- `value` - Current value
- `max` - Maximum value
- `label` - Bottom label
- `showValue` - Show percentage in center
- `size` - Circle diameter
- `thickness` - Ring thickness

### Spinner / Loader

Loading state indicators.

**Components:**

- `Spinner` - Basic spinner
- `LoaderOverlay` - Full page overlay
- `InlineLoader` - Inline content loader

**Example:**

```tsx
<Spinner size="lg" label="Loading..." />

<LoaderOverlay visible={isLoading} label="Processing..." />

<InlineLoader loading={isLoading}>
  <Content />
</InlineLoader>
```

### Skeleton

Placeholder loading UI.

**Components:**

- `Skeleton` - Basic skeleton
- `SkeletonText` - Text placeholder
- `SkeletonCard` - Card placeholder
- `SkeletonTable` - Table placeholder
- `SkeletonAvatar` - Avatar placeholder
- `SkeletonWrapper` - Conditional wrapper

**Example:**

```tsx
<SkeletonText lines={3} />

<SkeletonCard withImage />

<SkeletonWrapper loading={isLoading}>
  <Content />
</SkeletonWrapper>
```

---

## 🎨 Usage Tips

### When to Use Each Component

**Alerts vs Toasts:**

- Use **Alert** for persistent, contextual messages within content
- Use **Toast** for temporary, system-wide notifications

**Modal vs Dialog:**

- Use **Modal** for complex forms and content
- Use **Dialog** for simple confirmations and quick actions

**Progress vs Spinner:**

- Use **ProgressBar** when you have deterministic progress (0-100%)
- Use **Spinner** for indeterminate loading states

**Skeleton vs Spinner:**

- Use **Skeleton** for content that's loading (shows layout)
- Use **Spinner** for actions/processes that are running

### Accessibility

All components include:

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### Theming

All components respect the global theme:

- Use color tokens from `theme/colors`
- Support dark mode (where applicable)
- Consistent spacing and sizing

---

## 📍 View the Showcase

Visit `/theme` page to see all components in action with interactive examples.
