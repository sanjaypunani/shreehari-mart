# Design Doc: Reorder Feature — Backend

**Status:** No backend changes required
**Date:** 2026-03-19
**Feature PRD:** `docs/prd-reorder-feature.md`
**Scope:** Verification only — documentation of existing contracts relied on by the frontend

---

## Status

No backend changes are required for the Reorder feature. All data the frontend needs is already present in the existing API responses. This document records what was verified and serves as the authoritative backend contract reference for the frontend team.

---

## Verification Summary

The following files were inspected to confirm no backend work is needed:

| File | Finding |
|------|---------|
| `libs/types/src/index.ts` | `OrderItemDto` interface already declares `productId: string` as a required field |
| `apps/api/src/app/controllers/orders.controller.ts` | `mapOrderToDto` already maps `item.productId` to `OrderItemDto.productId` on every order item |
| `apps/api/src/app/routes/orders.routes.ts` | `GET /api/orders` and `GET /api/orders/:id` are registered and active |
| `libs/data-access/src/entities/OrderItem.ts` | `productId` is a persisted `uuid` column on the `order_items` table — it is never null |
| `apps/api/src/app/routes/products.routes.ts` | `GET /api/products/:id` is registered and returns the full product entity |
| `libs/data-access/src/repositories/ProductRepository.ts` | `findById` returns a full `Product` entity including `isAvailable`, `price`, `quantity`, and `unit` |

The `productId` field has been stored on every order item since the initial data model was created. No migration is required.

---

## Existing API Contracts (relied on by frontend)

All base paths are relative to the configured API base URL (default: `http://localhost:3000/api`).

### 1. GET /api/orders

Returns a paginated list of orders for the authenticated session. Each order object in the `data.data` array contains a full `items` array with `productId` on every element.

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page index, default `1` |
| `limit` | number | Page size, default `10` |
| `status` | string | Filter by order status |
| `customerId` | string | Filter by customer |

**Response shape:**

```json
{
  "success": true,
  "data": {
    "data": [ /* OrderDto[] — see shape below */ ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 2. GET /api/orders/:id

Returns a single order by UUID. This is the primary endpoint consumed by the Order Details page where the Reorder button lives.

**Response shape:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerId": "uuid",
    "customerName": "string",
    "customerEmail": "string",
    "customerSociety": "string | undefined",
    "customerMobileNumber": "string | undefined",
    "customerFlatNumber": "string | undefined",
    "deliveryDate": "YYYY-MM-DD | undefined",
    "status": "pending | confirmed | delivered | cancelled",
    "paymentMode": "wallet | monthly | cod",
    "totalAmount": 0,
    "discount": 0,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "items": [ /* OrderItemDto[] — see shape below */ ]
  }
}
```

**OrderItemDto — exact interface** (`libs/types/src/index.ts`):

```typescript
interface OrderItemDto {
  id: string;
  productId: string;          // UUID — the field the frontend reorder logic depends on
  productName: string;        // Display name used in skipped-item notifications
  orderedQuantity: number;    // The quantity as originally ordered (e.g., 500 for 500gm)
  unit: 'gm' | 'kg' | 'pc';  // Unit corresponding to orderedQuantity
  pricePerBaseUnit: number;   // Historical price at order time — do NOT use for reorder pricing
  baseQuantity: number;       // Historical base quantity at order time
  finalPrice: number;         // Historical calculated price — do NOT use for reorder pricing
  // Legacy fields (backward compatibility only)
  quantity: number;
  price: number;
  total: number;
  createdAt: string;          // ISO8601
}
```

### 3. GET /api/products/:id

Called by the frontend once per order item during the reorder flow via `productsApi.getById(productId)`. Returns the current live product data, which the frontend uses for pricing.

**Response shape:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "price": 0,
    "quantity": 0,
    "unit": "gm | kg | pc",
    "description": "string | null",
    "imageUrl": "string | null",
    "isAvailable": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

**Note on product field naming:** The `Product` entity uses `price`, `quantity`, and `unit` — not `basePrice`, `baseQuantity`, and `baseUnit`. The PRD refers to these as `basePrice`/`baseQuantity`/`baseUnit` when describing `CartItem` construction; the frontend must map `product.price → basePrice`, `product.quantity → baseQuantity`, `product.unit → baseUnit` when building the cart item. This is a frontend naming convention for cart items, not a separate field on the API.

**404 response** (product not found or deleted):

```json
{
  "success": false,
  "message": "Product not found"
}
```

The frontend must treat a 404 (or any non-2xx response) from this endpoint as a failed fetch for that item — the item is skipped and the product name is sourced from `orderItem.productName` in the notification.

---

## Integration Points

The following table maps each backend field to its specific role in the frontend reorder logic:

| Backend Field | Endpoint | Used For |
|---------------|----------|----------|
| `OrderItemDto.productId` | `GET /orders` and `GET /orders/:id` | Primary key passed to `productsApi.getById(productId)` to fetch current product data |
| `OrderItemDto.productName` | `GET /orders/:id` | Fallback display name in skip notifications when a product fetch fails |
| `OrderItemDto.orderedQuantity` | `GET /orders/:id` | Mapped to `CartItem.orderedQuantity` — preserves the customer's original quantity intent |
| `OrderItemDto.unit` | `GET /orders/:id` | Mapped to `CartItem.unit` — defines the unit for the reordered quantity |
| `Product.isAvailable` | `GET /products/:id` | If `false`, the item is skipped and the customer is notified |
| `Product.price` | `GET /products/:id` | Current price used as `basePrice` in `calculateItemPrice(...)` — never use `OrderItemDto.finalPrice` |
| `Product.quantity` | `GET /products/:id` | Current base quantity used as `baseQuantity` in `calculateItemPrice(...)` |
| `Product.unit` | `GET /products/:id` | Current base unit used as `baseUnit` in `calculateItemPrice(...)` |
| `Product.name` | `GET /products/:id` | Used as `CartItem.name` when product fetch succeeds |
| `Product.imageUrl` | `GET /products/:id` | Used as `CartItem.image` (defaults to `''` if absent) |

**Critical pricing rule:** The frontend must always derive the displayed cart price from the current product data (`Product.price`, `Product.quantity`, `Product.unit`) via `calculateItemPrice`. The historical `OrderItemDto.finalPrice`, `OrderItemDto.pricePerBaseUnit`, and `OrderItemDto.baseQuantity` fields must not be used for reorder cart construction. These fields exist solely to display what the customer paid in the past.

---

## Non-Changes (Explicitly Out of Scope)

The following changes were considered and deliberately ruled out:

| Item | Decision | Reason |
|------|----------|--------|
| New `POST /api/orders/reorder` endpoint | Not created | The reorder flow is entirely client-side. The backend's `POST /api/orders` endpoint is used at checkout as normal — no new endpoint is needed. |
| Exposing `productId` on `OrderItemDto` | Already present | `productId` is already a column on the `order_items` table and is already mapped in `mapOrderToDto` in `orders.controller.ts`. No controller change is required. |
| Adding `basePrice` / `baseQuantity` / `baseUnit` fields to product response | Not added | The `Product` entity already exposes `price`, `quantity`, and `unit`. The PRD's use of the `base*` naming convention refers to the `CartItem` interface, not to new product API fields. |
| Adding a `GET /api/orders?customerId=X` scope restriction | Not changed | Customer-scoped order filtering already exists via the `customerId` query parameter. The frontend enforces ownership client-side using `auth.user.customerId` vs `order.customerId`. |
| Database migrations | None | No schema changes are required. `productId` has been a non-nullable column on `order_items` since the initial migration. |
| Authentication or authorization changes | None | The reorder action uses the same auth token as all other order-reads. No new scopes or permissions are needed. |
