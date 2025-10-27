# Shreehari UI Library

A comprehensive collection of reusable UI components built on top of Mantine, designed to provide consistent and efficient development across different projects.

## Components

### Button

Enhanced button component with brand-specific styling support.

```tsx
import { Button } from '@shreehari/ui';

<Button variant="brand">Save</Button>
<Button variant="outline">Cancel</Button>
```

### DataTable

A powerful, flexible table component with built-in actions, loading states, and customizable columns.

```tsx
import { DataTable, type Column, type DataTableAction } from '@shreehari/ui';

const columns: Column<User>[] = [
  {
    key: 'name',
    title: 'Name',
    render: (value, record) => <Text fw={500}>{value}</Text>,
  },
];

const actions: DataTableAction<User>[] = [
  {
    icon: <IconEdit size={16} />,
    label: 'Edit',
    color: 'blue',
    onClick: (user) => handleEdit(user),
  },
];

<DataTable
  data={users}
  columns={columns}
  actions={actions}
  loading={loading}
/>;
```

### Form Components

#### Form

Complete form wrapper with actions, validation, and consistent styling.

```tsx
import { Form, FormField, TextInput, type FormAction } from '@shreehari/ui';

const actions: FormAction[] = [
  { label: 'Cancel', variant: 'outline', onClick: handleCancel },
  { label: 'Save', variant: 'brand', type: 'submit', onClick: handleSave },
];

<Form title="User Information" onSubmit={handleSubmit} actions={actions}>
  <FormField>
    <TextInput label="Name" required />
  </FormField>
</Form>;
```

#### Form Inputs

Enhanced input components with consistent styling and validation support.

- `TextInput` - Text input with validation
- `NumberInput` - Number input with formatting
- `PasswordInput` - Password input with toggle visibility
- `Textarea` - Multi-line text input
- `Select` - Dropdown selection
- `MultiSelect` - Multiple selection dropdown

### PageHeader

Consistent page header with title, subtitle, and action buttons.

```tsx
import { PageHeader, type PageHeaderAction } from '@shreehari/ui';

const actions: PageHeaderAction[] = [
  {
    label: 'Add User',
    variant: 'brand',
    leftSection: <IconPlus size={16} />,
    onClick: handleAddUser,
  },
];

<PageHeader
  title="Users Management"
  subtitle="Manage user accounts and permissions"
  actions={actions}
/>;
```

### Badges

#### StatusBadge

Smart badge component that automatically colors based on status.

```tsx
import { StatusBadge } from '@shreehari/ui';

<StatusBadge status="success">Active</StatusBadge>
<StatusBadge status="pending">Pending</StatusBadge>
<StatusBadge status="error">Failed</StatusBadge>
```

#### StockBadge

Specialized badge for inventory status with customizable thresholds.

```tsx
import { StockBadge } from '@shreehari/ui';

<StockBadge
  stock={25}
  lowStockThreshold={50}
  outOfStockLabel="Out of Stock"
  lowStockLabel="Low Stock"
  inStockLabel="In Stock"
/>;
```

### Modal

Enhanced modal component with actions and consistent styling.

```tsx
import { Modal, ConfirmationModal, type ModalAction } from '@shreehari/ui';

const actions: ModalAction[] = [
  { label: 'Cancel', variant: 'outline', onClick: handleCancel },
  { label: 'Confirm', variant: 'filled', color: 'red', onClick: handleConfirm }
];

<Modal
  opened={opened}
  onClose={onClose}
  title="Edit User"
  actions={actions}
>
  {/* Modal content */}
</Modal>

// Or use the confirmation modal for destructive actions
<ConfirmationModal
  opened={deleteModalOpened}
  onClose={() => setDeleteModalOpened(false)}
  onConfirm={handleDelete}
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  variant="danger"
/>
```

### SearchFilter

Comprehensive search and filtering component.

```tsx
import { SearchFilter, type FilterOption } from '@shreehari/ui';

const filterOptions: FilterOption[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    value: filters.status,
  },
  {
    key: 'dateFrom',
    label: 'From Date',
    type: 'date',
    value: filters.dateFrom,
  },
];

<SearchFilter
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  searchPlaceholder="Search users..."
  filters={filterOptions}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
  filtersExpanded={filtersExpanded}
  onToggleFilters={setFiltersExpanded}
/>;
```

## Usage Examples

### Complete Page Example

```tsx
import React, { useState, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import {
  DataTable,
  PageHeader,
  SearchFilter,
  StatusBadge,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
} from '@shreehari/ui';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Define columns
  const columns: Column[] = [
    {
      key: 'name',
      title: 'Name',
      render: (value, record) => (
        <div>
          <Text fw={500}>{value}</Text>
          <Text size="xs" c="dimmed">
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
  ];

  // Define actions
  const actions: DataTableAction[] = [
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'blue',
      onClick: handleEdit,
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: handleDelete,
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Add User',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: handleAddUser,
    },
  ];

  return (
    <Stack gap="md">
      <PageHeader
        title="Users Management"
        subtitle="Manage user accounts and permissions"
        actions={headerActions}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search users..."
        // Add filters as needed
      />

      <DataTable
        data={filteredUsers}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No users found"
      />
    </Stack>
  );
};
```

### Form Example

```tsx
import React, { useState } from 'react';
import { Grid } from '@mantine/core';
import {
  Form,
  FormField,
  TextInput,
  Select,
  Textarea,
  PageHeader,
  type FormAction,
} from '@shreehari/ui';

export const UserFormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
  });

  const formActions: FormAction[] = [
    { label: 'Cancel', variant: 'outline', onClick: handleCancel },
    { label: 'Save User', variant: 'brand', type: 'submit', onClick: () => {} },
  ];

  return (
    <Stack gap="md">
      <PageHeader title="Add New User" />

      <Form
        title="User Information"
        onSubmit={handleSubmit}
        actions={formActions}
      >
        <Grid>
          <Grid.Col span={6}>
            <FormField>
              <TextInput
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={6}>
            <FormField>
              <TextInput
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={12}>
            <FormField>
              <Select
                label="Role"
                data={[
                  { value: 'admin', label: 'Administrator' },
                  { value: 'user', label: 'User' },
                ]}
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value })}
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={12}>
            <FormField>
              <Textarea
                label="Bio"
                placeholder="Enter user bio..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </FormField>
          </Grid.Col>
        </Grid>
      </Form>
    </Stack>
  );
};
```

## Benefits

1. **Consistency** - All components follow the same design patterns and styling
2. **Reusability** - Use across multiple projects and applications
3. **Type Safety** - Full TypeScript support with comprehensive type definitions
4. **Flexibility** - Highly customizable while maintaining consistency
5. **Productivity** - Reduce development time with pre-built components
6. **Maintainability** - Centralized component library for easy updates

## Installation

```bash
npm install @shreehari/ui
```

Make sure to also install the required peer dependencies:

- `@mantine/core`
- `@mantine/hooks`
- `@tabler/icons-react`
- `react`
- `react-dom`
