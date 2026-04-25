# Test Skeletons: Delivery Partner Module

**Date:** 2026-03-22
**Linked Design Docs:**
- Backend: `docs/design/delivery-partner-backend-design.md`
- Frontend: `docs/design/delivery-partner-frontend-design.md`
- UI Spec: `docs/ui-spec/delivery-partner-module-ui-spec.md`

---

## 1. Backend Unit Tests

**File:** `apps/api/src/app/__tests__/delivery-partners.spec.ts`

```typescript
/**
 * Unit tests — Delivery Partner Module (Backend)
 *
 * These are skeleton tests. Each `it` block describes exactly one acceptance
 * criterion from the Backend Design Doc. None of the tests are implemented yet;
 * replace every `// TODO: implement` comment with real assertions once the
 * feature branch is ready.
 *
 * Test runner: Jest (via NX preset — see jest.preset.js at monorepo root)
 * HTTP layer:  supertest against the Express app created by `createServer()`
 * Database:    a real PostgreSQL test database seeded in `beforeAll`.
 *              Use a separate DB_NAME (e.g. `shreehari_test`) or a Docker
 *              container so tests do not pollute the development database.
 */

import request from 'supertest';
import { Application } from 'express';

// TODO: import createServer from the app module once routes are wired in
// import { createServer } from '../../server';

// TODO: import DatabaseService and entities for direct DB manipulation
// import { DatabaseService } from '@shreehari/data-access';

// ---------------------------------------------------------------------------
// Helpers / type aliases
// ---------------------------------------------------------------------------

/** Minimal shape returned by POST /api/delivery-partners */
interface CreatedPartner {
  id: string;
  name: string;
  mobileNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Minimal shape returned by POST /api/orders */
interface CreatedOrder {
  id: string;
  deliveryPartnerId: string | null;
  deliveryPartnerName: string | null;
}

// ---------------------------------------------------------------------------
// Suite: Delivery Partner CRUD
// ---------------------------------------------------------------------------

describe('Delivery Partner CRUD — /api/delivery-partners', () => {
  let app: Application;

  // -------------------------------------------------------------------------
  // Suite-level setup
  // -------------------------------------------------------------------------
  beforeAll(async () => {
    // TODO: point AppDataSource / DatabaseService at the test database
    //   e.g. process.env.DB_NAME = 'shreehari_test';
    // TODO: run migrations so delivery_partners table and orders FK exist
    //   e.g. await AppDataSource.initialize(); await AppDataSource.runMigrations();
    // TODO: app = createServer();
  });

  afterAll(async () => {
    // TODO: close the database connection
    //   e.g. await AppDataSource.destroy();
  });

  // -------------------------------------------------------------------------
  // Per-test setup: clear delivery_partners and reset orders FK
  // -------------------------------------------------------------------------
  beforeEach(async () => {
    // TODO: truncate delivery_partners table (SET NULL will cascade to orders)
    // TODO: optionally truncate orders table for a clean slate
  });

  afterEach(async () => {
    // TODO: truncate tables to leave a clean slate
  });

  // =========================================================================
  // CREATE — POST /api/delivery-partners
  // =========================================================================

  describe('POST /api/delivery-partners', () => {
    it('returns 201 and creates a delivery partner with valid data', async () => {
      // Backend Design Doc Section 8.3: successful creation
      //
      // Arrange: prepare valid request body
      //   const body = { name: 'Ramesh Kumar', mobileNumber: '9876543210', isActive: true };
      //
      // Act:
      //   const res = await request(app).post('/api/delivery-partners').send(body);
      //
      // Assert:
      //   expect(res.status).toBe(201);
      //   expect(res.body.success).toBe(true);
      //   expect(res.body.data).toMatchObject({
      //     name: 'Ramesh Kumar',
      //     mobileNumber: '9876543210',
      //     isActive: true,
      //   });
      //   expect(res.body.data.id).toBeDefined();
      //   expect(res.body.data.createdAt).toBeDefined();
      //   expect(res.body.data.updatedAt).toBeDefined();
      //   expect(res.body.message).toBe('Delivery partner created successfully');
      //
      // TODO: implement
    });

    it('defaults isActive to true when not provided in the request body', async () => {
      // Backend Design Doc Section 8.3: isActive defaults to true
      //
      // Arrange:
      //   const body = { name: 'Suresh Patel', mobileNumber: '9876543211' };
      //
      // Act:
      //   const res = await request(app).post('/api/delivery-partners').send(body);
      //
      // Assert:
      //   expect(res.status).toBe(201);
      //   expect(res.body.data.isActive).toBe(true);
      //
      // TODO: implement
    });

    it('returns 400 when name is missing from the request body', async () => {
      // Backend Design Doc Section 5.1: validation — name required
      //
      // Arrange:
      //   const body = { mobileNumber: '9876543210' };
      //
      // Act:
      //   const res = await request(app).post('/api/delivery-partners').send(body);
      //
      // Assert:
      //   expect(res.status).toBe(400);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Name is required');
      //
      // TODO: implement
    });

    it('returns 400 when name is an empty string', async () => {
      // Backend Design Doc Section 5.1: validation — name non-empty after trim
      //
      // Arrange:
      //   const body = { name: '   ', mobileNumber: '9876543210' };
      //
      // Act:
      //   const res = await request(app).post('/api/delivery-partners').send(body);
      //
      // Assert:
      //   expect(res.status).toBe(400);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Name is required');
      //
      // TODO: implement
    });

    it('returns 400 when mobileNumber is missing from the request body', async () => {
      // Backend Design Doc Section 5.1: validation — mobileNumber required
      //
      // Arrange:
      //   const body = { name: 'Ramesh Kumar' };
      //
      // Act:
      //   const res = await request(app).post('/api/delivery-partners').send(body);
      //
      // Assert:
      //   expect(res.status).toBe(400);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Mobile number is required');
      //
      // TODO: implement
    });

    it('returns 400 when mobileNumber is an empty string', async () => {
      // Backend Design Doc Section 5.1: validation — mobileNumber non-empty after trim
      //
      // Arrange:
      //   const body = { name: 'Ramesh Kumar', mobileNumber: '  ' };
      //
      // Act:
      //   const res = await request(app).post('/api/delivery-partners').send(body);
      //
      // Assert:
      //   expect(res.status).toBe(400);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Mobile number is required');
      //
      // TODO: implement
    });

    it('trims whitespace from name and mobileNumber before saving', async () => {
      // Backend Design Doc Section 5.1: name.trim(), mobileNumber.trim()
      //
      // Arrange:
      //   const body = { name: '  Ramesh Kumar  ', mobileNumber: '  9876543210  ' };
      //
      // Act:
      //   const res = await request(app).post('/api/delivery-partners').send(body);
      //
      // Assert:
      //   expect(res.status).toBe(201);
      //   expect(res.body.data.name).toBe('Ramesh Kumar');
      //   expect(res.body.data.mobileNumber).toBe('9876543210');
      //
      // TODO: implement
    });
  });

  // =========================================================================
  // READ ALL — GET /api/delivery-partners
  // =========================================================================

  describe('GET /api/delivery-partners', () => {
    it('returns 200 and all delivery partners ordered by name ASC', async () => {
      // Backend Design Doc Section 4.1 findAll(): returns all partners ordered by name ASC
      //
      // Arrange: seed two partners with names in reverse alphabetical order
      //   await request(app).post('/api/delivery-partners').send({ name: 'Zara', mobileNumber: '111' });
      //   await request(app).post('/api/delivery-partners').send({ name: 'Anil', mobileNumber: '222' });
      //
      // Act:
      //   const res = await request(app).get('/api/delivery-partners');
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.success).toBe(true);
      //   expect(res.body.data).toHaveLength(2);
      //   expect(res.body.data[0].name).toBe('Anil');
      //   expect(res.body.data[1].name).toBe('Zara');
      //
      // TODO: implement
    });

    it('returns an empty array when no delivery partners exist', async () => {
      // Backend Design Doc Section 4.1: empty list scenario
      //
      // Act:
      //   const res = await request(app).get('/api/delivery-partners');
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.success).toBe(true);
      //   expect(res.body.data).toEqual([]);
      //
      // TODO: implement
    });

    it('returns only active partners when ?active=true query param is passed', async () => {
      // Backend Design Doc Section 4.1 findActive(): filter by isActive = true
      //
      // Arrange: seed one active and one inactive partner
      //   await request(app).post('/api/delivery-partners').send({ name: 'Active', mobileNumber: '111', isActive: true });
      //   await request(app).post('/api/delivery-partners').send({ name: 'Inactive', mobileNumber: '222', isActive: false });
      //
      // Act:
      //   const res = await request(app).get('/api/delivery-partners?active=true');
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.data).toHaveLength(1);
      //   expect(res.body.data[0].name).toBe('Active');
      //   expect(res.body.data[0].isActive).toBe(true);
      //
      // TODO: implement
    });

    it('returns all partners (active and inactive) when ?active is not set', async () => {
      // Backend Design Doc Section 5.1: getAllDeliveryPartners without filter
      //
      // Arrange: seed one active and one inactive partner
      //   await request(app).post('/api/delivery-partners').send({ name: 'Active', mobileNumber: '111', isActive: true });
      //   await request(app).post('/api/delivery-partners').send({ name: 'Inactive', mobileNumber: '222', isActive: false });
      //
      // Act:
      //   const res = await request(app).get('/api/delivery-partners');
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.data).toHaveLength(2);
      //
      // TODO: implement
    });
  });

  // =========================================================================
  // READ BY ID — GET /api/delivery-partners/:id
  // =========================================================================

  describe('GET /api/delivery-partners/:id', () => {
    it('returns 200 and the delivery partner when found', async () => {
      // Backend Design Doc Section 8.2: successful lookup
      //
      // Arrange: create a partner
      //   const createRes = await request(app).post('/api/delivery-partners')
      //     .send({ name: 'Ramesh', mobileNumber: '9876543210' });
      //   const partnerId = createRes.body.data.id;
      //
      // Act:
      //   const res = await request(app).get(`/api/delivery-partners/${partnerId}`);
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.success).toBe(true);
      //   expect(res.body.data.id).toBe(partnerId);
      //   expect(res.body.data.name).toBe('Ramesh');
      //
      // TODO: implement
    });

    it('returns 404 when delivery partner ID does not exist', async () => {
      // Backend Design Doc Section 8.2: not found
      //
      // Act:
      //   const res = await request(app).get('/api/delivery-partners/00000000-0000-0000-0000-000000000000');
      //
      // Assert:
      //   expect(res.status).toBe(404);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Delivery partner not found');
      //
      // TODO: implement
    });
  });

  // =========================================================================
  // UPDATE — PUT /api/delivery-partners/:id
  // =========================================================================

  describe('PUT /api/delivery-partners/:id', () => {
    it('returns 200 and the updated partner when valid data is provided', async () => {
      // Backend Design Doc Section 8.4: successful update
      //
      // Arrange: create a partner
      //   const createRes = await request(app).post('/api/delivery-partners')
      //     .send({ name: 'Original', mobileNumber: '1111111111' });
      //   const partnerId = createRes.body.data.id;
      //
      // Act:
      //   const res = await request(app).put(`/api/delivery-partners/${partnerId}`)
      //     .send({ name: 'Updated Name', isActive: false });
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.success).toBe(true);
      //   expect(res.body.data.name).toBe('Updated Name');
      //   expect(res.body.data.isActive).toBe(false);
      //   expect(res.body.data.mobileNumber).toBe('1111111111'); // unchanged
      //   expect(res.body.message).toBe('Delivery partner updated successfully');
      //
      // TODO: implement
    });

    it('allows partial updates (only updating mobileNumber)', async () => {
      // Backend Design Doc Section 5.1: partial update — only provided fields change
      //
      // Arrange: create a partner
      //   const createRes = await request(app).post('/api/delivery-partners')
      //     .send({ name: 'Ramesh', mobileNumber: '1111111111' });
      //   const partnerId = createRes.body.data.id;
      //
      // Act:
      //   const res = await request(app).put(`/api/delivery-partners/${partnerId}`)
      //     .send({ mobileNumber: '9999999999' });
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.data.mobileNumber).toBe('9999999999');
      //   expect(res.body.data.name).toBe('Ramesh'); // unchanged
      //
      // TODO: implement
    });

    it('returns 404 when updating a non-existent delivery partner', async () => {
      // Backend Design Doc Section 8.4: not found
      //
      // Act:
      //   const res = await request(app).put('/api/delivery-partners/00000000-0000-0000-0000-000000000000')
      //     .send({ name: 'Ghost' });
      //
      // Assert:
      //   expect(res.status).toBe(404);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Delivery partner not found');
      //
      // TODO: implement
    });

    it('returns 400 when name is provided as an empty string', async () => {
      // Backend Design Doc Section 5.1: validation — name must not be empty if provided
      //
      // Arrange: create a partner
      //   const createRes = await request(app).post('/api/delivery-partners')
      //     .send({ name: 'Ramesh', mobileNumber: '1111111111' });
      //   const partnerId = createRes.body.data.id;
      //
      // Act:
      //   const res = await request(app).put(`/api/delivery-partners/${partnerId}`)
      //     .send({ name: '' });
      //
      // Assert:
      //   expect(res.status).toBe(400);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Name must not be empty');
      //
      // TODO: implement
    });

    it('returns 400 when mobileNumber is provided as an empty string', async () => {
      // Backend Design Doc Section 5.1: validation — mobileNumber must not be empty if provided
      //
      // Arrange: create a partner
      //   const createRes = await request(app).post('/api/delivery-partners')
      //     .send({ name: 'Ramesh', mobileNumber: '1111111111' });
      //   const partnerId = createRes.body.data.id;
      //
      // Act:
      //   const res = await request(app).put(`/api/delivery-partners/${partnerId}`)
      //     .send({ mobileNumber: '   ' });
      //
      // Assert:
      //   expect(res.status).toBe(400);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Mobile number must not be empty');
      //
      // TODO: implement
    });
  });

  // =========================================================================
  // DELETE — DELETE /api/delivery-partners/:id
  // =========================================================================

  describe('DELETE /api/delivery-partners/:id', () => {
    it('returns 200 and deletes the delivery partner when found', async () => {
      // Backend Design Doc Section 8.5: successful deletion
      //
      // Arrange: create a partner
      //   const createRes = await request(app).post('/api/delivery-partners')
      //     .send({ name: 'ToDelete', mobileNumber: '1111111111' });
      //   const partnerId = createRes.body.data.id;
      //
      // Act:
      //   const res = await request(app).delete(`/api/delivery-partners/${partnerId}`);
      //
      // Assert:
      //   expect(res.status).toBe(200);
      //   expect(res.body.success).toBe(true);
      //   expect(res.body.message).toBe('Delivery partner deleted');
      //
      // Verify: partner no longer exists
      //   const getRes = await request(app).get(`/api/delivery-partners/${partnerId}`);
      //   expect(getRes.status).toBe(404);
      //
      // TODO: implement
    });

    it('returns 404 when deleting a non-existent delivery partner', async () => {
      // Backend Design Doc Section 8.5: not found
      //
      // Act:
      //   const res = await request(app).delete('/api/delivery-partners/00000000-0000-0000-0000-000000000000');
      //
      // Assert:
      //   expect(res.status).toBe(404);
      //   expect(res.body.success).toBe(false);
      //   expect(res.body.message).toBe('Delivery partner not found');
      //
      // TODO: implement
    });

    it('sets deliveryPartnerId to NULL on orders when partner is deleted (ON DELETE SET NULL)', async () => {
      // Backend Design Doc Section 3.2: onDelete: 'SET NULL' FK behavior
      //
      // Arrange:
      //   1. Create a delivery partner
      //   const partnerRes = await request(app).post('/api/delivery-partners')
      //     .send({ name: 'WillBeDeleted', mobileNumber: '1111111111' });
      //   const partnerId = partnerRes.body.data.id;
      //
      //   2. Create an order (via existing order creation flow)
      //   // const orderRes = await createTestOrder(app);
      //   // const orderId = orderRes.body.data.id;
      //
      //   3. Assign the partner to the order
      //   // await request(app).patch(`/api/orders/${orderId}/assign-partner`)
      //   //   .send({ deliveryPartnerId: partnerId });
      //
      // Act: delete the partner
      //   // await request(app).delete(`/api/delivery-partners/${partnerId}`);
      //
      // Assert: order's deliveryPartnerId is now null
      //   // const orderAfter = await request(app).get(`/api/orders/${orderId}`);
      //   // expect(orderAfter.body.data.deliveryPartnerId).toBeNull();
      //   // expect(orderAfter.body.data.deliveryPartnerName).toBeNull();
      //
      // TODO: implement
    });
  });
});

// ---------------------------------------------------------------------------
// Suite: Order Assignment
// ---------------------------------------------------------------------------

describe('Order-DeliveryPartner Assignment — PATCH /api/orders/:id/assign-partner', () => {
  let app: Application;

  beforeAll(async () => {
    // TODO: same database / app setup as CRUD suite
  });

  afterAll(async () => {
    // TODO: close the database connection
  });

  beforeEach(async () => {
    // TODO: truncate delivery_partners and orders tables
    // TODO: seed a known delivery partner and a known order for assignment tests
    //   e.g.:
    //   seedPartner = await createPartnerViaApi('Ramesh', '9876543210');
    //   seedOrder = await createOrderViaApi({ customerId: seedCustomer.id, items: [...] });
  });

  afterEach(async () => {
    // TODO: truncate tables
  });

  // =========================================================================
  // Assign partner to order
  // =========================================================================

  it('returns 200 and assigns a delivery partner to an order', async () => {
    // Backend Design Doc Section 8.6: successful assignment
    //
    // Act:
    //   const res = await request(app)
    //     .patch(`/api/orders/${seedOrder.id}/assign-partner`)
    //     .send({ deliveryPartnerId: seedPartner.id });
    //
    // Assert:
    //   expect(res.status).toBe(200);
    //   expect(res.body.success).toBe(true);
    //   expect(res.body.data.deliveryPartnerId).toBe(seedPartner.id);
    //   expect(res.body.data.deliveryPartnerName).toBe('Ramesh');
    //   expect(res.body.message).toBe('Delivery partner assigned successfully');
    //
    // TODO: implement
  });

  it('returns 404 when the order does not exist', async () => {
    // Backend Design Doc Section 8.6: order not found
    //
    // Act:
    //   const res = await request(app)
    //     .patch('/api/orders/00000000-0000-0000-0000-000000000000/assign-partner')
    //     .send({ deliveryPartnerId: seedPartner.id });
    //
    // Assert:
    //   expect(res.status).toBe(404);
    //   expect(res.body.success).toBe(false);
    //   expect(res.body.message).toBe('Order not found');
    //
    // TODO: implement
  });

  it('returns 404 when the delivery partner does not exist', async () => {
    // Backend Design Doc Section 8.6: partner not found
    //
    // Act:
    //   const res = await request(app)
    //     .patch(`/api/orders/${seedOrder.id}/assign-partner`)
    //     .send({ deliveryPartnerId: '00000000-0000-0000-0000-000000000000' });
    //
    // Assert:
    //   expect(res.status).toBe(404);
    //   expect(res.body.success).toBe(false);
    //   expect(res.body.message).toBe('Delivery partner not found');
    //
    // TODO: implement
  });

  // =========================================================================
  // Reassign partner
  // =========================================================================

  it('reassigns an order from one partner to another', async () => {
    // Backend Design Doc Section 5.2.3: reassignment
    //
    // Arrange:
    //   1. Create a second partner
    //   // const partner2 = await createPartnerViaApi('Suresh', '8888888888');
    //
    //   2. Assign seedPartner first
    //   // await request(app).patch(`/api/orders/${seedOrder.id}/assign-partner`)
    //   //   .send({ deliveryPartnerId: seedPartner.id });
    //
    // Act: reassign to partner2
    //   // const res = await request(app)
    //   //   .patch(`/api/orders/${seedOrder.id}/assign-partner`)
    //   //   .send({ deliveryPartnerId: partner2.id });
    //
    // Assert:
    //   // expect(res.status).toBe(200);
    //   // expect(res.body.data.deliveryPartnerId).toBe(partner2.id);
    //   // expect(res.body.data.deliveryPartnerName).toBe('Suresh');
    //
    // TODO: implement
  });

  // =========================================================================
  // Unassign partner (set to null)
  // =========================================================================

  it('unassigns a delivery partner from an order when deliveryPartnerId is null', async () => {
    // Backend Design Doc Section 8.6: unassign (body: { deliveryPartnerId: null })
    //
    // Arrange: first assign a partner
    //   // await request(app).patch(`/api/orders/${seedOrder.id}/assign-partner`)
    //   //   .send({ deliveryPartnerId: seedPartner.id });
    //
    // Act: unassign
    //   // const res = await request(app)
    //   //   .patch(`/api/orders/${seedOrder.id}/assign-partner`)
    //   //   .send({ deliveryPartnerId: null });
    //
    // Assert:
    //   // expect(res.status).toBe(200);
    //   // expect(res.body.data.deliveryPartnerId).toBeNull();
    //   // expect(res.body.data.deliveryPartnerName).toBeNull();
    //   // expect(res.body.message).toBe('Delivery partner unassigned successfully');
    //
    // TODO: implement
  });

  // =========================================================================
  // Order list includes deliveryPartnerName
  // =========================================================================

  it('includes deliveryPartnerId and deliveryPartnerName in GET /api/orders response', async () => {
    // Backend Design Doc Section 8.7: OrderDto extended fields
    //
    // Arrange: assign a partner to the seed order
    //   // await request(app).patch(`/api/orders/${seedOrder.id}/assign-partner`)
    //   //   .send({ deliveryPartnerId: seedPartner.id });
    //
    // Act:
    //   // const res = await request(app).get('/api/orders');
    //
    // Assert: find the seed order in the paginated list
    //   // const order = res.body.data.find(o => o.id === seedOrder.id);
    //   // expect(order.deliveryPartnerId).toBe(seedPartner.id);
    //   // expect(order.deliveryPartnerName).toBe('Ramesh');
    //
    // TODO: implement
  });

  it('shows deliveryPartnerName as null for unassigned orders in GET /api/orders', async () => {
    // Backend Design Doc Section 5.2.1: mapOrderToDto returns null for unassigned
    //
    // Act: (seed order has no partner assigned)
    //   // const res = await request(app).get('/api/orders');
    //
    // Assert:
    //   // const order = res.body.data.find(o => o.id === seedOrder.id);
    //   // expect(order.deliveryPartnerId).toBeNull();
    //   // expect(order.deliveryPartnerName).toBeNull();
    //
    // TODO: implement
  });

  // =========================================================================
  // Filter orders by deliveryPartnerId
  // =========================================================================

  it('filters orders by specific deliveryPartnerId query param', async () => {
    // Backend Design Doc Section 4.2.2: deliveryPartnerId filter with UUID value
    //
    // Arrange:
    //   1. Assign seedPartner to seedOrder
    //   2. Create another order with no partner
    //
    // Act:
    //   // const res = await request(app)
    //   //   .get(`/api/orders?deliveryPartnerId=${seedPartner.id}`);
    //
    // Assert:
    //   // expect(res.status).toBe(200);
    //   // expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    //   // res.body.data.forEach(order => {
    //   //   expect(order.deliveryPartnerId).toBe(seedPartner.id);
    //   // });
    //
    // TODO: implement
  });

  it('filters orders by deliveryPartnerId=unassigned to return only orders without a partner', async () => {
    // Backend Design Doc Section 4.2.2: 'unassigned' special value
    //
    // Arrange:
    //   1. Assign seedPartner to seedOrder
    //   2. Create another order without a partner
    //
    // Act:
    //   // const res = await request(app)
    //   //   .get('/api/orders?deliveryPartnerId=unassigned');
    //
    // Assert:
    //   // expect(res.status).toBe(200);
    //   // res.body.data.forEach(order => {
    //   //   expect(order.deliveryPartnerId).toBeNull();
    //   // });
    //
    // TODO: implement
  });
});
```

---

## 2. Integration Test Skeleton

**File:** `apps/api/src/app/__tests__/delivery-partners.int.test.ts`

```typescript
/**
 * Integration tests — Delivery Partner Module (Full API Flow)
 *
 * These are skeleton tests that exercise the complete lifecycle:
 * create partner -> create order -> assign -> verify -> reassign -> unassign -> delete.
 *
 * Test runner: Jest (via NX preset — see jest.preset.js at monorepo root)
 * HTTP layer:  supertest against the Express app created by `createServer()`
 * Database:    a real PostgreSQL test database seeded per test.
 *
 * Prerequisites:
 *   - PostgreSQL test database (e.g. shreehari_test) with migrations applied
 *   - All entity tables present (delivery_partners, orders, customers, products, etc.)
 */

import request from 'supertest';
import { Application } from 'express';

// TODO: import createServer from the app module
// import { createServer } from '../../server';

// TODO: import DatabaseService for direct DB access if needed
// import { DatabaseService } from '@shreehari/data-access';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// TODO: implement helper to create a customer + order via API for test setup
// async function createTestOrder(app: Application): Promise<{ orderId: string; customerId: string }> { ... }

// ---------------------------------------------------------------------------
// Suite: Full Delivery Partner Lifecycle
// ---------------------------------------------------------------------------

describe('Delivery Partner Module — Full Integration Flow', () => {
  let app: Application;

  beforeAll(async () => {
    // TODO: initialize test database and create Express app
  });

  afterAll(async () => {
    // TODO: close database connection
  });

  beforeEach(async () => {
    // TODO: truncate delivery_partners, orders (and dependent tables) for clean state
  });

  it('complete lifecycle: create partner -> create order -> assign -> verify -> reassign -> unassign', async () => {
    // This test exercises the full happy path described across multiple sections
    // of the Backend Design Doc (Sections 4, 5, 8).
    //
    // Step 1: Create a delivery partner
    //   const partner1Res = await request(app)
    //     .post('/api/delivery-partners')
    //     .send({ name: 'Ramesh Kumar', mobileNumber: '9876543210' });
    //   expect(partner1Res.status).toBe(201);
    //   const partner1Id = partner1Res.body.data.id;
    //
    // Step 2: Create a second delivery partner
    //   const partner2Res = await request(app)
    //     .post('/api/delivery-partners')
    //     .send({ name: 'Suresh Patel', mobileNumber: '8888888888' });
    //   expect(partner2Res.status).toBe(201);
    //   const partner2Id = partner2Res.body.data.id;
    //
    // Step 3: Create an order (using existing order creation endpoint)
    //   // const { orderId } = await createTestOrder(app);
    //
    // Step 4: Verify order starts with no delivery partner
    //   // const orderBefore = await request(app).get(`/api/orders/${orderId}`);
    //   // expect(orderBefore.body.data.deliveryPartnerId).toBeNull();
    //   // expect(orderBefore.body.data.deliveryPartnerName).toBeNull();
    //
    // Step 5: Assign partner1 to the order
    //   // const assignRes = await request(app)
    //   //   .patch(`/api/orders/${orderId}/assign-partner`)
    //   //   .send({ deliveryPartnerId: partner1Id });
    //   // expect(assignRes.status).toBe(200);
    //   // expect(assignRes.body.data.deliveryPartnerName).toBe('Ramesh Kumar');
    //
    // Step 6: Verify assignment appears in order list
    //   // const listRes = await request(app).get('/api/orders');
    //   // const order = listRes.body.data.find(o => o.id === orderId);
    //   // expect(order.deliveryPartnerId).toBe(partner1Id);
    //
    // Step 7: Reassign to partner2
    //   // const reassignRes = await request(app)
    //   //   .patch(`/api/orders/${orderId}/assign-partner`)
    //   //   .send({ deliveryPartnerId: partner2Id });
    //   // expect(reassignRes.status).toBe(200);
    //   // expect(reassignRes.body.data.deliveryPartnerName).toBe('Suresh Patel');
    //
    // Step 8: Unassign the partner
    //   // const unassignRes = await request(app)
    //   //   .patch(`/api/orders/${orderId}/assign-partner`)
    //   //   .send({ deliveryPartnerId: null });
    //   // expect(unassignRes.status).toBe(200);
    //   // expect(unassignRes.body.data.deliveryPartnerId).toBeNull();
    //   // expect(unassignRes.body.data.deliveryPartnerName).toBeNull();
    //
    // TODO: implement
  });

  it('partner deletion cascades SET NULL to all assigned orders', async () => {
    // Backend Design Doc Section 3.2: ON DELETE SET NULL
    //
    // Arrange:
    //   1. Create a delivery partner
    //   // const partnerRes = await request(app)
    //   //   .post('/api/delivery-partners')
    //   //   .send({ name: 'ToDelete', mobileNumber: '1111111111' });
    //   // const partnerId = partnerRes.body.data.id;
    //
    //   2. Create two orders and assign both to the partner
    //   // const { orderId: order1Id } = await createTestOrder(app);
    //   // const { orderId: order2Id } = await createTestOrder(app);
    //   // await request(app).patch(`/api/orders/${order1Id}/assign-partner`)
    //   //   .send({ deliveryPartnerId: partnerId });
    //   // await request(app).patch(`/api/orders/${order2Id}/assign-partner`)
    //   //   .send({ deliveryPartnerId: partnerId });
    //
    // Act: delete the partner
    //   // const deleteRes = await request(app).delete(`/api/delivery-partners/${partnerId}`);
    //   // expect(deleteRes.status).toBe(200);
    //
    // Assert: both orders now have deliveryPartnerId = null
    //   // const order1After = await request(app).get(`/api/orders/${order1Id}`);
    //   // expect(order1After.body.data.deliveryPartnerId).toBeNull();
    //   // expect(order1After.body.data.deliveryPartnerName).toBeNull();
    //
    //   // const order2After = await request(app).get(`/api/orders/${order2Id}`);
    //   // expect(order2After.body.data.deliveryPartnerId).toBeNull();
    //   // expect(order2After.body.data.deliveryPartnerName).toBeNull();
    //
    // Assert: partner no longer exists
    //   // const partnerAfter = await request(app).get(`/api/delivery-partners/${partnerId}`);
    //   // expect(partnerAfter.status).toBe(404);
    //
    // TODO: implement
  });

  it('active filter works correctly after toggling partner status', async () => {
    // Backend Design Doc Section 4.1: findAll vs findActive
    //
    // Arrange:
    //   1. Create a partner (defaults to active)
    //   // const partnerRes = await request(app)
    //   //   .post('/api/delivery-partners')
    //   //   .send({ name: 'Ramesh', mobileNumber: '9876543210' });
    //   // const partnerId = partnerRes.body.data.id;
    //
    // Act: verify partner appears in active list
    //   // const activeList1 = await request(app).get('/api/delivery-partners?active=true');
    //   // expect(activeList1.body.data).toHaveLength(1);
    //
    // Act: deactivate the partner
    //   // await request(app).put(`/api/delivery-partners/${partnerId}`)
    //   //   .send({ isActive: false });
    //
    // Assert: partner no longer appears in active list
    //   // const activeList2 = await request(app).get('/api/delivery-partners?active=true');
    //   // expect(activeList2.body.data).toHaveLength(0);
    //
    // Assert: partner still appears in full list
    //   // const fullList = await request(app).get('/api/delivery-partners');
    //   // expect(fullList.body.data).toHaveLength(1);
    //
    // TODO: implement
  });
});
```

---

## 3. Frontend Component Test Notes

These are not full test skeletons but document the key interactions that should be tested for each page component. They can serve as a checklist when writing component tests with React Testing Library or Playwright.

### 3.1 DeliveryPartnersPage — Key Interactions to Test

| # | Interaction | What to Assert |
|---|-------------|----------------|
| 1 | Page loads | Fetches `GET /api/delivery-partners`, renders DataTable with partner rows |
| 2 | Empty state | When API returns `[]`, DataTable shows "No delivery partners yet. Add one to get started." |
| 3 | Error state | When API fails, shows red error text "Error loading delivery partners: {error}" instead of table |
| 4 | Click "Add Delivery Partner" button | Navigates to `/delivery-partners/new` |
| 5 | Click "Edit" action on a row | Navigates to `/delivery-partners/:id/edit` |
| 6 | Click "Delete" action on a row | Opens ConfirmationModal with partner name in message |
| 7 | Confirm delete | Calls `DELETE /api/delivery-partners/:id`, shows success notification, refetches list |
| 8 | Cancel delete | Closes modal, no API call made |
| 9 | Delete fails | Shows error notification "Failed to delete delivery partner" |
| 10 | Search by name | Filters displayed rows client-side by name (case-insensitive) |
| 11 | Search by mobile number | Filters displayed rows client-side by mobileNumber |
| 12 | Status filter "Active" | Shows only rows where `isActive === true` |
| 13 | Status filter "Inactive" | Shows only rows where `isActive === false` |
| 14 | Clear filters | Resets search and status filter, shows all partners |
| 15 | Status badge rendering | Active partners show green "Active" badge; inactive show gray "Inactive" badge |

### 3.2 DeliveryPartnerFormPage — Key Interactions to Test

| # | Interaction | What to Assert |
|---|-------------|----------------|
| 1 | Create mode — page title | Shows "Add Delivery Partner" with subtitle "Add a new delivery partner" |
| 2 | Create mode — empty form | Name and Mobile Number are empty; Active switch is ON (checked) |
| 3 | Create mode — submit valid data | Calls `POST /api/delivery-partners`, shows success notification, navigates to `/delivery-partners` |
| 4 | Create mode — submit empty name | Browser native validation prevents submit (HTML `required`) |
| 5 | Create mode — submit empty mobile | Browser native validation prevents submit (HTML `required`) |
| 6 | Create mode — API error | Shows error notification "Failed to create delivery partner", form stays open |
| 7 | Edit mode — page title | Shows "Edit Delivery Partner" with subtitle "Update delivery partner details" |
| 8 | Edit mode — form pre-populated | Fields populated from `GET /api/delivery-partners/:id` response |
| 9 | Edit mode — loading state | Shows "Loading delivery partner..." until data loads |
| 10 | Edit mode — submit valid data | Calls `PUT /api/delivery-partners/:id`, shows success notification, navigates to `/delivery-partners` |
| 11 | Edit mode — API error | Shows error notification "Failed to update delivery partner" |
| 12 | Cancel button | Navigates to `/delivery-partners` without making API call |
| 13 | Submit button label | "Save Delivery Partner" in create mode, "Update Delivery Partner" in edit mode |

### 3.3 OrdersPage Modifications — Key Interactions to Test

| # | Interaction | What to Assert |
|---|-------------|----------------|
| 1 | Delivery Partner column renders | Column header "Delivery Partner" present in DataTable |
| 2 | Assigned order shows partner name | Normal text style with partner name |
| 3 | Unassigned order shows "Unassigned" | Dimmed, italic "Unassigned" text |
| 4 | Click "Assign Partner" action | Opens modal with order context (customer name, current partner) |
| 5 | Modal pre-selects current partner | If order has a partner, the Select dropdown shows that partner |
| 6 | Modal pre-selects "None" for unassigned | If order has no partner, dropdown shows "None (Unassign)" |
| 7 | Select a partner and click "Assign" | Calls `PATCH /api/orders/:id/assign-partner` with partner UUID, shows success notification, refetches |
| 8 | Select "None (Unassign)" and click "Assign" | Calls `PATCH /api/orders/:id/assign-partner` with `null`, shows "unassigned" notification |
| 9 | Assignment API error | Shows error notification "Failed to assign delivery partner" |
| 10 | Cancel assign modal | Closes modal, no API call made |
| 11 | Delivery Partner filter dropdown | Populated with active partners + "Unassigned" option |
| 12 | Filter by specific partner | Passes `deliveryPartnerId=<uuid>` to API, shows filtered results |
| 13 | Filter by "Unassigned" | Passes `deliveryPartnerId=unassigned` to API |
| 14 | Clear delivery partner filter | Resets to "All partners", refetches without filter |
| 15 | Order Details Modal | Shows "Delivery Partner: {name}" or "Delivery Partner: Unassigned" |
| 16 | Searchable dropdown | Partner dropdown is searchable, shows "Name -- Mobile" format |

### 3.4 Navigation — Key Interactions to Test

| # | Interaction | What to Assert |
|---|-------------|----------------|
| 1 | Sidebar shows "Delivery Partners" | Nav item with `IconTruck` visible between "Orders" and "Products" |
| 2 | Click "Delivery Partners" nav item | Navigates to `/delivery-partners` |
| 3 | Active state | "Delivery Partners" nav button uses `variant="filled"` when on `/delivery-partners` route |
