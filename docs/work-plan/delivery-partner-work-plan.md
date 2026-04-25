# Work Plan: Delivery Partner Module

**Date:** 2026-03-22
**PRD:** `docs/prd/delivery-partner-module.md`
**Backend Design Doc:** `docs/design/delivery-partner-backend-design.md`
**Frontend Design Doc:** `docs/design/delivery-partner-frontend-design.md`

---

## Phase Overview

| Phase | Name | Description |
|-------|------|-------------|
| 1 | Foundation — Entity, Migration, Types | Data layer: entity, migration, shared types, barrel exports |
| 2 | Delivery Partner CRUD — Full Vertical Slice | Backend CRUD API + Admin list/form pages |
| 3 | Order Assignment — Full Vertical Slice | Backend assignment endpoint + Admin orders page modifications |

---

## Phase 1: Foundation — Entity, Migration, Types

**Goal:** Establish the data layer so all subsequent phases have a stable schema and shared types to build on.

**Dependencies:** None (first phase).

### Tasks

#### Task 1 — `delivery-partner-backend-task-1.md`

- **Task ID:** 1
- **Title:** Create DeliveryPartner entity and modify Order entity
- **Layer:** backend
- **Phase:** 1
- **Depends on:** None

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/entities/DeliveryPartner.ts` | Create |
| `libs/data-access/src/entities/Order.ts` | Modify |

**Description:**

Create the `DeliveryPartner` TypeORM entity following the existing entity pattern (see Backend Design Doc Section 3.1):

- `@Entity('delivery_partners')` decorator
- Columns: `id` (uuid PK), `name` (varchar 255), `mobileNumber` (varchar 15), `isActive` (boolean, default true), `createdAt`, `updatedAt`
- `@OneToMany` relation to `Order`

Modify the `Order` entity (Backend Design Doc Section 3.2):

- Add `deliveryPartnerId` column (`uuid`, nullable)
- Add `@ManyToOne` relation to `DeliveryPartner` with `nullable: true`, `onDelete: 'SET NULL'`, `@JoinColumn({ name: 'deliveryPartnerId' })`
- Add virtual getter `deliveryPartnerName` returning `this.deliveryPartner?.name || ''`
- Import `DeliveryPartner` and add `ManyToOne`, `JoinColumn` to typeorm imports if not already present

**Acceptance criteria:**
- `DeliveryPartner.ts` exports a valid TypeORM entity class with all specified columns and the `@OneToMany` relation
- `Order.ts` has the new `deliveryPartnerId` column, `@ManyToOne` relation, and `deliveryPartnerName` virtual getter
- No TypeScript compilation errors in `libs/data-access`

---

#### Task 2 — `delivery-partner-backend-task-2.md`

- **Task ID:** 2
- **Title:** Create database migration for delivery_partners table and orders FK
- **Layer:** backend
- **Phase:** 1
- **Depends on:** Task 1

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/database/migrations/1760100000000-CreateDeliveryPartnerModule.ts` | Create |

**Description:**

Create the migration (Backend Design Doc Section 3.3) that:

1. Creates the `delivery_partners` table with columns: `id` (uuid PK with `gen_random_uuid()` default), `name` (varchar 255), `mobileNumber` (varchar 15), `isActive` (boolean, default true), `createdAt` (timestamp, default now()), `updatedAt` (timestamp, default now())
2. Adds a nullable `deliveryPartnerId` (uuid) column to the `orders` table
3. Creates index `IDX_orders_deliveryPartnerId` on `orders.deliveryPartnerId`
4. Creates FK from `orders.deliveryPartnerId` to `delivery_partners.id` with `ON DELETE SET NULL`, `ON UPDATE CASCADE`

All steps must include idempotency guards (check existence before creating). The `down()` method must reverse in correct dependency order: FK, index, column, table.

Follow the exact pattern from `CreateCategoryAndLinkProduct1760000001000`.

**Acceptance criteria:**
- Migration file follows the naming convention `1760100000000-CreateDeliveryPartnerModule.ts`
- `up()` creates table, adds column, creates index, creates FK — all with idempotency guards
- `down()` drops FK, index, column, table in correct order
- `npm run migration:run` executes without error (when DB is available)

---

#### Task 3 — `delivery-partner-backend-task-3.md`

- **Task ID:** 3
- **Title:** Add shared DeliveryPartner types and extend OrderDto
- **Layer:** backend
- **Phase:** 1
- **Depends on:** None

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/types/src/index.ts` | Modify |

**Description:**

Add the following types to `libs/types/src/index.ts` (Backend Design Doc Section 7.1), placed after the `CategoryDto` block and before the `BillStatus` type alias:

```typescript
// Delivery Partner DTOs
export interface DeliveryPartnerDto {
  id: string;
  name: string;
  mobileNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryPartnerDto {
  name: string;
  mobileNumber: string;
  isActive?: boolean;
}

export interface UpdateDeliveryPartnerDto {
  name?: string;
  mobileNumber?: string;
  isActive?: boolean;
}

export interface AssignDeliveryPartnerDto {
  deliveryPartnerId: string | null;
}
```

Extend the existing `OrderDto` interface with two new optional fields (Backend Design Doc Section 7.2):

```typescript
deliveryPartnerId?: string | null;
deliveryPartnerName?: string | null;
```

**Acceptance criteria:**
- All four new interfaces (`DeliveryPartnerDto`, `CreateDeliveryPartnerDto`, `UpdateDeliveryPartnerDto`, `AssignDeliveryPartnerDto`) are exported from `libs/types/src/index.ts`
- `OrderDto` includes `deliveryPartnerId` and `deliveryPartnerName` optional fields
- No TypeScript compilation errors in `libs/types`

---

#### Task 4 — `delivery-partner-backend-task-4.md`

- **Task ID:** 4
- **Title:** Export DeliveryPartner entity from data-access barrel
- **Layer:** backend
- **Phase:** 1
- **Depends on:** Task 1

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/index.ts` | Modify |

**Description:**

Add a type-only export for the `DeliveryPartner` entity from the data-access barrel file (Backend Design Doc Section 10, file #9):

```typescript
export type { DeliveryPartner } from './entities/DeliveryPartner';
```

Follow the existing pattern where entity type exports are co-located in this single barrel file.

Note: The `DeliveryPartnerRepository` export will be added in Phase 2 (Task 6) after the repository is created.

**Acceptance criteria:**
- `DeliveryPartner` is available as a type import from `@shreehari/data-access`
- Existing exports are not disturbed
- No TypeScript compilation errors

---

### Phase 1 Integration Verification

- Run `npx tsc --noEmit` in `libs/data-access` and `libs/types` to verify no compilation errors
- Run `npm run migration:run` to verify the migration creates the `delivery_partners` table and adds the FK column to `orders`
- Verify entities are queryable: start the API server and confirm no TypeORM entity metadata errors on boot

---

## Phase 2: Delivery Partner CRUD — Full Vertical Slice

**Goal:** Deliver a complete, working Delivery Partners management feature — from API to admin UI — that admins can use to create, view, edit, and delete delivery partners.

**Dependencies:** Phase 1 (all tasks 1-4) must be complete.

### Tasks

#### Task 5 — `delivery-partner-backend-task-5.md`

- **Task ID:** 5
- **Title:** Create DeliveryPartnerRepository
- **Layer:** backend
- **Phase:** 2
- **Depends on:** Task 1, Task 4

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/repositories/DeliveryPartnerRepository.ts` | Create |

**Description:**

Create the `DeliveryPartnerRepository` following the `CategoryRepository` pattern (Backend Design Doc Section 4.1):

- Constructor calls `AppDataSource.getRepository(DeliveryPartner)`
- Methods:
  - `findAll(): Promise<DeliveryPartner[]>` — returns all partners ordered by `name ASC`
  - `findActive(): Promise<DeliveryPartner[]>` — returns only `isActive = true` partners ordered by `name ASC`
  - `findById(id: string): Promise<DeliveryPartner | null>` — returns single partner or null
  - `create(data: { name: string; mobileNumber: string; isActive?: boolean }): Promise<DeliveryPartner>` — creates and saves
  - `update(id: string, data: Partial<Pick<DeliveryPartner, 'name' | 'mobileNumber' | 'isActive'>>): Promise<DeliveryPartner | null>` — updates then returns via `findById`
  - `delete(id: string): Promise<boolean>` — hard-deletes, returns `result.affected! > 0`

**Acceptance criteria:**
- Repository follows `CategoryRepository` constructor and method patterns exactly
- All six methods are implemented with correct return types
- No TypeScript compilation errors

---

#### Task 6 — `delivery-partner-backend-task-6.md`

- **Task ID:** 6
- **Title:** Register DeliveryPartnerRepository in DatabaseService and export from barrel
- **Layer:** backend
- **Phase:** 2
- **Depends on:** Task 5

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/services/DatabaseService.ts` | Modify |
| `libs/data-access/src/index.ts` | Modify |

**Description:**

Modify `DatabaseService` (Backend Design Doc Section 2, Modified Components table):

- Import `DeliveryPartnerRepository`
- Add a private field `private deliveryPartnerRepository!: DeliveryPartnerRepository`
- Initialize it in the constructor (or `initializeRepositories` method, matching existing pattern)
- Add a public getter `getDeliveryPartnerRepository(): DeliveryPartnerRepository` following the existing getter pattern (with `ensureConnection()` call if present)

Export the repository from the barrel file:

```typescript
export { DeliveryPartnerRepository } from './repositories/DeliveryPartnerRepository';
```

**Acceptance criteria:**
- `DatabaseService.getInstance().getDeliveryPartnerRepository()` returns a valid `DeliveryPartnerRepository` instance
- `DeliveryPartnerRepository` is importable from `@shreehari/data-access`
- Existing repository getters are not affected

---

#### Task 7 — `delivery-partner-backend-task-7.md`

- **Task ID:** 7
- **Title:** Create delivery partners controller, routes, and register in server
- **Layer:** backend
- **Phase:** 2
- **Depends on:** Task 3, Task 6

**Target files:**
| File | Change Type |
|------|-------------|
| `apps/api/src/app/controllers/delivery-partners.controller.ts` | Create |
| `apps/api/src/app/routes/delivery-partners.routes.ts` | Create |
| `apps/api/src/app/server.ts` | Modify |

**Description:**

**Controller** (Backend Design Doc Section 5.1): Create `delivery-partners.controller.ts` exporting five handler functions, each wrapped in `asyncHandler`:

- `getAllDeliveryPartners` — accepts `?active=true` query param; calls `repo.findActive()` or `repo.findAll()`; returns `ApiResponse<DeliveryPartnerDto[]>`
- `getDeliveryPartnerById` — returns partner or 404; returns `ApiResponse<DeliveryPartnerDto>`
- `createDeliveryPartner` — validates `name` and `mobileNumber` (required, non-empty after trim); returns 201 with `ApiResponse<DeliveryPartnerDto>`
- `updateDeliveryPartner` — checks existence (404 if not found); validates fields if provided; returns `ApiResponse<DeliveryPartnerDto>`
- `deleteDeliveryPartner` — calls `repo.delete(id)`; returns 404 if not found; returns `{ success: true, message: "Delivery partner deleted" }`

Include `asyncHandler`, `createError`, `logger`, and `mapToDto` helpers following `orders.controller.ts` patterns.

**Routes** (Backend Design Doc Section 6.1): Create `delivery-partners.routes.ts`:

| Method | Path | Handler |
|--------|------|---------|
| `GET` | `/` | `getAllDeliveryPartners` |
| `GET` | `/:id` | `getDeliveryPartnerById` |
| `POST` | `/` | `createDeliveryPartner` |
| `PUT` | `/:id` | `updateDeliveryPartner` |
| `DELETE` | `/:id` | `deleteDeliveryPartner` |

**Server registration** (Backend Design Doc Section 6.3): In `server.ts`:

- Import `deliveryPartnersRouter` from `'./routes/delivery-partners.routes'`
- Add `app.use('/api/delivery-partners', deliveryPartnersRouter)` after the existing monthly-billing line

**Acceptance criteria:**
- All five endpoints respond correctly:
  - `GET /api/delivery-partners` returns 200 with partner list
  - `GET /api/delivery-partners?active=true` returns only active partners
  - `GET /api/delivery-partners/:id` returns 200 or 404
  - `POST /api/delivery-partners` returns 201 on success, 400 on validation error
  - `PUT /api/delivery-partners/:id` returns 200 or 404
  - `DELETE /api/delivery-partners/:id` returns 200 or 404
- API server starts without errors
- No TypeScript compilation errors

---

#### Task 8 — `delivery-partner-frontend-task-1.md`

- **Task ID:** 8
- **Title:** Add delivery partner data-access hooks
- **Layer:** frontend
- **Phase:** 2
- **Depends on:** Task 3 (shared types)

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/index.ts` | Modify |

**Description:**

Add the following hooks to `libs/data-access/src/index.ts` (Frontend Design Doc Sections 3.1-3.6), following the existing `useCustomers`/`useCreateCustomer`/etc. patterns:

1. **Type imports:** Add `DeliveryPartnerDto`, `CreateDeliveryPartnerDto`, `UpdateDeliveryPartnerDto`, `AssignDeliveryPartnerDto` to the import from `@shreehari/types`

2. **`useDeliveryPartners(activeOnly?: boolean)`** — fetches all or active-only partners; returns `{ data, loading, error, refetch }` (Frontend Design Doc Section 3.2)

3. **`useDeliveryPartner(id: string)`** — fetches single partner by ID; returns `{ data, loading, error }` (Frontend Design Doc Section 3.3)

4. **`useCreateDeliveryPartner()`** — mutation hook returning `{ createDeliveryPartner, loading, error }` (Frontend Design Doc Section 3.4)

5. **`useUpdateDeliveryPartner()`** — mutation hook returning `{ updateDeliveryPartner, loading, error }` (Frontend Design Doc Section 3.5)

6. **`useDeleteDeliveryPartner()`** — mutation hook returning `{ deleteDeliveryPartner, loading, error }` (Frontend Design Doc Section 3.6)

All hooks use the shared `apiCall` helper and `API_BASE_URL` constant already defined in the file.

**Acceptance criteria:**
- All six hooks are exported from `libs/data-access/src/index.ts`
- Each hook follows the exact pattern of its corresponding existing hook (e.g., `useDeliveryPartners` matches `useCustomers`)
- No TypeScript compilation errors

---

#### Task 9 — `delivery-partner-frontend-task-2.md`

- **Task ID:** 9
- **Title:** Create DeliveryPartnersPage (list page)
- **Layer:** frontend
- **Phase:** 2
- **Depends on:** Task 8

**Target files:**
| File | Change Type |
|------|-------------|
| `apps/admin/src/pages/DeliveryPartnersPage.tsx` | Create |

**Description:**

Create the `DeliveryPartnersPage` component following the `CustomersPage.tsx` pattern (Frontend Design Doc Section 4.1):

- **PageHeader:** Title "Delivery Partners", subtitle "Manage delivery partners and their availability", "Add Delivery Partner" button with `IconPlus`
- **SearchFilter:** Search by name or mobile number; status filter (Active/Inactive/All)
- **DataTable:** Columns for Name (bold text), Mobile Number, Status (green/gray Badge for Active/Inactive), Actions (Edit navigates to form, Delete opens confirmation modal)
- **ConfirmationModal:** Danger variant, warns that orders will become unassigned
- **Client-side filtering:** Filter partners array by search text and status (no server-side pagination)
- **Error state:** Show red error text with PageHeader
- **Empty state:** "No delivery partners yet. Add one to get started."
- **Delete handler:** Calls `deleteDeliveryPartner`, shows success/error notification, refetches list

Import shared components from `@shreehari/ui`: `DataTable`, `PageHeader`, `ConfirmationModal`, `SearchFilter`, `Column`, `DataTableAction`, `PageHeaderAction`, `FilterOption`.

**Acceptance criteria:**
- Page renders a DataTable with partner data
- Search filters partners by name or mobile number
- Status filter shows active/inactive/all partners
- Edit action navigates to `/delivery-partners/:id/edit`
- Delete action opens confirmation modal and deletes on confirm
- Empty state message shows when no partners exist
- Error state renders correctly
- Component exports as named export `DeliveryPartnersPage`

---

#### Task 10 — `delivery-partner-frontend-task-3.md`

- **Task ID:** 10
- **Title:** Create DeliveryPartnerFormPage (create/edit form)
- **Layer:** frontend
- **Phase:** 2
- **Depends on:** Task 8

**Target files:**
| File | Change Type |
|------|-------------|
| `apps/admin/src/pages/DeliveryPartnerFormPage.tsx` | Create |

**Description:**

Create the `DeliveryPartnerFormPage` component following the `CustomerFormPage.tsx` pattern (Frontend Design Doc Section 4.2):

- **Create/edit mode:** Determined by presence of `:id` route param
- **PageHeader:** "Add Delivery Partner" or "Edit Delivery Partner" with appropriate subtitle
- **Form** (from `@shreehari/ui`): Title "Delivery Partner Details"
  - Grid layout with two columns (md:6 each):
    - Name: TextInput, required
    - Mobile Number: TextInput, required
    - Active: Switch with description "Inactive partners will not appear in order assignment dropdowns"
  - Actions: Cancel (outline, navigates back), Save/Update (brand, submit)
- **Edit mode:** `useDeliveryPartner(id)` loads data, `useEffect` populates form
- **Submit:** Calls `createDeliveryPartner` or `updateDeliveryPartner`, shows notification, navigates to `/delivery-partners`
- **Loading state:** In edit mode, shows "Loading delivery partner..." while fetching
- **Local interface:** `DeliveryPartnerFormData { name: string; mobileNumber: string; isActive: boolean }`

**Acceptance criteria:**
- Form renders in create mode at `/delivery-partners/new` with empty fields and "Save" button
- Form renders in edit mode at `/delivery-partners/:id/edit` with pre-populated fields and "Update" button
- Submit creates or updates partner via API
- Success notification shows and navigates back to list
- Error notification shows on API failure
- Cancel navigates back without saving
- Component exports as named export `DeliveryPartnerFormPage`

---

#### Task 11 — `delivery-partner-frontend-task-4.md`

- **Task ID:** 11
- **Title:** Add delivery partner navigation and routing to admin app
- **Layer:** frontend
- **Phase:** 2
- **Depends on:** Task 9, Task 10

**Target files:**
| File | Change Type |
|------|-------------|
| `apps/admin/src/components/Layout.tsx` | Modify |
| `apps/admin/src/App.tsx` | Modify |

**Description:**

**Layout.tsx** (Frontend Design Doc Section 5.1):

- Import `IconTruck` from `@tabler/icons-react`
- Add a "Delivery Partners" entry to the navigation array after "Orders": `{ icon: IconTruck, label: 'Delivery Partners', href: '/delivery-partners' }`

**App.tsx** (Frontend Design Doc Section 5.2):

- Import `DeliveryPartnersPage` and `DeliveryPartnerFormPage`
- Add three routes inside `<Routes>`, after the orders routes and before products:
  - `<Route path="/delivery-partners" element={<DeliveryPartnersPage />} />`
  - `<Route path="/delivery-partners/new" element={<DeliveryPartnerFormPage />} />`
  - `<Route path="/delivery-partners/:id/edit" element={<DeliveryPartnerFormPage />} />`

**Acceptance criteria:**
- "Delivery Partners" nav item appears in sidebar after "Orders" with truck icon
- Clicking nav item navigates to `/delivery-partners`
- Active state styling applies when on `/delivery-partners` routes
- All three routes render the correct page components
- Existing navigation and routes are not affected

---

### Phase 2 Integration Verification

- Start the API server (`nx serve api`) and admin app (`nx serve admin`)
- Navigate to Delivery Partners in the sidebar
- Create a new delivery partner with name and mobile number — verify it appears in the list
- Edit the partner — verify changes persist after page refresh
- Toggle active status — verify badge updates
- Delete the partner — verify confirmation modal shows and partner is removed
- Verify "Add Delivery Partner" button navigates to form
- Verify empty state message when no partners exist
- Test search filtering by name and mobile number
- Test status filter (Active/Inactive)
- Verify API returns correct responses for all CRUD operations via browser dev tools

---

## Phase 3: Order Assignment — Full Vertical Slice

**Goal:** Enable admins to assign, reassign, and unassign delivery partners on orders, and filter orders by delivery partner.

**Dependencies:** Phase 2 (all tasks 5-11) must be complete.

### Tasks

#### Task 12 — `delivery-partner-backend-task-8.md`

- **Task ID:** 12
- **Title:** Modify OrderRepository for delivery partner support
- **Layer:** backend
- **Phase:** 3
- **Depends on:** Task 1, Task 5

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/repositories/OrderRepository.ts` | Modify |

**Description:**

Apply changes from Backend Design Doc Sections 4.2.1-4.2.4:

1. **Add `deliveryPartner` join to `findAll()`:** Add `.leftJoinAndSelect('order.deliveryPartner', 'deliveryPartner')` to the query builder chain, after the existing joins

2. **Add `deliveryPartnerId` filter to `findAll()`:**
   - Extend the `options` parameter type to include `deliveryPartnerId?: string`
   - Add destructuring for `deliveryPartnerId`
   - Add filter logic: if `'unassigned'`, use `order.deliveryPartnerId IS NULL`; if UUID, use `order.deliveryPartnerId = :deliveryPartnerId`

3. **Add `deliveryPartner` join to `findById()`:** Add `'deliveryPartner'` to the `relations` array

4. **Add `assignDeliveryPartner()` method:** Accepts `orderId: string` and `deliveryPartnerId: string | null`; calls `repository.update(orderId, { deliveryPartnerId })` then returns `this.findById(orderId)`

**Acceptance criteria:**
- `findAll()` joins delivery partner data in results
- `findAll({ deliveryPartnerId: 'some-uuid' })` returns only orders assigned to that partner
- `findAll({ deliveryPartnerId: 'unassigned' })` returns only orders with no partner
- `findById()` includes delivery partner in the returned order
- `assignDeliveryPartner()` updates the order's `deliveryPartnerId` and returns the full order

---

#### Task 13 — `delivery-partner-backend-task-9.md`

- **Task ID:** 13
- **Title:** Add assignDeliveryPartner handler and extend getAllOrders in orders controller and routes
- **Layer:** backend
- **Phase:** 3
- **Depends on:** Task 3, Task 6, Task 12

**Target files:**
| File | Change Type |
|------|-------------|
| `apps/api/src/app/controllers/orders.controller.ts` | Modify |
| `apps/api/src/app/routes/orders.routes.ts` | Modify |

**Description:**

**Controller modifications** (Backend Design Doc Sections 5.2.1-5.2.3):

1. **Extend `mapOrderToDto`:** Add `deliveryPartnerId` and `deliveryPartnerName` to the return object:
   ```
   deliveryPartnerId: order.deliveryPartnerId || null
   deliveryPartnerName: order.deliveryPartnerName || order.deliveryPartner?.name || null
   ```

2. **Extend `getAllOrders`:** Destructure `deliveryPartnerId` from `req.query`; pass it to `orderRepository.findAll()` options (trimmed string or undefined)

3. **Add `assignDeliveryPartner` handler:** Export a new `asyncHandler`-wrapped function that:
   - Extracts `id` from params and `deliveryPartnerId` from body
   - Verifies order exists (404 if not)
   - If `deliveryPartnerId` is not null, verifies the delivery partner exists via `getDeliveryPartnerRepository().findById()` (404 if not found)
   - Calls `orderRepository.assignDeliveryPartner(id, deliveryPartnerId ?? null)`
   - Returns `ApiResponse<OrderDto>` with success message

**Route modification** (Backend Design Doc Section 6.2):

- Import `assignDeliveryPartner` from the controller
- Add `router.patch('/:id/assign-partner', assignDeliveryPartner)` after the existing `PATCH /:id/status` route and before `DELETE /:id`

**Acceptance criteria:**
- `GET /api/orders` responses include `deliveryPartnerId` and `deliveryPartnerName` in each order
- `GET /api/orders?deliveryPartnerId=<uuid>` returns only orders assigned to that partner
- `GET /api/orders?deliveryPartnerId=unassigned` returns only unassigned orders
- `PATCH /api/orders/:id/assign-partner` with `{ "deliveryPartnerId": "<uuid>" }` assigns the partner and returns updated order
- `PATCH /api/orders/:id/assign-partner` with `{ "deliveryPartnerId": null }` unassigns the partner
- 404 returned for non-existent order or delivery partner
- No TypeScript compilation errors

---

#### Task 14 — `delivery-partner-frontend-task-5.md`

- **Task ID:** 14
- **Title:** Add useAssignDeliveryPartner hook and extend useOrders for delivery partner filter
- **Layer:** frontend
- **Phase:** 3
- **Depends on:** Task 8

**Target files:**
| File | Change Type |
|------|-------------|
| `libs/data-access/src/index.ts` | Modify |

**Description:**

1. **Add `useAssignDeliveryPartner` hook** (Frontend Design Doc Section 3.7): Mutation hook following the `useUpdateOrderStatus` pattern. Calls `PATCH /api/orders/:orderId/assign-partner` with `AssignDeliveryPartnerDto` body. Returns `{ assignDeliveryPartner, loading, error }`.

2. **Extend `useOrders` hook** (Frontend Design Doc Section 4.3.4): Add a `deliveryPartnerId?: string` parameter to the function signature. When provided, append `deliveryPartnerId` to the query params. Add it to the `useEffect` dependency array.

**Acceptance criteria:**
- `useAssignDeliveryPartner` is exported and calls the correct API endpoint
- `useOrders` accepts and passes through a `deliveryPartnerId` filter parameter
- No TypeScript compilation errors

---

#### Task 15 — `delivery-partner-frontend-task-6.md`

- **Task ID:** 15
- **Title:** Modify OrdersPage for delivery partner column, assign modal, and partner filter
- **Layer:** frontend
- **Phase:** 3
- **Depends on:** Task 14, Task 8

**Target files:**
| File | Change Type |
|------|-------------|
| `apps/admin/src/pages/OrdersPage.tsx` | Modify |

**Description:**

Apply all changes from Frontend Design Doc Sections 4.3.1-4.3.12:

1. **New imports:** `IconTruck` from `@tabler/icons-react`; `DeliveryPartnerDto` from `@shreehari/types`; `useDeliveryPartners`, `useAssignDeliveryPartner` from `@shreehari/data-access`; `Select` from `@mantine/core` (if not already imported)

2. **New state:** `assignPartnerOpened` (boolean), `selectedPartnerId` (string | null), `assignLoading` (boolean); fetch `activePartners` via `useDeliveryPartners(true)`; instantiate `useAssignDeliveryPartner()`

3. **Extend `filters` state:** Add `deliveryPartnerId: ''`

4. **Extend `useOrders` call:** Pass `filters.deliveryPartnerId || undefined` as the new parameter

5. **Extend `handleClearFilters`:** Reset `deliveryPartnerId` to `''`

6. **Extend filter-change `useEffect`:** Add `filters.deliveryPartnerId` to dependency array

7. **Add "Delivery Partner" column:** After the `status` column, before `paymentMode`; renders partner name or "Unassigned" in dimmed italic

8. **Add "Assign Partner" row action:** `IconTruck`, color `violet`, label "Assign Partner"; positioned after "Update Status" and before "Copy Summary"

9. **Add delivery partner filter:** After the `status` filter in `filterOptions`; options: "Unassigned" + all active partners mapped from `activePartners`

10. **Add `handleAssignPartner` handler:** Opens modal, pre-selects current partner (or `'__none__'`)

11. **Add `handleAssignPartnerSubmit` handler:** Maps `'__none__'` to `null`; calls `assignDeliveryPartner`; closes modal; shows notification; refetches orders

12. **Add Assign Delivery Partner Modal:** After existing Bulk Status Update Modal; contains customer name, current partner display, searchable `Select` with active partners + "None (Unassign)" option, Cancel and Assign buttons

13. **Add delivery partner row to Order Details Modal:** After the "Status" row, show "Delivery Partner: {name}" or "Unassigned" in dimmed text

**Acceptance criteria:**
- "Delivery Partner" column appears in the orders DataTable showing partner name or "Unassigned" (dimmed italic)
- "Assign Partner" action appears in row actions with truck icon
- Clicking "Assign Partner" opens a modal with a searchable dropdown of active partners and a "None (Unassign)" option
- Selecting a partner and clicking "Assign" calls the API and updates the order row
- Selecting "None (Unassign)" removes the assignment
- Delivery partner filter dropdown appears in the filter bar
- Selecting a partner in the filter shows only their orders
- Selecting "Unassigned" in the filter shows only orders without a partner
- Order Details Modal shows the assigned delivery partner
- Success/error notifications display correctly
- Existing OrdersPage functionality (status filter, search, pagination, etc.) is not broken

---

### Phase 3 Integration Verification

- Start the API server and admin app
- Navigate to Orders page — verify "Delivery Partner" column shows "Unassigned" for all orders
- Click "Assign Partner" on an order — verify modal opens with partner dropdown
- Select a partner and click "Assign" — verify the order row updates with the partner name
- Click "Assign Partner" again — verify the modal pre-selects the currently assigned partner
- Select "None (Unassign)" and click "Assign" — verify the order shows "Unassigned" again
- Use the Delivery Partner filter dropdown — verify filtering works for specific partners and "Unassigned"
- Clear filters — verify all orders appear
- Click "View" on an order — verify the Order Details Modal shows the delivery partner
- Delete a delivery partner from the Delivery Partners page — verify their assigned orders now show "Unassigned"
- Deactivate a delivery partner — verify they do not appear in the assign modal dropdown but still appear in the filter (since they may have existing assignments)
- Verify all 10 success criteria from the PRD (Section 7) are met

---

## Task Dependency Graph

```
Phase 1:
  Task 1 (Entity)  ──────────────────────────┐
  Task 2 (Migration) ← Task 1               │
  Task 3 (Types) ─────────────────────────┐  │
  Task 4 (Barrel export) ← Task 1        │  │
                                          │  │
Phase 2:                                  │  │
  Task 5 (Repository) ← Task 1, Task 4   │  │
  Task 6 (DatabaseService + barrel) ← Task 5 │
  Task 7 (Controller/Routes/Server) ← Task 3, Task 6
  Task 8 (Frontend hooks) ← Task 3       │
  Task 9 (List page) ← Task 8            │
  Task 10 (Form page) ← Task 8           │
  Task 11 (Nav + routing) ← Task 9, Task 10
                                          │
Phase 3:                                  │
  Task 12 (OrderRepo mods) ← Task 1, Task 5
  Task 13 (Orders controller/routes) ← Task 3, Task 6, Task 12
  Task 14 (Assign hook + useOrders ext) ← Task 8
  Task 15 (OrdersPage mods) ← Task 14, Task 8
```

## Task Summary

| Task ID | File Name | Title | Layer | Phase | Depends On |
|---------|-----------|-------|-------|-------|------------|
| 1 | `delivery-partner-backend-task-1.md` | Create DeliveryPartner entity and modify Order entity | backend | 1 | None |
| 2 | `delivery-partner-backend-task-2.md` | Create database migration | backend | 1 | 1 |
| 3 | `delivery-partner-backend-task-3.md` | Add shared types and extend OrderDto | backend | 1 | None |
| 4 | `delivery-partner-backend-task-4.md` | Export DeliveryPartner entity from barrel | backend | 1 | 1 |
| 5 | `delivery-partner-backend-task-5.md` | Create DeliveryPartnerRepository | backend | 2 | 1, 4 |
| 6 | `delivery-partner-backend-task-6.md` | Register repository in DatabaseService and barrel | backend | 2 | 5 |
| 7 | `delivery-partner-backend-task-7.md` | Create controller, routes, register in server | backend | 2 | 3, 6 |
| 8 | `delivery-partner-frontend-task-1.md` | Add delivery partner data-access hooks | frontend | 2 | 3 |
| 9 | `delivery-partner-frontend-task-2.md` | Create DeliveryPartnersPage | frontend | 2 | 8 |
| 10 | `delivery-partner-frontend-task-3.md` | Create DeliveryPartnerFormPage | frontend | 2 | 8 |
| 11 | `delivery-partner-frontend-task-4.md` | Add navigation and routing | frontend | 2 | 9, 10 |
| 12 | `delivery-partner-backend-task-8.md` | Modify OrderRepository for delivery partner support | backend | 3 | 1, 5 |
| 13 | `delivery-partner-backend-task-9.md` | Add assignment handler and extend orders controller/routes | backend | 3 | 3, 6, 12 |
| 14 | `delivery-partner-frontend-task-5.md` | Add useAssignDeliveryPartner hook and extend useOrders | frontend | 3 | 8 |
| 15 | `delivery-partner-frontend-task-6.md` | Modify OrdersPage for assignment and filtering | frontend | 3 | 14, 8 |
