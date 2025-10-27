# Component Quick Reference

## Import Components

```tsx
import {
  // Typography
  Text,
  Heading,
  Paragraph,

  // Buttons
  Button,
  IconButton,
  LinkButton,
  LoadingButton,

  // Icons
  Icon,
  IconWrapper,

  // Avatars
  Avatar,
  AvatarGroup,

  // Badges & Tags
  Badge,
  Chip,

  // Layout
  Divider,
} from '@/components/ui';
```

## Common Patterns

### Page Header

```tsx
<Stack gap="sm">
  <Heading order={1}>Page Title</Heading>
  <Paragraph variant="secondary">Page description</Paragraph>
</Stack>
```

### Action Buttons

```tsx
<Group gap="md">
  <Button variant="primary">Save</Button>
  <Button variant="outline">Cancel</Button>
</Group>
```

### Status Badge

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="error">Inactive</Badge>
<Badge variant="warning">Pending</Badge>
```

### User Info

```tsx
<Group gap="sm">
  <Avatar name="John Doe" />
  <Stack gap={4}>
    <Text fw={600}>John Doe</Text>
    <Text variant="secondary" size="sm">
      john@example.com
    </Text>
  </Stack>
</Group>
```

### Loading State

```tsx
<LoadingButton variant="primary" loading={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</LoadingButton>
```
