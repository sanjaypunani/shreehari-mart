# UI Specification: Delivery Partner Module (Admin Dashboard)

**Status:** Draft
**Date:** 2026-03-22
**Scope:** `apps/admin` — new pages + modifications to OrdersPage and Layout
**Linked PRD:** `docs/prd/delivery-partner-module.md`
**PRD Requirements covered:** FR-AD-1 through FR-AD-16

---

## 1. Page Inventory

| Route | Page Component | File Path | Purpose |
|-------|---------------|-----------|---------|
| `/delivery-partners` | `DeliveryPartnersPage` | `apps/admin/src/pages/DeliveryPartnersPage.tsx` | List all delivery partners with search, status badges, and CRUD actions |
| `/delivery-partners/new` | `DeliveryPartnerFormPage` | `apps/admin/src/pages/DeliveryPartnerFormPage.tsx` | Create a new delivery partner |
| `/delivery-partners/:id/edit` | `DeliveryPartnerFormPage` | `apps/admin/src/pages/DeliveryPartnerFormPage.tsx` | Edit an existing delivery partner |
| `/orders` (modified) | `OrdersPage` | `apps/admin/src/pages/OrdersPage.tsx` | Existing page — add delivery partner column, assign action, partner filter |

---

## 2. Navigation Changes

### 2.1 Sidebar Addition

Add a "Delivery Partners" entry to the `navigation` array in `apps/admin/src/components/Layout.tsx`, positioned directly after "Orders":

```ts
import { IconTruck } from '@tabler/icons-react';

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

**Icon choice:** `IconTruck` from `@tabler/icons-react` — visually represents delivery. The icon is already available in the Tabler icon set used across the admin app.

**Active state:** Uses the same `isActive` pattern: `location.pathname === item.href`. The button uses `variant="filled"` with `color="shreehari-brand"` when active, `variant="subtle"` with `color="gray"` when inactive — identical to all other nav items.

### 2.2 Route Registration

Add routes to `apps/admin/src/App.tsx`:

```tsx
import { DeliveryPartnersPage } from './pages/DeliveryPartnersPage';
import { DeliveryPartnerFormPage } from './pages/DeliveryPartnerFormPage';

// Inside <Routes>:
<Route path="/delivery-partners" element={<DeliveryPartnersPage />} />
<Route path="/delivery-partners/new" element={<DeliveryPartnerFormPage />} />
<Route path="/delivery-partners/:id/edit" element={<DeliveryPartnerFormPage />} />
```

Placement: after the `/orders/analytics` route and before the `/products` route, matching the navigation order.

---

## 3. Delivery Partners List Page (`/delivery-partners`)

### 3.1 Component Hierarchy

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
├── DataTable
│   ├── columns: [Name, Mobile Number, Status, Actions]
│   ├── data: DeliveryPartnerDto[]
│   ├── loading: boolean
│   └── emptyMessage: "No delivery partners yet. Add one to get started."
└── ConfirmationModal
    ├── title: "Delete Delivery Partner"
    ├── message: "Are you sure you want to delete \"{name}\"? Orders assigned to this partner will become unassigned."
    └── variant: "danger"
```

### 3.2 Layout and Structure

Follows the exact same pattern as `CustomersPage`:
- Outer wrapper: `<Stack gap="md">`
- `PageHeader` at top with title, subtitle, and action buttons
- `SearchFilter` below header
- `DataTable` for the list
- `ConfirmationModal` for delete confirmation

### 3.3 DataTable Columns

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

**Column details:**
- **Name:** Plain text, `fw={500}` for medium weight. No avatar (delivery partners are simple entities).
- **Mobile Number:** Plain text, normal weight.
- **Status:** `Badge` from Mantine with `variant="light"`. Green color and "Active" text when `isActive` is `true`; gray color and "Inactive" text when `false`. Matches the existing `isMonthlyPayment` badge pattern in `CustomersPage`.

### 3.4 Row Actions

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
    onClick: handleDeletePartner,
  },
];
```

### 3.5 Search and Filter

**Search:** Filters partners client-side by `name` or `mobileNumber` (case-insensitive substring match). The full partner list is small enough (expected < 100 entries) to filter client-side without server-side pagination.

**Filter options:**

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
```

**Filter change handler and clear handler** (matches `CustomersPage` pattern):

```ts
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

**SearchFilter usage:**

```tsx
<SearchFilter
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  searchPlaceholder="Search delivery partners by name or mobile number..."
  filters={filterOptions}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
/>
```

### 3.6 Header Actions

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

### 3.7 Delete Confirmation

Uses `ConfirmationModal` from `@shreehari/ui` — same pattern as `CustomersPage`:

```tsx
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
```

### 3.8 Empty State

When no delivery partners exist, `DataTable` displays: `"No delivery partners yet. Add one to get started."` via the `emptyMessage` prop.

### 3.9 Error State

Follows the `CustomersPage` error pattern:

```tsx
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
```

### 3.10 State Management

```ts
// Data fetching
const { data: partners, loading, error, refetch } = useDeliveryPartners();
const { deleteDeliveryPartner, loading: deleting } = useDeleteDeliveryPartner();

// Local UI state
const [searchValue, setSearchValue] = useState('');
const [selectedStatus, setSelectedStatus] = useState('');
const [deleteModalOpened, setDeleteModalOpened] = useState(false);
const [selectedPartner, setSelectedPartner] = useState<DeliveryPartnerDto | null>(null);
```

**Note:** No pagination is needed for this page. The delivery partner list is expected to be small (< 100 partners). If the list grows, `PaginationControls` can be added later following the same pattern as `CustomersPage`.

---

## 4. Delivery Partner Form Page (`/delivery-partners/new`, `/delivery-partners/:id/edit`)

### 4.1 Component Hierarchy

```
DeliveryPartnerFormPage
├── PageHeader
│   ├── title: "Add Delivery Partner" | "Edit Delivery Partner"
│   └── subtitle: "Add a new delivery partner" | "Update delivery partner details"
└── Form
    ├── title: "Delivery Partner Details"
    ├── Grid
    │   ├── Grid.Col (span 6) → TextInput: Name (required)
    │   ├── Grid.Col (span 6) → TextInput: Mobile Number (required)
    │   └── Grid.Col (span 6) → Switch: Active
    └── actions: [Cancel, Save/Update]
```

### 4.2 Layout and Structure

Follows the exact same pattern as `CustomerFormPage`:
- Outer wrapper: `<Stack gap="md">`
- `PageHeader` at top with dynamic title based on create/edit mode
- `Form` component from `@shreehari/ui` wrapping all fields
- `Grid` layout for form fields with responsive column spans

### 4.3 Form Data Interface

```ts
interface DeliveryPartnerFormData {
  name: string;
  mobileNumber: string;
  isActive: boolean;
}
```

### 4.4 Form Fields

```tsx
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
          onChange={(event) => updateFormData('name', event.currentTarget.value)}
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
          onChange={(event) => updateFormData('mobileNumber', event.currentTarget.value)}
        />
      </FormField>
    </Grid.Col>

    <Grid.Col span={{ base: 12, md: 6 }}>
      <FormField>
        <Switch
          label="Active"
          description="Inactive partners will not appear in order assignment dropdowns"
          checked={formData.isActive}
          onChange={(event) => updateFormData('isActive', event.currentTarget.checked)}
        />
      </FormField>
    </Grid.Col>
  </Grid>
</Form>
```

### 4.5 Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Name | Required, non-empty after trim | Handled by HTML `required` attribute (native validation) |
| Mobile Number | Required, non-empty after trim | Handled by HTML `required` attribute (native validation) |
| Active | No validation needed (boolean toggle, defaults to `true`) | N/A |

Validation is handled by the HTML `required` attribute on `TextInput` components, consistent with the existing `CustomerFormPage` pattern. Server-side validation errors (400 responses) are shown via Mantine notifications.

### 4.6 Form Actions

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

### 4.7 Create vs Edit Mode Differences

| Aspect | Create Mode | Edit Mode |
|--------|-------------|-----------|
| Route | `/delivery-partners/new` | `/delivery-partners/:id/edit` |
| Page title | "Add Delivery Partner" | "Edit Delivery Partner" |
| Page subtitle | "Add a new delivery partner" | "Update delivery partner details" |
| Initial form data | `{ name: '', mobileNumber: '', isActive: true }` | Loaded from `GET /api/delivery-partners/:id` |
| Submit button label | "Save Delivery Partner" | "Update Delivery Partner" |
| API call | `POST /api/delivery-partners` | `PUT /api/delivery-partners/:id` |
| Loading state | Shows form immediately | Shows "Loading delivery partner..." until data loads |

### 4.8 Submit Handler

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

### 4.9 State Management

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

// Load partner data for editing
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

---

## 5. Orders Page Modifications (`/orders`)

### 5.1 Modified Component Hierarchy

```
OrdersPage (modified)
├── PageHeader                              (unchanged)
├── Bulk Selection Header                   (unchanged)
├── SearchFilter
│   └── filters: [...existing, deliveryPartnerFilter]  ← NEW filter added
├── DataTable
│   └── columns: [...existing, deliveryPartnerColumn]  ← NEW column added
│   └── actions: [...existing, assignPartnerAction]    ← NEW action added
├── PaginationControls                      (unchanged)
├── Order Details Modal                     (unchanged)
├── Status Update Modal                     (unchanged)
├── Bulk Status Update Modal                (unchanged)
└── Assign Delivery Partner Modal           ← NEW modal
```

### 5.2 New "Delivery Partner" Column

Add a new column to the `columns` array, positioned after the "Status" column and before the "Payment" column:

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

**Display behavior:**
- When a partner is assigned: displays the partner's name in normal text style (default color, no italic).
- When no partner is assigned (`null`/`undefined`): displays "Unassigned" in dimmed gray italic text (`c="dimmed"` + `fs="italic"`), providing clear visual distinction.

### 5.3 "Assign Partner" Row Action

Add a new action to the `actions` array, positioned after "Update Status" and before "Copy Summary":

```ts
{
  icon: <IconTruck size={16} />,
  label: 'Assign Partner',
  color: 'violet',
  onClick: handleAssignPartner,
},
```

Uses `IconTruck` from `@tabler/icons-react` with `color="violet"` to visually distinguish it from other actions (blue=View, green=Update Status, teal=Copy, gray=Edit, red=Delete).

### 5.4 Assign Delivery Partner Modal

A new modal that opens when the "Assign Partner" action is clicked:

```tsx
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
          ...activePartners.map((p) => ({
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
        <Button
          onClick={handleAssignPartnerSubmit}
          loading={assignLoading}
        >
          Assign
        </Button>
      </Group>
    </Stack>
  )}
</Modal>
```

**Modal details:**
- **Title:** `"Assign Delivery Partner - #<short-order-id>"` — follows the same pattern as the Status Update Modal.
- **Context info:** Shows customer name and current partner assignment.
- **Select dropdown:** Uses Mantine `Select` with `searchable` enabled. The dropdown is populated with active delivery partners fetched from `GET /api/delivery-partners?active=true`. Each option shows `"Name — Mobile Number"` for easy identification.
- **"None (Unassign)" option:** First item in the dropdown with a sentinel value `"__none__"`. When selected, the API call sends `{ deliveryPartnerId: null }` to unassign.
- **Default selection:** Pre-selects the currently assigned partner (if any), or `"__none__"` if unassigned.
- **Buttons:** Cancel (outline variant) and Assign (filled/default variant). Follows the exact button pattern from the Status Update Modal.

### 5.5 Delivery Partner Filter

Add a new filter option to the `filterOptions` array in OrdersPage, positioned after the "Status" filter:

```ts
{
  key: 'deliveryPartnerId',
  label: 'Delivery Partner',
  type: 'select',
  placeholder: 'All partners',
  options: [
    { value: 'unassigned', label: 'Unassigned' },
    ...activePartners.map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ],
  value: filters.deliveryPartnerId,
},
```

**Filter behavior:**
- "All partners" (empty/cleared): No filter applied — shows all orders regardless of assignment.
- "Unassigned": Passes `deliveryPartnerId=unassigned` query param to `GET /api/orders` — returns only orders with no assigned partner.
- Specific partner: Passes `deliveryPartnerId=<uuid>` query param — returns only orders assigned to that partner.

### 5.6 New State for Orders Page

Add the following state and hooks to `OrdersPage`:

```ts
// New state
const [assignPartnerOpened, setAssignPartnerOpened] = useState(false);
const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
const [assignLoading, setAssignLoading] = useState(false);

// New filter state addition
const [filters, setFilters] = useState({
  status: '',
  paymentMode: '',
  dateFrom: '',
  dateTo: '',
  deliveryPartnerId: '',  // NEW
});

// NOTE: The existing handleClearFilters function must be updated to also reset deliveryPartnerId:
// setFilters({ status: '', paymentMode: '', dateFrom: '', dateTo: '', deliveryPartnerId: '' });

// Fetch active delivery partners (for dropdown and filter)
const { data: activePartners } = useDeliveryPartners(true);  // true = active only
```

### 5.7 Assign Partner Handler

```ts
const handleAssignPartner = (order: OrderDto) => {
  setSelectedOrder(order);
  setSelectedPartnerId(
    order.deliveryPartnerId || '__none__'
  );
  setAssignPartnerOpened(true);
};

const handleAssignPartnerSubmit = async () => {
  if (!selectedOrder) return;

  setAssignLoading(true);
  try {
    const partnerId = selectedPartnerId === '__none__' ? null : selectedPartnerId;
    await assignDeliveryPartner(selectedOrder.id, { deliveryPartnerId: partnerId });
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

### 5.8 Order Details Modal Addition

Add delivery partner info to the Order Details Modal (the "View" modal), after the "Status" row:

```tsx
<Group justify="space-between">
  <Text fw={500}>Delivery Partner:</Text>
  <Text c={selectedOrder.deliveryPartnerName ? undefined : 'dimmed'}>
    {selectedOrder.deliveryPartnerName || 'Unassigned'}
  </Text>
</Group>
```

---

## 6. Data Access Hooks (New)

The following hooks must be created in `libs/data-access` following the existing hook patterns (`useCustomers`, `useCreateCustomer`, etc.):

| Hook | API Call | Return Shape |
|------|----------|-------------|
| `useDeliveryPartners(activeOnly?: boolean)` | `GET /api/delivery-partners` or `GET /api/delivery-partners?active=true` | `{ data: DeliveryPartnerDto[], loading, error, refetch }` |
| `useDeliveryPartner(id: string)` | `GET /api/delivery-partners/:id` | `{ data: DeliveryPartnerDto | null, loading, error }` |
| `useCreateDeliveryPartner()` | `POST /api/delivery-partners` | `{ createDeliveryPartner: (data) => Promise, loading }` |
| `useUpdateDeliveryPartner()` | `PUT /api/delivery-partners/:id` | `{ updateDeliveryPartner: (id, data) => Promise, loading }` |
| `useDeleteDeliveryPartner()` | `DELETE /api/delivery-partners/:id` | `{ deleteDeliveryPartner: (id) => Promise, loading }` |
| `useAssignDeliveryPartner()` | `PATCH /api/orders/:id/assign-partner` | `{ assignDeliveryPartner: (orderId, data) => Promise, loading }` |

These hooks are exported from `libs/data-access/src/index.ts` and imported in admin pages via `@shreehari/data-access`.

---

## 7. Component Props Interfaces

### 7.1 Imports Used Across Pages

All pages use the same set of shared UI component imports from `@shreehari/ui`:

```ts
// DeliveryPartnersPage
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

// DeliveryPartnerFormPage
import {
  Form,
  FormField,
  TextInput,
  PageHeader,
  type FormAction,
} from '@shreehari/ui';
```

### 7.2 Mantine Imports

```ts
// DeliveryPartnersPage
import { Text, Stack, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { DeliveryPartnerDto } from '@shreehari/types';

// DeliveryPartnerFormPage
import { Stack, Grid, Switch } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateDeliveryPartnerDto, UpdateDeliveryPartnerDto } from '@shreehari/types';

// OrdersPage additions
import { IconTruck } from '@tabler/icons-react';
import { DeliveryPartnerDto } from '@shreehari/types';
```

---

## 8. Interaction Flows

### 8.1 Adding a New Delivery Partner

1. Admin clicks "Delivery Partners" in the sidebar navigation.
2. `DeliveryPartnersPage` loads, displaying the partner list (or empty state).
3. Admin clicks the "Add Delivery Partner" button in the page header.
4. Browser navigates to `/delivery-partners/new`.
5. `DeliveryPartnerFormPage` renders in create mode with empty fields and the "Active" toggle defaulting to ON.
6. Admin fills in Name and Mobile Number.
7. Admin clicks "Save Delivery Partner".
8. Form submits via `POST /api/delivery-partners`.
9. On success: notification "Delivery partner created successfully" (green), browser navigates back to `/delivery-partners`.
10. On failure: notification "Failed to create delivery partner" (red), form remains open for correction.

### 8.2 Editing a Delivery Partner

1. On the Delivery Partners list page, admin clicks the "Edit" action (pencil icon) on a partner row.
2. Browser navigates to `/delivery-partners/:id/edit`.
3. `DeliveryPartnerFormPage` renders in edit mode, showing "Loading delivery partner..." until data loads.
4. Form populates with existing partner data.
5. Admin modifies fields as needed (e.g., updates mobile number or toggles active status).
6. Admin clicks "Update Delivery Partner".
7. Form submits via `PUT /api/delivery-partners/:id`.
8. On success: notification "Delivery partner updated successfully" (green), navigates back to `/delivery-partners`.
9. On failure: notification "Failed to update delivery partner" (red).

### 8.3 Deleting a Delivery Partner

1. On the Delivery Partners list page, admin clicks the "Delete" action (trash icon) on a partner row.
2. `ConfirmationModal` opens with message: `Are you sure you want to delete "Ramesh Kumar"? Orders assigned to this partner will become unassigned.`
3. Admin clicks "Delete" to confirm.
4. `DELETE /api/delivery-partners/:id` is called.
5. On success: notification "Delivery partner deleted successfully" (green), list refetches, modal closes.
6. On failure: notification "Failed to delete delivery partner" (red).

### 8.4 Assigning a Partner to an Order

1. On the Orders page, admin sees the "Delivery Partner" column showing partner names or "Unassigned".
2. Admin clicks the "Assign Partner" action (truck icon) on an order row.
3. Modal opens showing order context (customer name, current partner) and a searchable dropdown of active delivery partners.
4. Admin selects a partner from the dropdown.
5. Admin clicks "Assign".
6. `PATCH /api/orders/:id/assign-partner` is called with `{ deliveryPartnerId: "<uuid>" }`.
7. On success: notification "Delivery partner assigned successfully" (green), modal closes, orders list refetches, the row now shows the assigned partner name.
8. On failure: notification "Failed to assign delivery partner" (red).

### 8.5 Reassigning a Partner

1. Same flow as 8.4, but the modal pre-selects the currently assigned partner.
2. Admin selects a different partner from the dropdown.
3. Admin clicks "Assign".
4. API updates the assignment. The row reflects the new partner name after refetch.

### 8.6 Unassigning a Partner

1. Same flow as 8.4, but admin selects "None (Unassign)" from the dropdown.
2. Admin clicks "Assign".
3. `PATCH /api/orders/:id/assign-partner` is called with `{ deliveryPartnerId: null }`.
4. On success: notification "Delivery partner unassigned successfully" (green), row reverts to showing "Unassigned" in dimmed italic text.

### 8.7 Filtering Orders by Delivery Partner

1. On the Orders page, admin locates the "Delivery Partner" filter dropdown in the `SearchFilter` bar.
2. Admin selects a partner name (or "Unassigned").
3. The `deliveryPartnerId` filter value is set, triggering a refetch of `GET /api/orders?deliveryPartnerId=<value>`.
4. DataTable updates to show only matching orders.
5. Admin can clear the filter by selecting the placeholder "All partners" or clicking "Clear Filters".
6. Page resets to 1 when the filter changes.

---

## 9. Error States and Edge Cases

### 9.1 Form Validation Errors

| Scenario | Behavior |
|----------|----------|
| Name field empty on submit | Browser native validation prevents submit (HTML `required`) |
| Mobile Number field empty on submit | Browser native validation prevents submit (HTML `required`) |
| Server returns 400 (validation error) | Red notification: "Failed to create/update delivery partner" |

### 9.2 API Error Handling

All API errors follow the existing codebase pattern using Mantine notifications:

| Scenario | Notification |
|----------|-------------|
| List page fetch fails | Inline `<Text c="red">Error loading delivery partners: {error}</Text>` replaces the table |
| Create/update fails | `{ title: 'Error', message: 'Failed to create/update delivery partner', color: 'red' }` |
| Delete fails | `{ title: 'Error', message: 'Failed to delete delivery partner', color: 'red' }` |
| Assign partner fails | `{ title: 'Error', message: 'Failed to assign delivery partner', color: 'red' }` |
| Active partners fetch fails (for dropdown) | Dropdown shows empty list; no blocking error |

### 9.3 Loading States

| Component | Loading Behavior |
|-----------|-----------------|
| `DeliveryPartnersPage` DataTable | `DataTable` receives `loading={loading}` — shows built-in loading overlay |
| `DeliveryPartnerFormPage` (edit mode) | Shows "Loading delivery partner..." text until data loads (matches `CustomerFormPage` pattern) |
| Form submit buttons | Shows spinner via `loading` prop on the submit `FormAction` |
| Delete confirmation | "Delete" button shows spinner via `loading={deleting}` |
| Assign partner modal | "Assign" button shows spinner via `loading={assignLoading}` |

### 9.4 Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Delivery partner deleted while assign modal is open for that partner | Refetch active partners list; if selected partner no longer exists, API returns 404; show error notification |
| Partner deactivated while assign modal is open | The dropdown only shows active partners; on refetch the deactivated partner disappears. If already selected, the assignment still succeeds (API validates by ID, not active status) |
| Order deleted while assign modal is open | API returns 404; show error notification |
| No active delivery partners exist | Assign modal dropdown shows only "None (Unassign)"; admin can still open the modal but cannot assign anyone |
| Partner with assigned orders is deleted | Database FK `ON DELETE SET NULL` sets `deliveryPartnerId` to null on affected orders; those orders show "Unassigned" on next refetch |
| Navigating to `/delivery-partners/:id/edit` with invalid ID | `useDeliveryPartner` returns null/error; page shows loading state then error notification |

---

## 10. Affected Files Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `apps/admin/src/pages/DeliveryPartnersPage.tsx` | **Create** | New list page for delivery partners |
| `apps/admin/src/pages/DeliveryPartnerFormPage.tsx` | **Create** | New create/edit form page for delivery partners |
| `apps/admin/src/pages/OrdersPage.tsx` | **Modify** | Add delivery partner column, assign action, assign modal, partner filter |
| `apps/admin/src/components/Layout.tsx` | **Modify** | Add "Delivery Partners" nav item with `IconTruck` after "Orders" |
| `apps/admin/src/App.tsx` | **Modify** | Add routes and imports for `DeliveryPartnersPage` and `DeliveryPartnerFormPage` |
| `libs/data-access/src/hooks/useDeliveryPartners.ts` | **Create** | Data fetching hooks for delivery partner CRUD + assignment |
| `libs/data-access/src/index.ts` | **Modify** | Export new delivery partner hooks |
