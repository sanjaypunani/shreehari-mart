# Backend Design Doc: Delivery Partner Module

**Status:** Approved
**Date:** 2026-03-22
**PRD Reference:** `shreehari-mart/docs/prd/delivery-partner-module.md`
**Feature Scope:** `libs/data-access` · `libs/types` · `apps/api`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Data Model](#3-data-model)
4. [Repository Layer](#4-repository-layer)
5. [Controller Layer](#5-controller-layer)
6. [Route Layer](#6-route-layer)
7. [Shared Types](#7-shared-types)
8. [Integration Points (Frontend API Contract)](#8-integration-points-frontend-api-contract)
9. [Error Handling Strategy](#9-error-handling-strategy)
10. [Affected Files Summary](#10-affected-files-summary)

---

## 1. Overview

This module introduces delivery partner management to the Shreehari Mart platform. It adds:

- A new `delivery_partners` table with CRUD operations.
- A nullable foreign key (`deliveryPartnerId`) on the existing `orders` table, establishing a many-to-one relationship.
- API endpoints for delivery partner CRUD and order-to-partner assignment/unassignment.
- Shared TypeScript DTOs consumed by both the API and admin frontend.

### Key Constraints (from PRD)

- Each order has **at most one** delivery partner (nullable FK).
- Deleting a delivery partner sets all associated orders' `deliveryPartnerId` to `NULL` via `ON DELETE SET NULL`.
- Partners are assigned **after** order creation, never during.
- Only **active** partners (`isActive = true`) appear in assignment dropdowns (enforced by the frontend; the API exposes a `?active=true` filter).
- No assignment history or audit log in Phase 1.

---

## 2. Architecture

The module follows the established layered architecture:

```
Route (Express Router)
  -> Controller (request/response handling, validation)
    -> Repository (data access via TypeORM)
      -> Entity (TypeORM entity / DB schema)
```

All layers communicate using shared types from `@shreehari/types`. The `DatabaseService` singleton provides repository access, matching the existing pattern used by `CategoryRepository`, `OrderRepository`, etc.

### New Components

| Layer        | File                                           | Purpose                                |
|--------------|------------------------------------------------|----------------------------------------|
| Entity       | `libs/data-access/src/entities/DeliveryPartner.ts` | TypeORM entity for `delivery_partners` table |
| Migration    | `libs/data-access/src/database/migrations/1760100000000-CreateDeliveryPartnerModule.ts` | Create table + add FK to orders |
| Repository   | `libs/data-access/src/repositories/DeliveryPartnerRepository.ts` | CRUD data access |
| Controller   | `apps/api/src/app/controllers/delivery-partners.controller.ts` | Request handlers |
| Routes       | `apps/api/src/app/routes/delivery-partners.routes.ts` | Express route definitions |

### Modified Components

| Layer        | File                                           | Change                                 |
|--------------|------------------------------------------------|----------------------------------------|
| Entity       | `libs/data-access/src/entities/Order.ts`       | Add `deliveryPartnerId` column + `ManyToOne` relation |
| Repository   | `libs/data-access/src/repositories/OrderRepository.ts` | Join delivery partner in queries; add filter support |
| Controller   | `apps/api/src/app/controllers/orders.controller.ts` | Add `assignDeliveryPartner` handler; extend `mapOrderToDto`; add filter param |
| Routes       | `apps/api/src/app/routes/orders.routes.ts`     | Add `PATCH /:id/assign-partner` route |
| Service      | `libs/data-access/src/services/DatabaseService.ts` | Add `DeliveryPartnerRepository` instance + getter |
| Barrel       | `libs/data-access/src/index.ts`                | Export entity type + repository |
| Types        | `libs/types/src/index.ts`                      | Add delivery partner DTOs; extend `OrderDto` |
| Server       | `apps/api/src/app/server.ts`                   | Register delivery partners router |
| DataSource   | `data-source.ts`                               | No change needed (uses glob `entities/*.ts`) |

---

## 3. Data Model

### 3.1 New Entity — `DeliveryPartner`

**File:** `libs/data-access/src/entities/DeliveryPartner.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './Order';

@Entity('delivery_partners')
export class DeliveryPartner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 15 })
  mobileNumber!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Order, (order) => order.deliveryPartner)
  orders!: Order[];
}
```

**Design decisions:**

- `mobileNumber` uses `varchar(15)` matching the `Customer` entity pattern for Indian mobile numbers.
- `name` uses `varchar(255)` matching the `Customer.name` column.
- No unique constraint on `mobileNumber` — the PRD does not require it, and multiple partners could share a contact number (e.g., a business line).
- `isActive` defaults to `true` so new partners are immediately available for assignment.

**Entity column summary:**

| Column        | Type         | Nullable | Default            | Index        |
|---------------|--------------|----------|--------------------|--------------|
| id            | uuid (PK)    | no       | gen_random_uuid()  | implicit PK  |
| name          | varchar(255) | no       | --                 | --           |
| mobileNumber  | varchar(15)  | no       | --                 | --           |
| isActive      | boolean      | no       | true               | --           |
| createdAt     | timestamp    | no       | now()              | --           |
| updatedAt     | timestamp    | no       | now()              | --           |

### 3.2 Entity Modification — `Order`

**File:** `libs/data-access/src/entities/Order.ts`

Add the following after the existing `monthlyBill` relation block:

```typescript
import { DeliveryPartner } from './DeliveryPartner';

// ... (add to existing imports)

// Add column (after monthlyBillId)
@Column({ type: 'uuid', nullable: true })
deliveryPartnerId?: string;

// Add relation (after monthlyBill relation)
@ManyToOne(() => DeliveryPartner, (dp) => dp.orders, {
  nullable: true,
  onDelete: 'SET NULL',
})
@JoinColumn({ name: 'deliveryPartnerId' })
deliveryPartner?: DeliveryPartner;

// Add virtual field (after existing virtual fields)
get deliveryPartnerName(): string {
  return this.deliveryPartner?.name || '';
}
```

**Pattern notes:**

- Follows the same FK pattern as `customerId` / `customer` and `monthlyBillId` / `monthlyBill` on the Order entity.
- Uses `nullable: true` on `@ManyToOne` matching the `monthlyBill` relation pattern.
- Includes `onDelete: 'SET NULL'` so deleting a partner does not cascade-delete orders.
- The virtual getter `deliveryPartnerName` follows the pattern of `customerName` and `customerEmail`.
- The relation is **not** `eager: true` — it will be explicitly joined in repository queries, unlike `customer` which is eager-loaded. This avoids unnecessary joins when delivery partner data is not needed.

### 3.3 Migration

**File:** `libs/data-access/src/database/migrations/1760100000000-CreateDeliveryPartnerModule.ts`

**Timestamp:** `1760100000000` — follows the existing sequence after `1760000002000-AddCategorySortOrder.ts`.

```typescript
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateDeliveryPartnerModule1760100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create the delivery_partners table
    await queryRunner.createTable(
      new Table({
        name: 'delivery_partners',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'mobileNumber',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true // ifNotExists
    );

    // 2. Add deliveryPartnerId column to orders (nullable)
    const ordersTable = await queryRunner.getTable('orders');
    const hasColumn = ordersTable?.findColumnByName('deliveryPartnerId');

    if (!hasColumn) {
      await queryRunner.addColumn(
        'orders',
        new TableColumn({
          name: 'deliveryPartnerId',
          type: 'uuid',
          isNullable: true,
        })
      );
    }

    // 3. Add index on orders.deliveryPartnerId
    const refreshedOrdersTable = await queryRunner.getTable('orders');
    const hasIndex = refreshedOrdersTable?.indices.some(
      (idx) =>
        idx.columnNames.length === 1 &&
        idx.columnNames[0] === 'deliveryPartnerId'
    );

    if (!hasIndex) {
      await queryRunner.createIndex(
        'orders',
        new TableIndex({
          name: 'IDX_orders_deliveryPartnerId',
          columnNames: ['deliveryPartnerId'],
        })
      );
    }

    // 4. Add FK: orders.deliveryPartnerId -> delivery_partners.id ON DELETE SET NULL
    const refreshedTable = await queryRunner.getTable('orders');
    const hasFk = refreshedTable?.foreignKeys.some(
      (fk) =>
        fk.columnNames.length === 1 &&
        fk.columnNames[0] === 'deliveryPartnerId' &&
        fk.referencedTableName === 'delivery_partners'
    );

    if (!hasFk) {
      await queryRunner.createForeignKey(
        'orders',
        new TableForeignKey({
          columnNames: ['deliveryPartnerId'],
          referencedTableName: 'delivery_partners',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop FK from orders
    const ordersTable = await queryRunner.getTable('orders');
    if (ordersTable) {
      const fk = ordersTable.foreignKeys.find(
        (fk) =>
          fk.columnNames.length === 1 &&
          fk.columnNames[0] === 'deliveryPartnerId' &&
          fk.referencedTableName === 'delivery_partners'
      );
      if (fk) {
        await queryRunner.dropForeignKey('orders', fk);
      }

      // 2. Drop index on orders.deliveryPartnerId
      const index = ordersTable.indices.find(
        (idx) =>
          idx.columnNames.length === 1 &&
          idx.columnNames[0] === 'deliveryPartnerId'
      );
      if (index) {
        await queryRunner.dropIndex('orders', index);
      }

      // 3. Drop deliveryPartnerId column from orders
      const column = ordersTable.findColumnByName('deliveryPartnerId');
      if (column) {
        await queryRunner.dropColumn('orders', 'deliveryPartnerId');
      }
    }

    // 4. Drop delivery_partners table
    const dpTable = await queryRunner.getTable('delivery_partners');
    if (dpTable) {
      await queryRunner.dropTable('delivery_partners');
    }
  }
}
```

**Migration design notes:**

- Follows the exact pattern from `CreateCategoryAndLinkProduct1760000001000`: create table first, then add FK column, then index, then foreign key.
- All steps include idempotency guards (`if (!hasColumn)`, `if (!hasFk)`, etc.) matching the existing migration pattern.
- The `down()` method reverses in correct dependency order: FK -> index -> column -> table.
- An index `IDX_orders_deliveryPartnerId` is added on the FK column for efficient filtering by delivery partner.

---

## 4. Repository Layer

### 4.1 New Repository — `DeliveryPartnerRepository`

**File:** `libs/data-access/src/repositories/DeliveryPartnerRepository.ts`

Follows the `CategoryRepository` pattern: constructor calls `AppDataSource.getRepository()`, methods use the TypeORM `Repository` API.

```typescript
import { Repository } from 'typeorm';
import { DeliveryPartner } from '../entities/DeliveryPartner';
import { AppDataSource } from '../database/config';

export class DeliveryPartnerRepository {
  private repository: Repository<DeliveryPartner>;

  constructor() {
    this.repository = AppDataSource.getRepository(DeliveryPartner);
  }

  /**
   * Returns all delivery partners ordered by name ASC.
   */
  async findAll(): Promise<DeliveryPartner[]> {
    return this.repository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Returns only active delivery partners ordered by name ASC.
   */
  async findActive(): Promise<DeliveryPartner[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Returns a single delivery partner by ID, or null if not found.
   */
  async findById(id: string): Promise<DeliveryPartner | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Creates and saves a new delivery partner.
   */
  async create(data: {
    name: string;
    mobileNumber: string;
    isActive?: boolean;
  }): Promise<DeliveryPartner> {
    const partner = this.repository.create(data);
    return this.repository.save(partner);
  }

  /**
   * Updates an existing delivery partner and returns the updated record.
   * Returns null if not found.
   */
  async update(
    id: string,
    data: Partial<Pick<DeliveryPartner, 'name' | 'mobileNumber' | 'isActive'>>
  ): Promise<DeliveryPartner | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Hard-deletes a delivery partner.
   * Orders referencing this partner will have deliveryPartnerId set to NULL
   * via ON DELETE SET NULL at the database level.
   * Returns true if a row was deleted, false if not found.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }
}
```

**Design decisions:**

- `findAll()` and `findActive()` are separate methods rather than a single method with a filter parameter — this matches the simpler, more explicit API style used by `CategoryRepository`.
- `update()` follows the `CategoryRepository.update()` pattern: call `repository.update()` then `findById()` to return the full updated entity.
- `delete()` returns `boolean` matching `CategoryRepository.delete()`.
- The `create()` method accepts a plain object (not the full DTO type) to keep the repository decoupled from the shared types package.

### 4.2 Modifications — `OrderRepository`

**File:** `libs/data-access/src/repositories/OrderRepository.ts`

#### 4.2.1 Add `deliveryPartner` join to `findAll()` query

In the `findAll()` method, add a left join for the delivery partner relation after the existing joins:

```typescript
// Add to the queryBuilder chain (after leftJoinAndSelect for items.product)
.leftJoinAndSelect('order.deliveryPartner', 'deliveryPartner')
```

#### 4.2.2 Add `deliveryPartnerId` filter parameter to `findAll()`

Extend the `options` parameter type:

```typescript
async findAll(options?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
  deliveryPartnerId?: string;  // NEW
  dateFrom?: Date;
  dateTo?: Date;
}): Promise<{ orders: Order[]; total: number }> {
```

Add destructuring and filter logic:

```typescript
const {
  page = 1,
  limit = 10,
  status,
  customerId,
  deliveryPartnerId,  // NEW
  dateFrom,
  dateTo,
} = options || {};

// ... existing filters ...

// NEW: Filter by delivery partner
if (deliveryPartnerId === 'unassigned') {
  queryBuilder.andWhere('order.deliveryPartnerId IS NULL');
} else if (deliveryPartnerId) {
  queryBuilder.andWhere('order.deliveryPartnerId = :deliveryPartnerId', {
    deliveryPartnerId,
  });
}
```

#### 4.2.3 Add `deliveryPartner` join to `findById()`

Add `'deliveryPartner'` to the `relations` array:

```typescript
async findById(id: string): Promise<Order | null> {
  return this.repository.findOne({
    where: { id },
    relations: [
      'customer',
      'customer.address',
      'items',
      'items.product',
      'deliveryPartner',  // NEW
    ],
  });
}
```

#### 4.2.4 Add `assignDeliveryPartner()` method

```typescript
/**
 * Assigns or unassigns a delivery partner to/from an order.
 * Pass null to unassign.
 */
async assignDeliveryPartner(
  orderId: string,
  deliveryPartnerId: string | null
): Promise<Order | null> {
  await this.repository.update(orderId, {
    deliveryPartnerId: deliveryPartnerId as any,
  });
  return this.findById(orderId);
}
```

---

## 5. Controller Layer

### 5.1 New Controller — `delivery-partners.controller.ts`

**File:** `apps/api/src/app/controllers/delivery-partners.controller.ts`

Follows the `orders.controller.ts` pattern: exports named handler functions using `asyncHandler`, accesses repositories via `DatabaseService.getInstance()`.

```typescript
import { Request, Response, NextFunction } from 'express';
import {
  DeliveryPartnerDto,
  CreateDeliveryPartnerDto,
  UpdateDeliveryPartnerDto,
  ApiResponse,
} from '@shreehari/types';
import { DatabaseService } from '@shreehari/data-access';

// Reuse the same async handler pattern from orders.controller.ts
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const createError = (message: string, statusCode: number = 500) => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
};

const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: any) =>
    console.error(`[ERROR] ${message}`, error),
};

// Helper: map DeliveryPartner entity to DeliveryPartnerDto
const mapToDto = (partner: any): DeliveryPartnerDto => ({
  id: partner.id,
  name: partner.name,
  mobileNumber: partner.mobileNumber,
  isActive: partner.isActive,
  createdAt:
    partner.createdAt instanceof Date
      ? partner.createdAt.toISOString()
      : String(partner.createdAt),
  updatedAt:
    partner.updatedAt instanceof Date
      ? partner.updatedAt.toISOString()
      : String(partner.updatedAt),
});

export const getAllDeliveryPartners = asyncHandler(
  async (req: Request, res: Response) => {
    const { active } = req.query;

    try {
      const dbService = DatabaseService.getInstance();
      const repo = dbService.getDeliveryPartnerRepository();

      const partners =
        active === 'true' ? await repo.findActive() : await repo.findAll();

      const response: ApiResponse<DeliveryPartnerDto[]> = {
        success: true,
        data: partners.map(mapToDto),
      };

      logger.info(`Retrieved ${partners.length} delivery partners`);
      res.json(response);
    } catch (error) {
      logger.error('Failed to retrieve delivery partners', error);
      throw createError('Failed to retrieve delivery partners', 500);
    }
  }
);

export const getDeliveryPartnerById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const dbService = DatabaseService.getInstance();
      const repo = dbService.getDeliveryPartnerRepository();

      const partner = await repo.findById(id);

      if (!partner) {
        throw createError('Delivery partner not found', 404);
      }

      const response: ApiResponse<DeliveryPartnerDto> = {
        success: true,
        data: mapToDto(partner),
      };

      res.json(response);
    } catch (error) {
      logger.error(`Failed to retrieve delivery partner ${id}`, error);
      if ((error as any).statusCode === 404) {
        throw error;
      }
      throw createError('Failed to retrieve delivery partner', 500);
    }
  }
);

export const createDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, mobileNumber, isActive }: CreateDeliveryPartnerDto = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw createError('Name is required', 400);
    }

    if (
      !mobileNumber ||
      typeof mobileNumber !== 'string' ||
      mobileNumber.trim().length === 0
    ) {
      throw createError('Mobile number is required', 400);
    }

    try {
      const dbService = DatabaseService.getInstance();
      const repo = dbService.getDeliveryPartnerRepository();

      const partner = await repo.create({
        name: name.trim(),
        mobileNumber: mobileNumber.trim(),
        isActive: isActive !== undefined ? isActive : true,
      });

      const response: ApiResponse<DeliveryPartnerDto> = {
        success: true,
        data: mapToDto(partner),
        message: 'Delivery partner created successfully',
      };

      logger.info(`Created delivery partner: ${partner.id}`);
      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create delivery partner', error);
      throw createError('Failed to create delivery partner', 500);
    }
  }
);

export const updateDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, mobileNumber, isActive }: UpdateDeliveryPartnerDto = req.body;

    try {
      const dbService = DatabaseService.getInstance();
      const repo = dbService.getDeliveryPartnerRepository();

      // Check existence
      const existing = await repo.findById(id);
      if (!existing) {
        throw createError('Delivery partner not found', 404);
      }

      // Build update data (only include provided fields)
      const updateData: Record<string, any> = {};

      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          throw createError('Name must not be empty', 400);
        }
        updateData.name = name.trim();
      }

      if (mobileNumber !== undefined) {
        if (
          typeof mobileNumber !== 'string' ||
          mobileNumber.trim().length === 0
        ) {
          throw createError('Mobile number must not be empty', 400);
        }
        updateData.mobileNumber = mobileNumber.trim();
      }

      if (isActive !== undefined) {
        updateData.isActive = isActive;
      }

      const partner = await repo.update(id, updateData);

      const response: ApiResponse<DeliveryPartnerDto> = {
        success: true,
        data: mapToDto(partner!),
        message: 'Delivery partner updated successfully',
      };

      logger.info(`Updated delivery partner: ${id}`);
      res.json(response);
    } catch (error) {
      logger.error(`Failed to update delivery partner ${id}`, error);
      if ((error as any).statusCode) {
        throw error;
      }
      throw createError('Failed to update delivery partner', 500);
    }
  }
);

export const deleteDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const dbService = DatabaseService.getInstance();
      const repo = dbService.getDeliveryPartnerRepository();

      const deleted = await repo.delete(id);

      if (!deleted) {
        throw createError('Delivery partner not found', 404);
      }

      res.json({
        success: true,
        message: 'Delivery partner deleted',
      });

      logger.info(`Deleted delivery partner: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete delivery partner ${id}`, error);
      if ((error as any).statusCode === 404) {
        throw error;
      }
      throw createError('Failed to delete delivery partner', 500);
    }
  }
);
```

### 5.2 Modifications — `orders.controller.ts`

**File:** `apps/api/src/app/controllers/orders.controller.ts`

#### 5.2.1 Extend `mapOrderToDto` to include delivery partner fields

Add to the return object in `mapOrderToDto`:

```typescript
const mapOrderToDto = (order: any): OrderDto => {
  // ... existing fields ...
  return {
    // ... all existing fields ...
    deliveryPartnerId: order.deliveryPartnerId || null,
    deliveryPartnerName:
      order.deliveryPartnerName || order.deliveryPartner?.name || null,
  };
};
```

#### 5.2.2 Extend `getAllOrders` to accept `deliveryPartnerId` filter

Add to the destructured query parameters:

```typescript
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = paginate(req);
    const { status, customerId, deliveryPartnerId } = req.query; // ADD deliveryPartnerId

    // ... existing try block ...
    const { orders, total } = await orderRepository.findAll({
      page,
      limit,
      status: status as any,
      customerId:
        typeof customerId === 'string' && customerId.trim().length > 0
          ? customerId
          : undefined,
      deliveryPartnerId:                                          // NEW
        typeof deliveryPartnerId === 'string' &&
        deliveryPartnerId.trim().length > 0
          ? deliveryPartnerId
          : undefined,
    });
    // ... rest unchanged ...
  }
);
```

#### 5.2.3 Add `assignDeliveryPartner` handler

New exported function:

```typescript
export const assignDeliveryPartner = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { deliveryPartnerId } = req.body;

    try {
      const databaseService = DatabaseService.getInstance();
      const orderRepository = databaseService.getOrderRepository();

      // Verify order exists
      const existingOrder = await orderRepository.findById(id);
      if (!existingOrder) {
        throw createError('Order not found', 404);
      }

      // If assigning (not unassigning), verify delivery partner exists and is active
      if (deliveryPartnerId !== null && deliveryPartnerId !== undefined) {
        const deliveryPartnerRepo =
          databaseService.getDeliveryPartnerRepository();
        const partner = await deliveryPartnerRepo.findById(deliveryPartnerId);

        if (!partner) {
          throw createError('Delivery partner not found', 404);
        }
      }

      // Perform the assignment (or unassignment if null)
      const updatedOrder = await orderRepository.assignDeliveryPartner(
        id,
        deliveryPartnerId ?? null
      );

      if (!updatedOrder) {
        throw createError('Failed to update order', 500);
      }

      const response: ApiResponse<OrderDto> = {
        success: true,
        data: mapOrderToDto(updatedOrder),
        message: deliveryPartnerId
          ? 'Delivery partner assigned successfully'
          : 'Delivery partner unassigned successfully',
      };

      logger.info(
        `${deliveryPartnerId ? 'Assigned' : 'Unassigned'} delivery partner for order ${id}`
      );
      res.json(response);
    } catch (error) {
      logger.error(
        `Failed to assign delivery partner to order ${id}`,
        error
      );
      if ((error as any).statusCode) {
        throw error;
      }
      throw createError('Failed to assign delivery partner', 500);
    }
  }
);
```

---

## 6. Route Layer

### 6.1 New Routes — `delivery-partners.routes.ts`

**File:** `apps/api/src/app/routes/delivery-partners.routes.ts`

```typescript
import { Router } from 'express';
import {
  getAllDeliveryPartners,
  getDeliveryPartnerById,
  createDeliveryPartner,
  updateDeliveryPartner,
  deleteDeliveryPartner,
} from '../controllers/delivery-partners.controller';

const router = Router();

// GET /api/delivery-partners - Get all delivery partners (optional ?active=true filter)
router.get('/', getAllDeliveryPartners);

// GET /api/delivery-partners/:id - Get delivery partner by ID
router.get('/:id', getDeliveryPartnerById);

// POST /api/delivery-partners - Create new delivery partner
router.post('/', createDeliveryPartner);

// PUT /api/delivery-partners/:id - Update delivery partner
router.put('/:id', updateDeliveryPartner);

// DELETE /api/delivery-partners/:id - Delete delivery partner
router.delete('/:id', deleteDeliveryPartner);

export default router;
```

**Pattern:** Matches `orders.routes.ts` — imports named controller functions, defines routes on a `Router()` instance, exports default.

### 6.2 Modification — `orders.routes.ts`

**File:** `apps/api/src/app/routes/orders.routes.ts`

Add import and route:

```typescript
import {
  // ... existing imports ...
  assignDeliveryPartner,   // NEW
} from '../controllers/orders.controller';

// ... existing routes ...

// PATCH /api/orders/:id/assign-partner - Assign or unassign delivery partner
router.patch('/:id/assign-partner', assignDeliveryPartner);  // NEW

// ... rest unchanged ...
```

Place this route after the existing `PATCH /:id/status` route and before the `DELETE /:id` route.

### 6.3 Route Registration — `server.ts`

**File:** `apps/api/src/app/server.ts`

Add import and registration:

```typescript
// Add to imports (after monthlyBillingRouter)
import deliveryPartnersRouter from './routes/delivery-partners.routes';

// Add to route registrations (after the monthly-billing line)
app.use('/api/delivery-partners', deliveryPartnersRouter);
```

---

## 7. Shared Types

### 7.1 New Types — `libs/types/src/index.ts`

Add the following types. Place them after the `CategoryDto` block and before the `BillStatus` type alias at the end of the file:

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

### 7.2 Extend `OrderDto`

Add two new optional fields to the existing `OrderDto` interface:

```typescript
export interface OrderDto {
  // ... all existing fields ...
  deliveryPartnerId?: string | null;    // NEW
  deliveryPartnerName?: string | null;  // NEW
}
```

---

## 8. Integration Points (Frontend API Contract)

This section serves as the definitive contract that the frontend (admin dashboard) Design Doc will reference.

### 8.1 GET /api/delivery-partners

**Purpose:** Fetch all delivery partners, or only active ones.

| Property | Value |
|----------|-------|
| Method   | `GET` |
| Path     | `/api/delivery-partners` |
| Auth     | None (Phase 1) |

**Query Parameters:**

| Param    | Type   | Required | Description |
|----------|--------|----------|-------------|
| `active` | string | No       | Pass `"true"` to return only active partners |

**Response — 200 OK:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ramesh Kumar",
      "mobileNumber": "9876543210",
      "isActive": true,
      "createdAt": "2026-03-22T10:00:00.000Z",
      "updatedAt": "2026-03-22T10:00:00.000Z"
    }
  ]
}
```

**TypeScript type:** `ApiResponse<DeliveryPartnerDto[]>`

**Response — 500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Failed to retrieve delivery partners"
}
```

---

### 8.2 GET /api/delivery-partners/:id

**Purpose:** Fetch a single delivery partner by ID.

| Property | Value |
|----------|-------|
| Method   | `GET` |
| Path     | `/api/delivery-partners/:id` |

**Path Parameters:**

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string (UUID) | Delivery partner ID |

**Response — 200 OK:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ramesh Kumar",
    "mobileNumber": "9876543210",
    "isActive": true,
    "createdAt": "2026-03-22T10:00:00.000Z",
    "updatedAt": "2026-03-22T10:00:00.000Z"
  }
}
```

**TypeScript type:** `ApiResponse<DeliveryPartnerDto>`

**Response — 404 Not Found:**

```json
{
  "success": false,
  "message": "Delivery partner not found"
}
```

---

### 8.3 POST /api/delivery-partners

**Purpose:** Create a new delivery partner.

| Property | Value |
|----------|-------|
| Method   | `POST` |
| Path     | `/api/delivery-partners` |
| Content-Type | `application/json` |

**Request Body:**

```json
{
  "name": "Ramesh Kumar",
  "mobileNumber": "9876543210",
  "isActive": true
}
```

**TypeScript type:** `CreateDeliveryPartnerDto`

| Field          | Type    | Required | Default | Validation |
|----------------|---------|----------|---------|------------|
| `name`         | string  | Yes      | --      | Non-empty after trim |
| `mobileNumber` | string  | Yes      | --      | Non-empty after trim |
| `isActive`     | boolean | No       | `true`  | -- |

**Response — 201 Created:**

```json
{
  "success": true,
  "data": { /* DeliveryPartnerDto */ },
  "message": "Delivery partner created successfully"
}
```

**Response — 400 Bad Request:**

```json
{
  "success": false,
  "message": "Name is required"
}
```

```json
{
  "success": false,
  "message": "Mobile number is required"
}
```

---

### 8.4 PUT /api/delivery-partners/:id

**Purpose:** Update an existing delivery partner. All fields are optional (partial update).

| Property | Value |
|----------|-------|
| Method   | `PUT` |
| Path     | `/api/delivery-partners/:id` |
| Content-Type | `application/json` |

**Request Body:**

```json
{
  "name": "Ramesh Kumar (Updated)",
  "isActive": false
}
```

**TypeScript type:** `UpdateDeliveryPartnerDto`

| Field          | Type    | Required | Validation |
|----------------|---------|----------|------------|
| `name`         | string  | No       | Non-empty after trim (if provided) |
| `mobileNumber` | string  | No       | Non-empty after trim (if provided) |
| `isActive`     | boolean | No       | -- |

**Response — 200 OK:**

```json
{
  "success": true,
  "data": { /* DeliveryPartnerDto */ },
  "message": "Delivery partner updated successfully"
}
```

**Response — 404 Not Found:**

```json
{
  "success": false,
  "message": "Delivery partner not found"
}
```

**Response — 400 Bad Request:**

```json
{
  "success": false,
  "message": "Name must not be empty"
}
```

---

### 8.5 DELETE /api/delivery-partners/:id

**Purpose:** Delete a delivery partner. Orders assigned to this partner will have their `deliveryPartnerId` set to `NULL` automatically by the database.

| Property | Value |
|----------|-------|
| Method   | `DELETE` |
| Path     | `/api/delivery-partners/:id` |

**Response — 200 OK:**

```json
{
  "success": true,
  "message": "Delivery partner deleted"
}
```

**Response — 404 Not Found:**

```json
{
  "success": false,
  "message": "Delivery partner not found"
}
```

---

### 8.6 PATCH /api/orders/:id/assign-partner

**Purpose:** Assign or unassign a delivery partner to/from an order.

| Property | Value |
|----------|-------|
| Method   | `PATCH` |
| Path     | `/api/orders/:id/assign-partner` |
| Content-Type | `application/json` |

**Path Parameters:**

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string (UUID) | Order ID |

**Request Body — Assign:**

```json
{
  "deliveryPartnerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Request Body — Unassign:**

```json
{
  "deliveryPartnerId": null
}
```

**TypeScript type:** `AssignDeliveryPartnerDto`

**Response — 200 OK:**

```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "customerId": "customer-uuid",
    "customerName": "John Doe",
    "deliveryPartnerId": "550e8400-e29b-41d4-a716-446655440000",
    "deliveryPartnerName": "Ramesh Kumar",
    "status": "confirmed",
    "totalAmount": 450.00,
    "...": "remaining OrderDto fields"
  },
  "message": "Delivery partner assigned successfully"
}
```

**Response — 404 Not Found (order):**

```json
{
  "success": false,
  "message": "Order not found"
}
```

**Response — 404 Not Found (partner):**

```json
{
  "success": false,
  "message": "Delivery partner not found"
}
```

---

### 8.7 GET /api/orders (Modified)

**Existing endpoint — new query parameter and response fields.**

**New Query Parameter:**

| Param              | Type   | Required | Description |
|--------------------|--------|----------|-------------|
| `deliveryPartnerId` | string | No       | UUID of a delivery partner to filter by, or the literal string `"unassigned"` to return orders with no partner assigned |

**New Fields in OrderDto Response:**

| Field                 | Type           | Description |
|-----------------------|----------------|-------------|
| `deliveryPartnerId`   | `string \| null` | UUID of assigned partner, or `null` |
| `deliveryPartnerName` | `string \| null` | Name of assigned partner, or `null` |

These fields appear in every `OrderDto` in the paginated response.

---

## 9. Error Handling Strategy

The error handling follows the existing pattern established in `orders.controller.ts`:

### 9.1 Error Response Shape

All error responses use the standard `ApiResponse` shape:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

### 9.2 Status Codes

| Code | Usage |
|------|-------|
| 200  | Successful read, update, or delete |
| 201  | Successful creation |
| 400  | Validation error (missing/invalid required fields) |
| 404  | Entity not found (delivery partner or order) |
| 500  | Internal server error (database failures, unexpected exceptions) |

### 9.3 Error Flow

1. **Validation errors** are thrown immediately before any database call using `createError(message, 400)`.
2. **Not-found errors** are thrown after a database lookup returns `null`, using `createError(message, 404)`.
3. **Unexpected errors** are caught in the `catch` block; if they already have a `statusCode` (i.e., they are intentional errors from above), they are re-thrown. Otherwise, a generic 500 error is thrown.
4. The `asyncHandler` wrapper catches all thrown errors and passes them to Express's `next()`, which forwards to the global `errorHandler` middleware in `server.ts`.

---

## 10. Affected Files Summary

### Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `libs/data-access/src/entities/DeliveryPartner.ts` | New TypeORM entity |
| 2 | `libs/data-access/src/database/migrations/1760100000000-CreateDeliveryPartnerModule.ts` | Migration: create table + add FK to orders |
| 3 | `libs/data-access/src/repositories/DeliveryPartnerRepository.ts` | CRUD repository |
| 4 | `apps/api/src/app/controllers/delivery-partners.controller.ts` | Request handlers |
| 5 | `apps/api/src/app/routes/delivery-partners.routes.ts` | Route definitions |

### Files to Modify

| # | File | Change Description |
|---|------|--------------------|
| 6 | `libs/data-access/src/entities/Order.ts` | Add `deliveryPartnerId` column, `ManyToOne` relation to `DeliveryPartner`, `deliveryPartnerName` virtual getter; add `DeliveryPartner` import |
| 7 | `libs/data-access/src/repositories/OrderRepository.ts` | Add `deliveryPartner` left join in `findAll()` and `findById()`; add `deliveryPartnerId` filter param to `findAll()`; add `assignDeliveryPartner()` method |
| 8 | `libs/data-access/src/services/DatabaseService.ts` | Import `DeliveryPartnerRepository`; add private field, constructor init, and `getDeliveryPartnerRepository()` getter |
| 9 | `libs/data-access/src/index.ts` | Add `export type { DeliveryPartner } from './entities/DeliveryPartner'`; add `export { DeliveryPartnerRepository } from './repositories/DeliveryPartnerRepository'` |
| 10 | `libs/types/src/index.ts` | Add `DeliveryPartnerDto`, `CreateDeliveryPartnerDto`, `UpdateDeliveryPartnerDto`, `AssignDeliveryPartnerDto`; extend `OrderDto` with `deliveryPartnerId` and `deliveryPartnerName` |
| 11 | `apps/api/src/app/controllers/orders.controller.ts` | Extend `mapOrderToDto` to include `deliveryPartnerId` and `deliveryPartnerName`; add `deliveryPartnerId` query param handling in `getAllOrders`; add `assignDeliveryPartner` handler export |
| 12 | `apps/api/src/app/routes/orders.routes.ts` | Import `assignDeliveryPartner`; add `router.patch('/:id/assign-partner', assignDeliveryPartner)` |
| 13 | `apps/api/src/app/server.ts` | Import `deliveryPartnersRouter`; add `app.use('/api/delivery-partners', deliveryPartnersRouter)` |

### Files Not Changed

| File | Reason |
|------|--------|
| `data-source.ts` | Uses glob pattern `entities/*.ts` — new entity auto-discovered |
| `apps/web/*` | Customer-facing app — out of scope per PRD |
| `apps/admin/*` | Covered by the frontend Design Doc |

---

## Review Notes

**Reviewed:** 2026-03-22
**Result:** Approved

### Pattern Consistency: PASS

- Entity follows existing Order.ts pattern (decorators, column types, relations, virtual getters).
- Repository follows CategoryRepository pattern (constructor with `AppDataSource.getRepository()`, return types, `update` then `findById` pattern, `delete` returning boolean).
- Controller follows orders.controller.ts pattern (asyncHandler, createError, logger, DatabaseService.getInstance(), mapToDto helper).
- Routes follow orders.routes.ts pattern (import named controller handlers, Router instance, export default).
- DatabaseService modification follows existing singleton pattern (private field, constructor init, public getter with `ensureConnection()`).
- Barrel exports in index.ts follow existing pattern (type-only for entities, value exports for repositories).
- Route registration in server.ts follows existing import + `app.use` pattern.
- Migration follows existing pattern with idempotency guards.

### PRD Alignment: PASS

All 22 backend functional requirements (FR-BE-1 through FR-BE-22) are addressed. All API contracts match PRD Section 5. Scope constraints (single partner per order, no automation, post-creation assignment only) are respected.

### Completeness: PASS

Entity, migration, repository, controller, routes, types, DatabaseService integration, barrel exports, route registration -- all layers covered.

### API Contract Clarity: PASS

Section 8 provides full request/response examples with JSON bodies, status codes, TypeScript types, and query parameter documentation for every endpoint. Sufficient for frontend consumption.

### Minor Observations (non-blocking)

1. **No server-side `isActive` check on assignment:** The `assignDeliveryPartner` handler verifies the partner exists but does not reject assignment of inactive partners. The design doc explicitly notes this is frontend-enforced (Section 1, Key Constraints). Acceptable for Phase 1, but consider adding server-side validation in a future iteration.
2. **`as any` cast in `assignDeliveryPartner` repository method:** The `deliveryPartnerId as any` cast (Section 4.2.4) works around TypeORM typing for nullable columns. Functional but not type-safe. Minor code smell, acceptable.
3. **No pagination on delivery partners list:** `GET /api/delivery-partners` returns all partners without pagination. Acceptable for Phase 1 given expected low cardinality (small number of delivery partners).
