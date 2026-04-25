# PRD: Delivery Partner Module

**Status:** Draft
**Date:** 2026-03-22
**Project:** shreehari-mart (NX Monorepo)
**Feature Scope:** Backend + Admin Dashboard + Shared Types

---

## 1. Overview & Goals

### 1.1 Problem Statement

Orders in the Shreehari Mart platform currently have no concept of who delivers them. Admins have no way to track which delivery person is handling a given order, making it difficult to manage workloads, handle reassignments when a delivery partner is unavailable, or simply know who is responsible for an order.

### 1.2 Feature Summary

Introduce a Delivery Partner Module that allows admins to:

1. Create and manage delivery partners (name, mobile number, active status).
2. Assign a single delivery partner to any existing order from the Orders page.
3. View and filter orders by assigned delivery partner.
4. Reassign orders to different partners as needed.

### 1.3 Goals

- Provide a simple CRUD interface for managing delivery partners.
- Allow post-creation assignment of one delivery partner per order.
- Give admins clear visibility into which partner handles which order.
- Enable quick reassignment for delays, unavailability, or workload balancing.
- Follow existing codebase patterns (TypeORM entities, Repository pattern, Express routes, Mantine-based admin UI).

### 1.4 Non-Goals

See Section 8 for the complete out-of-scope list.

---

## 2. User Stories

### 2.1 Admin — Delivery Partner Management

| ID | Story | Priority |
|----|-------|----------|
| A-1 | As an admin, I want to add a new delivery partner with their name and mobile number so that they are available for order assignment. | High |
| A-2 | As an admin, I want to view a list of all delivery partners with their active status so that I can see who is available. | High |
| A-3 | As an admin, I want to edit a delivery partner's details (name, mobile number) so that I can keep their information current. | High |
| A-4 | As an admin, I want to toggle a delivery partner's active status so that inactive partners are not shown in assignment dropdowns. | High |
| A-5 | As an admin, I want to delete a delivery partner who is no longer working with us so that the list stays clean. | Medium |

### 2.2 Admin — Order Assignment

| ID | Story | Priority |
|----|-------|----------|
| B-1 | As an admin, I want to assign a delivery partner to an order from the Orders list page so that I know who is handling each delivery. | High |
| B-2 | As an admin, I want to see the assigned delivery partner's name on the Orders list so that I have immediate visibility. | High |
| B-3 | As an admin, I want to reassign an order to a different delivery partner so that I can handle schedule changes or workload issues. | High |
| B-4 | As an admin, I want orders without an assigned partner to show "Unassigned" so that I can quickly identify orders that need attention. | High |
| B-5 | As an admin, I want to filter orders by delivery partner so that I can see all orders assigned to a specific person. | Medium |

---

## 3. Functional Requirements

### 3.1 Backend (`apps/api` + `libs/data-access` + `libs/types`)

#### 3.1.1 Database — DeliveryPartner Entity

- **FR-BE-1:** Create a new `delivery_partners` table with the following columns:

  | Column | Type | Constraints |
  |--------|------|-------------|
  | `id` | `uuid` | Primary key, auto-generated |
  | `name` | `varchar` | Not null |
  | `mobileNumber` | `varchar` | Not null |
  | `isActive` | `boolean` | Not null, default `true` |
  | `createdAt` | `timestamp` | Auto-generated |
  | `updatedAt` | `timestamp` | Auto-updated |

- **FR-BE-2:** Add a nullable `deliveryPartnerId` column of type `uuid` to the `orders` table as a foreign key referencing `delivery_partners.id`. On delete of a delivery partner, set the FK to `NULL` (`SET NULL`).

- **FR-BE-3:** Create a single TypeORM migration that creates the `delivery_partners` table and adds the `deliveryPartnerId` FK column to the `orders` table.

#### 3.1.2 Entity — DeliveryPartner

- **FR-BE-4:** Create a `DeliveryPartner` TypeORM entity class in `libs/data-access/src/entities/DeliveryPartner.ts` following the existing entity pattern (decorators for `@Entity`, `@PrimaryGeneratedColumn('uuid')`, `@Column`, `@CreateDateColumn`, `@UpdateDateColumn`).
- **FR-BE-5:** Add a `@OneToMany` relation from `DeliveryPartner` to `Order`.

#### 3.1.3 Entity — Order Modification

- **FR-BE-6:** Add a `deliveryPartnerId` column (nullable uuid) to the `Order` entity.
- **FR-BE-7:** Add a `@ManyToOne` relation from `Order` to `DeliveryPartner` with a `@JoinColumn` on `deliveryPartnerId`. Set `nullable: true` and `onDelete: 'SET NULL'`.

#### 3.1.4 Repository — DeliveryPartnerRepository

- **FR-BE-8:** Create `DeliveryPartnerRepository` in `libs/data-access/src/repositories/DeliveryPartnerRepository.ts` using the existing repository pattern (`AppDataSource.getRepository()` in the constructor, as used by `CategoryRepository`, `OrderRepository`, etc.).
- **FR-BE-9:** Implement the following methods:
  - `findAll(): Promise<DeliveryPartner[]>` — returns all delivery partners ordered by `name ASC`.
  - `findActive(): Promise<DeliveryPartner[]>` — returns only active (`isActive = true`) partners ordered by `name ASC`.
  - `findById(id: string): Promise<DeliveryPartner | null>` — returns a single partner by ID.
  - `create(data: CreateDeliveryPartnerDto): Promise<DeliveryPartner>` — creates and saves a new partner.
  - `update(id: string, data: UpdateDeliveryPartnerDto): Promise<DeliveryPartner>` — updates an existing partner.
  - `delete(id: string): Promise<void>` — removes a partner by ID.

#### 3.1.5 Repository — OrderRepository Modification

- **FR-BE-10:** Modify the `OrderRepository` to support filtering by `deliveryPartnerId` in the `findAll` method (add optional query parameter).
- **FR-BE-11:** Ensure the Order query joins the `deliveryPartner` relation so that `deliveryPartnerName` is available in responses.

#### 3.1.6 Controller — DeliveryPartnerController

- **FR-BE-12:** Create `delivery-partners.controller.ts` in `apps/api/src/app/controllers/` with handlers:
  - `getAllDeliveryPartners` — returns all partners. Accepts optional `?active=true` query param to return only active partners.
  - `getDeliveryPartnerById` — returns a single partner or 404.
  - `createDeliveryPartner` — validates input, creates partner, returns 201.
  - `updateDeliveryPartner` — validates input, updates partner, returns 200.
  - `deleteDeliveryPartner` — deletes partner, returns 200.

#### 3.1.7 Controller — OrderController Modification

- **FR-BE-13:** Add an `assignDeliveryPartner` handler that accepts `{ deliveryPartnerId: string | null }` in the request body and updates the order's `deliveryPartnerId`. Passing `null` unassigns the partner.
- **FR-BE-14:** Modify `getAllOrders` to accept an optional `deliveryPartnerId` query parameter for filtering.
- **FR-BE-15:** Ensure order responses include `deliveryPartnerId` and `deliveryPartnerName` fields.

#### 3.1.8 API Routes

- **FR-BE-16:** Create `delivery-partners.routes.ts` in `apps/api/src/app/routes/` with:

  | Method | Path | Handler |
  |--------|------|---------|
  | `GET` | `/api/delivery-partners` | `getAllDeliveryPartners` |
  | `GET` | `/api/delivery-partners/:id` | `getDeliveryPartnerById` |
  | `POST` | `/api/delivery-partners` | `createDeliveryPartner` |
  | `PUT` | `/api/delivery-partners/:id` | `updateDeliveryPartner` |
  | `DELETE` | `/api/delivery-partners/:id` | `deleteDeliveryPartner` |

- **FR-BE-17:** Add a new route to `orders.routes.ts`:

  | Method | Path | Handler |
  |--------|------|---------|
  | `PATCH` | `/api/orders/:id/assign-partner` | `assignDeliveryPartner` |

- **FR-BE-18:** Register the delivery partners router in `app.ts` (or equivalent route registration file), following the existing pattern.

#### 3.1.9 Shared Types (`libs/types`)

- **FR-BE-19:** Add the following types to `libs/types/src/index.ts`:

  ```typescript
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

- **FR-BE-20:** Extend `OrderDto` with:

  ```typescript
  deliveryPartnerId?: string | null;
  deliveryPartnerName?: string | null;
  ```

#### 3.1.10 Data-Access Exports

- **FR-BE-21:** Export the `DeliveryPartner` entity (as a type export) from `libs/data-access/src/index.ts`, following the existing pattern where all entity type exports and repository exports are co-located in this single barrel file (there is no separate `entities/index.ts`).
- **FR-BE-22:** Export the `DeliveryPartnerRepository` from `libs/data-access/src/index.ts`.

---

### 3.2 Admin Dashboard (`apps/admin`)

#### 3.2.1 Delivery Partners List Page

- **FR-AD-1:** Create a `DeliveryPartnersPage` at `apps/admin/src/pages/DeliveryPartnersPage.tsx` that displays a `DataTable` (from `@shreehari/ui`) of all delivery partners.
- **FR-AD-2:** Table columns: Name, Mobile Number, Status (active/inactive badge), Actions (edit, delete).
- **FR-AD-3:** Include an "Add Delivery Partner" button that navigates to the form page.
- **FR-AD-4:** The status column should display a colored badge: green for active, gray for inactive.
- **FR-AD-5:** The delete action should show a confirmation modal before deletion.

#### 3.2.2 Delivery Partner Form Page

- **FR-AD-6:** Create a `DeliveryPartnerFormPage` at `apps/admin/src/pages/DeliveryPartnerFormPage.tsx` for both create and edit modes.
- **FR-AD-7:** Form fields: Name (text input, required), Mobile Number (text input, required), Active (toggle switch, default: on).
- **FR-AD-8:** On submit, call the appropriate API (POST for create, PUT for update) and navigate back to the list page on success.
- **FR-AD-9:** Display validation errors inline (name and mobileNumber are required).

#### 3.2.3 Orders Page Modifications

- **FR-AD-10:** Add a "Delivery Partner" column to the orders `DataTable` that displays the assigned partner's name or "Unassigned" text (styled in muted/gray).
- **FR-AD-11:** Add an "Assign Partner" action button (or dropdown) to each order row that opens a modal or inline dropdown listing all active delivery partners.
- **FR-AD-12:** The assignment dropdown must include a "None (Unassign)" option to remove an assignment.
- **FR-AD-13:** On selecting a partner from the dropdown, call `PATCH /api/orders/:id/assign-partner` and update the row optimistically.
- **FR-AD-14:** Add a delivery partner filter dropdown to the Orders page filter bar. Options: "All Partners", each active partner by name, and "Unassigned". Selecting a partner filters orders by `deliveryPartnerId`.

#### 3.2.4 Navigation

- **FR-AD-15:** Add a "Delivery Partners" item to the admin sidebar/navigation, positioned logically near "Orders". Use an appropriate icon (e.g., truck or user icon).

#### 3.2.5 Routing

- **FR-AD-16:** Add routes to the admin app router:
  - `/delivery-partners` — `DeliveryPartnersPage`
  - `/delivery-partners/new` — `DeliveryPartnerFormPage` (create mode)
  - `/delivery-partners/:id/edit` — `DeliveryPartnerFormPage` (edit mode)

---

## 4. Data Model

### 4.1 DeliveryPartner Entity

```
Table: delivery_partners
+------------------+-----------+---------------------------+
| Column           | Type      | Constraints               |
+------------------+-----------+---------------------------+
| id               | uuid      | PK, auto-generated        |
| name             | varchar   | NOT NULL                  |
| mobileNumber     | varchar   | NOT NULL                  |
| isActive         | boolean   | NOT NULL, DEFAULT true    |
| createdAt        | timestamp | auto-generated            |
| updatedAt        | timestamp | auto-updated              |
+------------------+-----------+---------------------------+
```

### 4.2 Order Entity Modification

```
Table: orders (existing — add column)
+---------------------+-----------+------------------------------------+
| Column              | Type      | Constraints                        |
+---------------------+-----------+------------------------------------+
| deliveryPartnerId   | uuid      | NULLABLE, FK -> delivery_partners  |
+---------------------+-----------+------------------------------------+
  ON DELETE SET NULL
```

### 4.3 Relationships

- `DeliveryPartner` 1 --- * `Order` (one partner can have many orders)
- `Order` * --- 0..1 `DeliveryPartner` (each order has at most one partner, nullable)

---

## 5. API Contracts

### 5.1 Delivery Partner Endpoints

#### GET /api/delivery-partners

Returns all delivery partners. Optionally filter by active status.

- **Query params:** `active` (optional, `true` to return only active partners)
- **Response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "name": "Ramesh Kumar",
        "mobileNumber": "9876543210",
        "isActive": true,
        "createdAt": "2026-03-22T10:00:00.000Z",
        "updatedAt": "2026-03-22T10:00:00.000Z"
      }
    ]
  }
  ```

#### GET /api/delivery-partners/:id

Returns a single delivery partner.

- **Response (200):** `ApiResponse<DeliveryPartnerDto>`
- **Response (404):** `{ "success": false, "message": "Delivery partner not found" }`

#### POST /api/delivery-partners

Creates a new delivery partner.

- **Request body:**
  ```json
  {
    "name": "Ramesh Kumar",
    "mobileNumber": "9876543210",
    "isActive": true
  }
  ```
- **Response (201):** `ApiResponse<DeliveryPartnerDto>`
- **Response (400):** Validation errors (name and mobileNumber are required)

#### PUT /api/delivery-partners/:id

Updates an existing delivery partner.

- **Request body:** `UpdateDeliveryPartnerDto` (all fields optional)
- **Response (200):** `ApiResponse<DeliveryPartnerDto>`
- **Response (404):** Partner not found

#### DELETE /api/delivery-partners/:id

Deletes a delivery partner. Orders assigned to this partner will have their `deliveryPartnerId` set to `NULL` via the database FK constraint.

- **Response (200):** `{ "success": true, "message": "Delivery partner deleted" }`
- **Response (404):** Partner not found

### 5.2 Order Assignment Endpoint

#### PATCH /api/orders/:id/assign-partner

Assigns or unassigns a delivery partner to/from an order.

- **Request body:**
  ```json
  {
    "deliveryPartnerId": "uuid-of-partner"
  }
  ```
  To unassign: `{ "deliveryPartnerId": null }`

- **Response (200):** `ApiResponse<OrderDto>` (full order with updated `deliveryPartnerId` and `deliveryPartnerName`)
- **Response (404):** Order not found or delivery partner not found
- **Response (400):** Invalid delivery partner ID

### 5.3 Order List Endpoint Modification

#### GET /api/orders (modified)

- **New query param:** `deliveryPartnerId` (optional uuid) — filters orders by assigned partner. Pass `unassigned` to filter orders with no partner.
- **Response shape change:** Each `OrderDto` in the response now includes `deliveryPartnerId` and `deliveryPartnerName` fields.

---

## 6. UI Requirements

### 6.1 Delivery Partners List Page

- **Layout:** Page header with title "Delivery Partners" and an "Add Delivery Partner" primary button.
- **Table:** DataTable with columns for Name, Mobile Number, Status (badge), and Actions.
- **Empty state:** Message like "No delivery partners yet. Add one to get started."
- **Delete:** Confirmation modal: "Are you sure you want to delete {name}? Orders assigned to this partner will become unassigned."

### 6.2 Delivery Partner Form Page

- **Layout:** Page header with title "Add Delivery Partner" or "Edit Delivery Partner" based on mode.
- **Fields:** Name (text), Mobile Number (text), Active (toggle/switch).
- **Buttons:** Save (primary), Cancel (navigates back).
- **Validation:** Name and Mobile Number are required. Show inline error messages.

### 6.3 Orders Page Modifications

- **New column:** "Delivery Partner" column in the orders DataTable. Shows partner name or "Unassigned" in gray text.
- **Assignment interaction:** Clicking the partner name/unassigned text (or a dedicated assign button) opens a dropdown or modal with a list of active delivery partners and a "None" option.
- **Filter:** A dropdown filter labeled "Delivery Partner" in the filter bar with options: All, each active partner name, and Unassigned.

---

## 7. Success Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| SC-1 | An admin can create, view, edit, and delete delivery partners. | Manual CRUD walkthrough in admin UI. |
| SC-2 | An admin can assign a delivery partner to any order from the Orders page. | Assign a partner; verify the order row updates. |
| SC-3 | An admin can reassign an order to a different partner. | Change assignment; verify update persists after refresh. |
| SC-4 | An admin can unassign a partner from an order. | Select "None"; verify order shows "Unassigned". |
| SC-5 | Orders without an assigned partner display "Unassigned". | Create an order; verify display before assignment. |
| SC-6 | An admin can filter orders by delivery partner. | Select a partner in the filter; verify only their orders appear. |
| SC-7 | Deleting a delivery partner sets affected orders' partner to null. | Delete a partner; verify their orders show "Unassigned". |
| SC-8 | The delivery partners nav item appears in the admin sidebar. | Visual inspection. |
| SC-9 | Only active partners appear in the order assignment dropdown. | Deactivate a partner; verify they do not appear in the dropdown. |
| SC-10 | Migration runs without error on existing database. | Run `npm run migration:run`; verify table and FK created. |

---

## 8. Out of Scope (Phase 1)

- **GPS tracking / live location:** No real-time tracking of delivery partners.
- **Route optimization / complex routing:** No automated route planning or optimization.
- **Vehicle information:** No vehicle type, license plate, or vehicle-related fields.
- **Assignment history / audit log:** No log of past assignments or reassignment history.
- **Automatic assignment:** No algorithmic or rule-based auto-assignment of partners to orders.
- **Delivery partner mobile app integration:** No push notifications or mobile app features for delivery partners (the `order_delivery_manager_app` is separate and not integrated in Phase 1).
- **Multiple partners per order:** Strictly one partner per order.
- **Assignment during order creation:** Partners are assigned only after an order is created.
- **Delivery time slots / scheduling:** No time-slot-based scheduling for delivery partners.
- **Performance metrics / analytics:** No delivery success rate, average delivery time, or partner performance dashboards.
- **Customer-facing visibility:** Customers do not see which delivery partner is assigned to their order.
- **Web storefront changes:** No changes to `apps/web`.

---

## 9. Dependencies

### 9.1 Internal Dependencies

| Dependency | Reason |
|------------|--------|
| `libs/data-access` | New entity, migration, and repository must follow existing patterns |
| `libs/types` | New DTOs and extended `OrderDto` must be added here |
| `libs/ui` | Reuse existing `DataTable`, `Form`, `PageHeader`, `Badge`, `Modal` components |
| `apps/api` | New routes and controller; modifications to order controller and routes |
| `apps/admin` | New pages and modified Orders page |
| Order entity | FK relationship added to existing `orders` table |

### 9.2 External Dependencies

No new external libraries are required. The module uses existing dependencies:
- TypeORM (entity, migration, repository)
- Express.js (routes, controllers)
- Mantine UI (admin components)
- React Router (admin routing)

---

## 10. Affected Files Reference

| File | Change Type | Purpose |
|------|-------------|---------|
| `libs/data-access/src/entities/DeliveryPartner.ts` | Create | New DeliveryPartner entity |
| `libs/data-access/src/entities/Order.ts` | Modify | Add deliveryPartnerId FK and ManyToOne relation |
| `libs/data-access/src/index.ts` | Modify | Add type export for DeliveryPartner entity and export DeliveryPartnerRepository |
| `libs/data-access/src/database/migrations/…CreateDeliveryPartner.ts` | Create | Create delivery_partners table + add FK to orders |
| `libs/data-access/src/repositories/DeliveryPartnerRepository.ts` | Create | CRUD repository for delivery partners |
| `libs/data-access/src/repositories/OrderRepository.ts` | Modify | Add deliveryPartner join and filter support |
| `libs/types/src/index.ts` | Modify | Add DeliveryPartner DTOs; extend OrderDto |
| `apps/api/src/app/controllers/delivery-partners.controller.ts` | Create | Request handlers for delivery partner CRUD |
| `apps/api/src/app/controllers/orders.controller.ts` | Modify | Add assignDeliveryPartner handler; modify getAllOrders for filtering |
| `apps/api/src/app/routes/delivery-partners.routes.ts` | Create | Route definitions for /api/delivery-partners |
| `apps/api/src/app/routes/orders.routes.ts` | Modify | Add PATCH /:id/assign-partner route |
| `apps/api/src/app/app.ts` | Modify | Register delivery-partners router |
| `apps/admin/src/pages/DeliveryPartnersPage.tsx` | Create | List page for delivery partners |
| `apps/admin/src/pages/DeliveryPartnerFormPage.tsx` | Create | Create/edit form page |
| `apps/admin/src/pages/OrdersPage.tsx` | Modify | Add partner column, assign action, partner filter |
| `apps/admin/src/app/App.tsx` | Modify | Add routes for delivery partner pages |
| `apps/admin/src/components/Layout.tsx` (or equivalent) | Modify | Add nav item for Delivery Partners |
| `data-source.ts` | Modify | Add DeliveryPartner entity to entities array (if not auto-discovered) |
