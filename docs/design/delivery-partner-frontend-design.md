# Frontend Design Doc: Delivery Partner Module (Admin Dashboard)

**Status:** Draft
**Date:** 2026-03-22
**PRD Reference:** `docs/prd/delivery-partner-module.md`
**Backend Design Doc:** `docs/design/delivery-partner-backend-design.md`
**UI Spec:** `docs/ui-spec/delivery-partner-module-ui-spec.md`
**Feature Scope:** `apps/admin` (React + Vite) · `libs/data-access` (hooks)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Component Architecture](#2-component-architecture)
3. [Data Access Layer](#3-data-access-layer)
4. [Page Implementations](#4-page-implementations)
5. [Navigation & Routing](#5-navigation--routing)
6. [State Management](#6-state-management)
7. [Integration Points](#7-integration-points)
8. [Affected Files Summary](#8-affected-files-summary)

---

## 1. Overview

### 1.1 Purpose

This document specifies the frontend implementation for the Delivery Partner Module within the `apps/admin` React + Vite admin dashboard. It covers two new pages (list and form), modifications to the existing OrdersPage, navigation/routing updates, and new data-fetching hooks in `libs/data-access`.

### 1.2 Scope

- **In scope:** Admin dashboard pages, data-fetching hooks, navigation, routing.
- **Out of scope:** Backend API implementation (covered by `delivery-partner-backend-design.md`), shared types (covered by backend design doc Section 7), `apps/web` and `order_delivery_manager_app`.

### 1.3 Design Principles

- Match all existing patterns exactly: Mantine components, `@shreehari/ui` shared components, notification patterns, modal patterns, hook structure.
- No new external dependencies required.
- All hooks follow the established `useState` + `useEffect` + `apiCall` pattern in `libs/data-access/src/index.ts`.

---

## 2. Component Architecture

### 2.1 New Pages

#### DeliveryPartnersPage Component Tree

```
DeliveryPartnersPage
├── PageHeader
│   ├── title: "Delivery Partners"
│   ├── subtitle: "Manage delivery partners and their availability"
│   └── actions: [{ label: "Add Delivery Partner", variant: "brand", icon: IconPlus }]
├── SearchFilter
│   ├── searchValue / onSearchChange
│   ├── searchPlaceholder: "Search delivery partners by name or mobile number..."
│   └── filters: [statusFilter]
├── DataTable<DeliveryPartnerDto>
│   ├── columns: [Name, Mobile Number, Status, Actions]
│   ├── data: filteredPartners
│   ├── loading: boolean
│   └── emptyMessage: "No delivery partners yet. Add one to get started."
└── ConfirmationModal
    ├── title: "Delete Delivery Partner"
    ├── message: dynamic with partner name
    └── variant: "danger"
```

#### DeliveryPartnerFormPage Component Tree

```
DeliveryPartnerFormPage
├── PageHeader
│   ├── title: "Add Delivery Partner" | "Edit Delivery Partner"
│   └── subtitle: "Add a new delivery partner" | "Update delivery partner details"
└── Form (from @shreehari/ui)
    ├── title: "Delivery Partner Details"
    ├── Grid
    │   ├── Grid.Col (span 6) → TextInput: Name (required)
    │   ├── Grid.Col (span 6) → TextInput: Mobile Number (required)
    │   └── Grid.Col (span 6) → Switch: Active
    └── actions: [Cancel, Save/Update]
```

#### OrdersPage Modifications Tree (additions only)

```
OrdersPage (modified)
├── SearchFilter
│   └── filters: [...existing, deliveryPartnerFilter]       ← NEW
├── DataTable
│   └── columns: [...existing, deliveryPartnerColumn]        ← NEW
│   └── actions: [...existing, assignPartnerAction]          ← NEW
├── Order Details Modal
│   └── <Group> Delivery Partner: name or "Unassigned"       ← NEW
└── Assign Delivery Partner Modal                            ← NEW
    ├── Order context (customer name, current partner)
    ├── Select (searchable, active partners + "None")
    └── Buttons: [Cancel, Assign]
```

### 2.2 Props Interfaces

#### DeliveryPartnerFormData

```ts
interface DeliveryPartnerFormData {
  name: string;
  mobileNumber: string;
  isActive: boolean;
}
```

This interface is local to `DeliveryPartnerFormPage`. It mirrors the `CreateDeliveryPartnerDto` shape but with `isActive` always present (defaults to `true` in create mode).

---

## 3. Data Access Layer

All hooks are added to `libs/data-access/src/index.ts`, following the exact patterns established by the existing customer and order hooks. Each hook uses the shared `apiCall` helper and the `API_BASE_URL` constant already defined in the file.

### 3.1 Type Imports

Add to the existing import block from `@shreehari/types`:

```ts
import {
  // ... existing imports ...
  DeliveryPartnerDto,
  CreateDeliveryPartnerDto,
  UpdateDeliveryPartnerDto,
  AssignDeliveryPartnerDto,
} from '@shreehari/types';
```

### 3.2 useDeliveryPartners

Fetches all delivery partners, with optional active-only filtering. Returns a flat array (no pagination needed — partner list expected to be < 100 entries).

**Pattern source:** `useCustomers` (list fetch with query params and `useEffect` trigger).

```ts
export const useDeliveryPartners = (activeOnly?: boolean) => {
  const [data, setData] = useState<DeliveryPartnerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (activeOnly) {
        queryParams.append('active', 'true');
      }

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/delivery-partners?${queryString}`
        : '/delivery-partners';

      const response = await apiCall<DeliveryPartnerDto[]>(endpoint);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch delivery partners'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [activeOnly]);

  return { data, loading, error, refetch };
};
```

**API endpoint:** `GET /api/delivery-partners` or `GET /api/delivery-partners?active=true`
**Response type:** `ApiResponse<DeliveryPartnerDto[]>`

### 3.3 useDeliveryPartner

Fetches a single delivery partner by ID. Used by `DeliveryPartnerFormPage` in edit mode.

**Pattern source:** `useCustomer` (single-entity fetch with ID guard).

```ts
export const useDeliveryPartner = (id: string) => {
  const [data, setData] = useState<DeliveryPartnerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<DeliveryPartnerDto>(
          `/delivery-partners/${id}`
        );
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch delivery partner'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPartner();
    }
  }, [id]);

  return { data, loading, error };
};
```

**API endpoint:** `GET /api/delivery-partners/:id`
**Response type:** `ApiResponse<DeliveryPartnerDto>`

### 3.4 useCreateDeliveryPartner

Creates a new delivery partner. Returns a mutation function.

**Pattern source:** `useCreateCustomer`.

```ts
export const useCreateDeliveryPartner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDeliveryPartner = async (
    data: CreateDeliveryPartnerDto
  ): Promise<DeliveryPartnerDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<DeliveryPartnerDto>('/delivery-partners', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to create delivery partner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createDeliveryPartner, loading, error };
};
```

**API endpoint:** `POST /api/delivery-partners`
**Request body:** `CreateDeliveryPartnerDto`
**Response type:** `ApiResponse<DeliveryPartnerDto>` (201)

### 3.5 useUpdateDeliveryPartner

Updates an existing delivery partner.

**Pattern source:** `useUpdateCustomer`.

```ts
export const useUpdateDeliveryPartner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDeliveryPartner = async (
    id: string,
    data: UpdateDeliveryPartnerDto
  ): Promise<DeliveryPartnerDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<DeliveryPartnerDto>(
        `/delivery-partners/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update delivery partner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateDeliveryPartner, loading, error };
};
```

**API endpoint:** `PUT /api/delivery-partners/:id`
**Request body:** `UpdateDeliveryPartnerDto`
**Response type:** `ApiResponse<DeliveryPartnerDto>` (200)

### 3.6 useDeleteDeliveryPartner

Deletes a delivery partner by ID.

**Pattern source:** `useDeleteOrder` / `useDeleteCustomer`.

```ts
export const useDeleteDeliveryPartner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDeliveryPartner = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/delivery-partners/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to delete delivery partner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteDeliveryPartner, loading, error };
};
```

**API endpoint:** `DELETE /api/delivery-partners/:id`
**Response type:** `{ success: true, message: "Delivery partner deleted" }` (200)

### 3.7 useAssignDeliveryPartner

Assigns or unassigns a delivery partner to/from an order.

**Pattern source:** `useUpdateOrderStatus` (PATCH mutation hook).

```ts
export const useAssignDeliveryPartner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignDeliveryPartner = async (
    orderId: string,
    data: AssignDeliveryPartnerDto
  ): Promise<OrderDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<OrderDto>(
        `/orders/${orderId}/assign-partner`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to assign delivery partner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { assignDeliveryPartner, loading, error };
};
```

**API endpoint:** `PATCH /api/orders/:id/assign-partner`
**Request body:** `AssignDeliveryPartnerDto` (`{ deliveryPartnerId: string | null }`)
**Response type:** `ApiResponse<OrderDto>` (200)

### 3.8 Export Registration

All hooks are exported directly from `libs/data-access/src/index.ts` (they are defined inline in the file, matching the existing pattern). No separate hook files are needed.

---

## 4. Page Implementations

### 4.1 DeliveryPartnersPage

**File:** `apps/admin/src/pages/DeliveryPartnersPage.tsx`
**Route:** `/delivery-partners`
**Pattern source:** `CustomersPage.tsx`

#### 4.1.1 Imports

```ts
import React, { useState } from 'react';
import { Text, Stack, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { DeliveryPartnerDto } from '@shreehari/types';
import {
  useDeliveryPartners,
  useDeleteDeliveryPartner,
} from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  ConfirmationModal,
  SearchFilter,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
} from '@shreehari/ui';
```

#### 4.1.2 State

```ts
const navigate = useNavigate();

// Data fetching
const { data: partners, loading, error, refetch } = useDeliveryPartners();
const { deleteDeliveryPartner, loading: deleting } = useDeleteDeliveryPartner();

// Local UI state
const [searchValue, setSearchValue] = useState('');
const [selectedStatus, setSelectedStatus] = useState('');
const [deleteModalOpened, setDeleteModalOpened] = useState(false);
const [selectedPartner, setSelectedPartner] = useState<DeliveryPartnerDto | null>(null);
```

#### 4.1.3 Client-Side Filtering

Partners are filtered client-side (expected < 100 entries). No server-side pagination or search.

```ts
const filteredPartners = (partners || []).filter((partner) => {
  // Search filter: name or mobileNumber
  if (searchValue) {
    const search = searchValue.toLowerCase();
    const matchesSearch =
      partner.name.toLowerCase().includes(search) ||
      partner.mobileNumber.includes(search);
    if (!matchesSearch) return false;
  }

  // Status filter
  if (selectedStatus === 'active' && !partner.isActive) return false;
  if (selectedStatus === 'inactive' && partner.isActive) return false;

  return true;
});
```

#### 4.1.4 DataTable Columns

```ts
const columns: Column<DeliveryPartnerDto>[] = [
  {
    key: 'name',
    title: 'Name',
    render: (value) => (
      <Text size="sm" fw={500}>{value}</Text>
    ),
  },
  {
    key: 'mobileNumber',
    title: 'Mobile Number',
    render: (value) => (
      <Text size="sm">{value}</Text>
    ),
  },
  {
    key: 'isActive',
    title: 'Status',
    render: (value) => (
      <Badge variant="light" color={value ? 'green' : 'gray'}>
        {value ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
```

The Status column uses the same `Badge` pattern as the `isMonthlyPayment` column in `CustomersPage`.

#### 4.1.5 Row Actions

```ts
const actions: DataTableAction<DeliveryPartnerDto>[] = [
  {
    icon: <IconEdit size={16} />,
    label: 'Edit',
    color: 'gray',
    onClick: (partner) => navigate(`/delivery-partners/${partner.id}/edit`),
  },
  {
    icon: <IconTrash size={16} />,
    label: 'Delete',
    color: 'red',
    onClick: (partner) => {
      setSelectedPartner(partner);
      setDeleteModalOpened(true);
    },
  },
];
```

#### 4.1.6 Header Actions

```ts
const headerActions: PageHeaderAction[] = [
  {
    label: 'Add Delivery Partner',
    variant: 'brand',
    leftSection: <IconPlus size={16} />,
    onClick: () => navigate('/delivery-partners/new'),
  },
];
```

#### 4.1.7 Search and Filter Configuration

```ts
const filterOptions: FilterOption[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    value: selectedStatus,
    placeholder: 'All statuses',
  },
];

const handleFilterChange = (key: string, value: any) => {
  if (key === 'status') {
    setSelectedStatus(value || '');
  }
};

const handleClearFilters = () => {
  setSearchValue('');
  setSelectedStatus('');
};
```

#### 4.1.8 Delete Handler

```ts
const confirmDelete = async () => {
  if (selectedPartner) {
    try {
      await deleteDeliveryPartner(selectedPartner.id);
      setDeleteModalOpened(false);
      setSelectedPartner(null);
      refetch();
      notifications.show({
        title: 'Success',
        message: 'Delivery partner deleted successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete delivery partner',
        color: 'red',
      });
    }
  }
};
```

#### 4.1.9 Render Structure

```tsx
// Error state (matches CustomersPage pattern)
if (error) {
  return (
    <Stack gap="md">
      <PageHeader
        title="Delivery Partners"
        subtitle="Manage delivery partners and their availability"
        actions={headerActions}
      />
      <Text c="red">Error loading delivery partners: {error}</Text>
    </Stack>
  );
}

// Normal render
return (
  <Stack gap="md">
    <PageHeader
      title="Delivery Partners"
      subtitle="Manage delivery partners and their availability"
      actions={headerActions}
    />

    <SearchFilter
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder="Search delivery partners by name or mobile number..."
      filters={filterOptions}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
    />

    <DataTable
      data={filteredPartners}
      columns={columns}
      actions={actions}
      loading={loading}
      emptyMessage="No delivery partners yet. Add one to get started."
    />

    <ConfirmationModal
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      onConfirm={confirmDelete}
      title="Delete Delivery Partner"
      message={`Are you sure you want to delete "${selectedPartner?.name}"? Orders assigned to this partner will become unassigned.`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      loading={deleting}
      variant="danger"
    />
  </Stack>
);
```

**Key difference from CustomersPage:** No `PaginationControls` — the delivery partner list is small enough to not require pagination.

---

### 4.2 DeliveryPartnerFormPage

**File:** `apps/admin/src/pages/DeliveryPartnerFormPage.tsx`
**Routes:** `/delivery-partners/new` (create), `/delivery-partners/:id/edit` (edit)
**Pattern source:** `CustomerFormPage.tsx`

#### 4.2.1 Imports

```ts
import React, { useState, useEffect } from 'react';
import { Stack, Grid, Switch } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import {
  useDeliveryPartner,
  useCreateDeliveryPartner,
  useUpdateDeliveryPartner,
} from '@shreehari/data-access';
import {
  Form,
  FormField,
  TextInput,
  PageHeader,
  type FormAction,
} from '@shreehari/ui';
```

#### 4.2.2 State

```ts
const navigate = useNavigate();
const { id } = useParams<{ id: string }>();
const isEditing = Boolean(id);

const [formData, setFormData] = useState<DeliveryPartnerFormData>({
  name: '',
  mobileNumber: '',
  isActive: true,
});

const { data: partner, loading: loadingPartner } = useDeliveryPartner(id || '');
const { createDeliveryPartner, loading: creating } = useCreateDeliveryPartner();
const { updateDeliveryPartner, loading: updating } = useUpdateDeliveryPartner();

const loading = creating || updating;
```

#### 4.2.3 Load Partner Data for Edit Mode

```ts
useEffect(() => {
  if (isEditing && partner) {
    setFormData({
      name: partner.name,
      mobileNumber: partner.mobileNumber,
      isActive: partner.isActive,
    });
  }
}, [isEditing, partner]);
```

#### 4.2.4 Form Field Update Helper

```ts
const updateFormData = (field: keyof DeliveryPartnerFormData, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};
```

#### 4.2.5 Submit Handler

```ts
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const data = {
      name: formData.name.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      isActive: formData.isActive,
    };

    if (isEditing && id) {
      await updateDeliveryPartner(id, data);
      notifications.show({
        title: 'Success',
        message: 'Delivery partner updated successfully',
        color: 'green',
      });
    } else {
      await createDeliveryPartner(data);
      notifications.show({
        title: 'Success',
        message: 'Delivery partner created successfully',
        color: 'green',
      });
    }

    navigate('/delivery-partners');
  } catch (error) {
    notifications.show({
      title: 'Error',
      message: `Failed to ${isEditing ? 'update' : 'create'} delivery partner`,
      color: 'red',
    });
  }
};
```

#### 4.2.6 Form Actions

```ts
const formActions: FormAction[] = [
  {
    label: 'Cancel',
    variant: 'outline',
    onClick: () => navigate('/delivery-partners'),
    disabled: loading,
  },
  {
    label: isEditing ? 'Update Delivery Partner' : 'Save Delivery Partner',
    variant: 'brand',
    type: 'submit',
    loading: loading,
    onClick: () => {},  // Handled by form onSubmit
  },
];
```

#### 4.2.7 Render Structure

```tsx
// Loading state in edit mode (matches CustomerFormPage pattern)
if (isEditing && loadingPartner) {
  return <div>Loading delivery partner...</div>;
}

return (
  <Stack gap="md">
    <PageHeader
      title={isEditing ? 'Edit Delivery Partner' : 'Add Delivery Partner'}
      subtitle={
        isEditing
          ? 'Update delivery partner details'
          : 'Add a new delivery partner'
      }
    />

    <Form
      title="Delivery Partner Details"
      onSubmit={handleSubmit}
      actions={formActions}
      loading={loading}
      actionsPosition="right"
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <FormField>
            <TextInput
              label="Name"
              placeholder="Enter delivery partner name"
              required
              value={formData.name}
              onChange={(event) =>
                updateFormData('name', event.currentTarget.value)
              }
            />
          </FormField>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <FormField>
            <TextInput
              label="Mobile Number"
              placeholder="9876543210"
              required
              value={formData.mobileNumber}
              onChange={(event) =>
                updateFormData('mobileNumber', event.currentTarget.value)
              }
            />
          </FormField>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <FormField>
            <Switch
              label="Active"
              description="Inactive partners will not appear in order assignment dropdowns"
              checked={formData.isActive}
              onChange={(event) =>
                updateFormData('isActive', event.currentTarget.checked)
              }
            />
          </FormField>
        </Grid.Col>
      </Grid>
    </Form>
  </Stack>
);
```

**Validation:** Uses HTML `required` attribute on `TextInput` components (native browser validation), matching the `CustomerFormPage` pattern. Server-side 400 errors are shown via Mantine notifications in the catch block.

---

### 4.3 OrdersPage Modifications

**File:** `apps/admin/src/pages/OrdersPage.tsx`
**Pattern source:** Existing `OrdersPage.tsx` (status update modal, filter patterns)

#### 4.3.1 New Imports

Add to existing imports:

```ts
import { IconTruck } from '@tabler/icons-react';
import { DeliveryPartnerDto } from '@shreehari/types';
import {
  useDeliveryPartners,
  useAssignDeliveryPartner,
} from '@shreehari/data-access';
```

Add `Select` to the Mantine core import (already imported in current file).

#### 4.3.2 New State

```ts
// Assign partner modal state
const [assignPartnerOpened, setAssignPartnerOpened] = useState(false);
const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
const [assignLoading, setAssignLoading] = useState(false);

// Fetch active delivery partners (for assign modal dropdown and filter dropdown)
const { data: activePartners } = useDeliveryPartners(true); // true = active only

// Assign partner hook
const { assignDeliveryPartner } = useAssignDeliveryPartner();
```

#### 4.3.3 Filter State Modification

Extend the existing `filters` state object:

```ts
// BEFORE
const [filters, setFilters] = useState({
  status: '',
  paymentMode: '',
  dateFrom: '',
  dateTo: '',
});

// AFTER
const [filters, setFilters] = useState({
  status: '',
  paymentMode: '',
  dateFrom: '',
  dateTo: '',
  deliveryPartnerId: '',  // NEW
});
```

#### 4.3.4 useOrders Hook Call Modification

The existing `useOrders` hook passes `filters.status` as the status parameter. The `deliveryPartnerId` filter needs to be passed as well. This requires either:

**Option A (recommended):** Extend `useOrders` to accept a `deliveryPartnerId` parameter:

```ts
// In libs/data-access/src/index.ts, extend useOrders signature:
export const useOrders = (
  page = 1,
  limit = 10,
  status?: string,
  sortBy?: string,
  sortOrder?: 'ASC' | 'DESC',
  deliveryPartnerId?: string  // NEW
) => {
  // ... existing code ...

  const refetch = async () => {
    // ... existing queryParams setup ...

    if (deliveryPartnerId) {
      queryParams.append('deliveryPartnerId', deliveryPartnerId);
    }

    // ... rest unchanged ...
  };

  useEffect(() => {
    refetch();
  }, [page, limit, status, sortBy, sortOrder, deliveryPartnerId]); // ADD deliveryPartnerId

  return { data, loading, error, refetch };
};
```

**OrdersPage call site update:**

```ts
const {
  data: ordersData,
  loading,
  error,
  refetch,
} = useOrders(
  page,
  limit,
  filters.status,
  undefined,                    // sortBy
  undefined,                    // sortOrder
  filters.deliveryPartnerId || undefined  // NEW
);
```

#### 4.3.5 handleClearFilters Modification

```ts
// BEFORE
const handleClearFilters = () => {
  setFilters({
    status: '',
    paymentMode: '',
    dateFrom: '',
    dateTo: '',
  });
};

// AFTER
const handleClearFilters = () => {
  setFilters({
    status: '',
    paymentMode: '',
    dateFrom: '',
    dateTo: '',
    deliveryPartnerId: '',  // NEW
  });
};
```

#### 4.3.6 useEffect for Filter Reset

Add `filters.deliveryPartnerId` to the dependency array of the existing filter-change `useEffect`:

```ts
useEffect(() => {
  setPage(1);
  setSelectedOrders([]);
}, [filters.status, filters.deliveryPartnerId]); // ADD deliveryPartnerId
```

#### 4.3.7 New "Delivery Partner" Column

Add to the `columns` array, positioned after the `status` column and before the `paymentMode` column:

```ts
{
  key: 'deliveryPartnerName',
  title: 'Delivery Partner',
  render: (value: string | null | undefined) => (
    <Text size="sm" c={value ? undefined : 'dimmed'} fs={value ? undefined : 'italic'}>
      {value || 'Unassigned'}
    </Text>
  ),
},
```

When a partner is assigned, the name displays in normal text. When unassigned, "Unassigned" displays in dimmed gray italic, providing clear visual distinction.

#### 4.3.8 New "Assign Partner" Row Action

Add to the `actions` array, after the "Update Status" action and before the "Copy Summary" action:

```ts
{
  icon: <IconTruck size={16} />,
  label: 'Assign Partner',
  color: 'violet',
  onClick: handleAssignPartner,
},
```

Uses `color="violet"` to visually distinguish from other actions (blue=View, green=Update Status, teal=Copy, gray=Edit, red=Delete).

#### 4.3.9 New Delivery Partner Filter

Add to the `filterOptions` array, after the `status` filter:

```ts
{
  key: 'deliveryPartnerId',
  label: 'Delivery Partner',
  type: 'select',
  placeholder: 'All partners',
  options: [
    { value: 'unassigned', label: 'Unassigned' },
    ...(activePartners || []).map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ],
  value: filters.deliveryPartnerId,
},
```

Filter behavior:
- Empty/cleared ("All partners"): No filter — shows all orders.
- "Unassigned": Passes `deliveryPartnerId=unassigned` to `GET /api/orders`.
- Specific partner UUID: Passes `deliveryPartnerId=<uuid>`.

#### 4.3.10 Assign Partner Handlers

```ts
const handleAssignPartner = (order: OrderDto) => {
  setSelectedOrder(order);
  setSelectedPartnerId(order.deliveryPartnerId || '__none__');
  setAssignPartnerOpened(true);
};

const handleAssignPartnerSubmit = async () => {
  if (!selectedOrder) return;

  setAssignLoading(true);
  try {
    const partnerId =
      selectedPartnerId === '__none__' ? null : selectedPartnerId;
    await assignDeliveryPartner(selectedOrder.id, {
      deliveryPartnerId: partnerId,
    });
    setAssignPartnerOpened(false);
    setSelectedOrder(null);
    notifications.show({
      title: 'Success',
      message: partnerId
        ? 'Delivery partner assigned successfully'
        : 'Delivery partner unassigned successfully',
      color: 'green',
    });
    refetch();
  } catch (error) {
    notifications.show({
      title: 'Error',
      message: 'Failed to assign delivery partner',
      color: 'red',
    });
  } finally {
    setAssignLoading(false);
  }
};
```

The sentinel value `'__none__'` is used in the Select dropdown to represent "unassign". When submitted, it is mapped to `null` in the API request body.

#### 4.3.11 Assign Delivery Partner Modal

Add after the existing Bulk Status Update Modal:

```tsx
{/* Assign Delivery Partner Modal */}
<Modal
  opened={assignPartnerOpened}
  onClose={() => setAssignPartnerOpened(false)}
  title={`Assign Delivery Partner - #${selectedOrder?.id?.slice(0, 8) || ''}`}
  size="md"
>
  {selectedOrder && (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={500}>Customer:</Text>
        <Text>{selectedOrder.customerName}</Text>
      </Group>
      <Group justify="space-between">
        <Text fw={500}>Current Partner:</Text>
        <Text c={selectedOrder.deliveryPartnerName ? undefined : 'dimmed'}>
          {selectedOrder.deliveryPartnerName || 'Unassigned'}
        </Text>
      </Group>

      <Select
        label="Delivery Partner"
        placeholder="Select a delivery partner"
        data={[
          { value: '__none__', label: 'None (Unassign)' },
          ...(activePartners || []).map((p) => ({
            value: p.id,
            label: `${p.name} — ${p.mobileNumber}`,
          })),
        ]}
        value={selectedPartnerId}
        onChange={(value) => setSelectedPartnerId(value)}
        searchable
        clearable={false}
      />

      <Group justify="end" mt="md">
        <Button
          variant="outline"
          onClick={() => setAssignPartnerOpened(false)}
          disabled={assignLoading}
        >
          Cancel
        </Button>
        <Button onClick={handleAssignPartnerSubmit} loading={assignLoading}>
          Assign
        </Button>
      </Group>
    </Stack>
  )}
</Modal>
```

The modal follows the same structure as the Status Update Modal: title with truncated order ID, context info rows, a Select input, and Cancel/Submit buttons.

#### 4.3.12 Order Details Modal Addition

Add a delivery partner info row to the Order Details Modal, after the "Status" row:

```tsx
<Group justify="space-between">
  <Text fw={500}>Delivery Partner:</Text>
  <Text c={selectedOrder.deliveryPartnerName ? undefined : 'dimmed'}>
    {selectedOrder.deliveryPartnerName || 'Unassigned'}
  </Text>
</Group>
```

---

## 5. Navigation & Routing

### 5.1 Layout.tsx — Sidebar Navigation

**File:** `apps/admin/src/components/Layout.tsx`

Add `IconTruck` import and a new navigation entry after "Orders":

```ts
// Add to imports
import { IconTruck } from '@tabler/icons-react';

// Updated navigation array
const navigation = [
  { icon: IconDashboard, label: 'Dashboard', href: '/' },
  { icon: IconShoppingCart, label: 'Orders', href: '/orders' },
  { icon: IconTruck, label: 'Delivery Partners', href: '/delivery-partners' },  // NEW
  { icon: IconBox, label: 'Products', href: '/products' },
  { icon: IconTag, label: 'Categories', href: '/categories' },
  { icon: IconUsers, label: 'Customers', href: '/customers' },
  { icon: IconReceipt, label: 'Monthly Billing', href: '/monthly-billing' },
  { icon: IconHome, label: 'Societies', href: '/societies' },
  { icon: IconBuilding, label: 'Buildings', href: '/buildings' },
];
```

The `IconTruck` icon is already available in the `@tabler/icons-react` package used across the admin app. Active state styling is handled automatically by the existing `isActive` pattern in the `Layout` component (`variant="filled"` + `color="shreehari-brand"` when `location.pathname === item.href`).

### 5.2 App.tsx — Route Registration

**File:** `apps/admin/src/App.tsx`

Add imports and routes:

```tsx
// Add to imports
import { DeliveryPartnersPage } from './pages/DeliveryPartnersPage';
import { DeliveryPartnerFormPage } from './pages/DeliveryPartnerFormPage';

// Add inside <Routes>, after the /orders/analytics route and before /products
<Route path="/delivery-partners" element={<DeliveryPartnersPage />} />
<Route path="/delivery-partners/new" element={<DeliveryPartnerFormPage />} />
<Route path="/delivery-partners/:id/edit" element={<DeliveryPartnerFormPage />} />
```

Route placement matches the navigation order: Orders, then Delivery Partners, then Products.

---

## 6. State Management

### 6.1 DeliveryPartnersPage State Summary

| State Variable | Type | Purpose |
|----------------|------|---------|
| `partners` | `DeliveryPartnerDto[]` | Full partner list from API (via `useDeliveryPartners`) |
| `loading` | `boolean` | Data fetch loading state |
| `error` | `string \| null` | Data fetch error |
| `searchValue` | `string` | Client-side search input value |
| `selectedStatus` | `string` | Client-side status filter value (`''`, `'active'`, `'inactive'`) |
| `deleteModalOpened` | `boolean` | Delete confirmation modal visibility |
| `selectedPartner` | `DeliveryPartnerDto \| null` | Partner selected for deletion |
| `deleting` | `boolean` | Delete operation loading state |

**Data flow:** API returns full list -> `filteredPartners` computed inline -> passed to `DataTable.data`. No server-side filtering or pagination.

### 6.2 DeliveryPartnerFormPage State Summary

| State Variable | Type | Purpose |
|----------------|------|---------|
| `id` | `string \| undefined` | Route param, determines create vs edit mode |
| `isEditing` | `boolean` | `Boolean(id)` |
| `formData` | `DeliveryPartnerFormData` | Form field values |
| `partner` | `DeliveryPartnerDto \| null` | Loaded partner data in edit mode |
| `loadingPartner` | `boolean` | Edit-mode data loading |
| `creating` | `boolean` | Create mutation loading |
| `updating` | `boolean` | Update mutation loading |
| `loading` | `boolean` | `creating \|\| updating` |

**Data flow:** In edit mode, `useDeliveryPartner(id)` fetches data -> `useEffect` populates `formData` -> user edits -> submit calls `createDeliveryPartner` or `updateDeliveryPartner` -> navigate back.

### 6.3 OrdersPage New State Summary

| State Variable | Type | Purpose |
|----------------|------|---------|
| `assignPartnerOpened` | `boolean` | Assign partner modal visibility |
| `selectedPartnerId` | `string \| null` | Currently selected partner in assign modal dropdown |
| `assignLoading` | `boolean` | Assign operation loading state |
| `activePartners` | `DeliveryPartnerDto[]` | Active partners list for dropdown/filter (via `useDeliveryPartners(true)`) |
| `filters.deliveryPartnerId` | `string` | Delivery partner filter value for order list |

**Data flow for assignment:** User clicks "Assign Partner" action -> `handleAssignPartner` opens modal with pre-selected partner -> user selects new partner -> "Assign" button calls `assignDeliveryPartner` -> refetch orders list.

**Data flow for filtering:** User selects partner in filter dropdown -> `filters.deliveryPartnerId` updates -> `useOrders` refetches with new `deliveryPartnerId` query param -> DataTable updates.

---

## 7. Integration Points

This section maps each frontend interaction to the backend API endpoint defined in the backend design doc (Section 8).

### 7.1 Delivery Partners List Page

| Frontend Action | API Call | Request | Response |
|-----------------|----------|---------|----------|
| Page load | `GET /api/delivery-partners` | -- | `ApiResponse<DeliveryPartnerDto[]>` |
| Delete partner | `DELETE /api/delivery-partners/:id` | -- | `{ success: true, message: "..." }` |

### 7.2 Delivery Partner Form Page

| Frontend Action | API Call | Request Body | Response |
|-----------------|----------|-------------|----------|
| Load partner (edit mode) | `GET /api/delivery-partners/:id` | -- | `ApiResponse<DeliveryPartnerDto>` |
| Create partner | `POST /api/delivery-partners` | `CreateDeliveryPartnerDto` | `ApiResponse<DeliveryPartnerDto>` (201) |
| Update partner | `PUT /api/delivery-partners/:id` | `UpdateDeliveryPartnerDto` | `ApiResponse<DeliveryPartnerDto>` (200) |

### 7.3 Orders Page

| Frontend Action | API Call | Request | Response |
|-----------------|----------|---------|----------|
| Load orders (with partner filter) | `GET /api/orders?deliveryPartnerId=...` | Query param | `PaginatedResponse<OrderDto>` |
| Load active partners (for dropdown/filter) | `GET /api/delivery-partners?active=true` | Query param | `ApiResponse<DeliveryPartnerDto[]>` |
| Assign partner to order | `PATCH /api/orders/:id/assign-partner` | `{ deliveryPartnerId: string \| null }` | `ApiResponse<OrderDto>` |
| Unassign partner from order | `PATCH /api/orders/:id/assign-partner` | `{ deliveryPartnerId: null }` | `ApiResponse<OrderDto>` |

### 7.4 Error Handling Approach

All API errors follow the same pattern used across the existing codebase:

| Error Scenario | Frontend Handling |
|----------------|-------------------|
| List fetch fails | Inline `<Text c="red">Error loading...</Text>` replaces the table |
| Create/update/delete fails | `notifications.show({ title: 'Error', message: '...', color: 'red' })` |
| Assign partner fails | `notifications.show({ title: 'Error', message: '...', color: 'red' })` |
| 404 on edit page load | `useDeliveryPartner` sets error state; page shows loading indefinitely (same as `useCustomer` behavior with invalid ID) |
| Active partners fetch fails for dropdown | Dropdown shows empty list; no blocking error (graceful degradation) |

### 7.5 Request/Response Type Mapping

| Shared Type (from `@shreehari/types`) | Used By |
|----------------------------------------|---------|
| `DeliveryPartnerDto` | List page, form page (edit load), assign modal dropdown |
| `CreateDeliveryPartnerDto` | Form page (create mode submit) |
| `UpdateDeliveryPartnerDto` | Form page (edit mode submit) |
| `AssignDeliveryPartnerDto` | Orders page assign modal submit |
| `OrderDto` (extended with `deliveryPartnerId`, `deliveryPartnerName`) | Orders DataTable, Order Details Modal |
| `ApiResponse<T>` | All API call responses |

---

## 8. Affected Files Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `apps/admin/src/pages/DeliveryPartnersPage.tsx` | **Create** | New list page with DataTable, search, status filter, delete confirmation |
| `apps/admin/src/pages/DeliveryPartnerFormPage.tsx` | **Create** | New create/edit form page with Name, Mobile Number, Active fields |
| `apps/admin/src/pages/OrdersPage.tsx` | **Modify** | Add delivery partner column, "Assign Partner" action, assign modal, partner filter, order details modal addition |
| `apps/admin/src/components/Layout.tsx` | **Modify** | Add "Delivery Partners" nav item with `IconTruck` after "Orders" |
| `apps/admin/src/App.tsx` | **Modify** | Add imports and routes for `DeliveryPartnersPage` and `DeliveryPartnerFormPage` |
| `libs/data-access/src/index.ts` | **Modify** | Add `useDeliveryPartners`, `useDeliveryPartner`, `useCreateDeliveryPartner`, `useUpdateDeliveryPartner`, `useDeleteDeliveryPartner`, `useAssignDeliveryPartner` hooks; extend `useOrders` with `deliveryPartnerId` param; add type imports |
