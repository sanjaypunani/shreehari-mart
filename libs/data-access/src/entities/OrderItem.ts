import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'integer' })
  orderedQuantity!: number; // e.g., 500 (grams), 1 (piece), etc.

  @Column({
    type: 'enum',
    enum: ['gm', 'kg', 'pc'],
  })
  unit!: 'gm' | 'kg' | 'pc';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerBaseUnit!: number; // price stored from product (e.g., 40 per 1kg)

  @Column({ type: 'integer' })
  baseQuantity!: number; // reference quantity (e.g., 1000 for kg, 1 for pc)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalPrice!: number; // auto-calculated: (ordered_quantity / base_quantity) * price_per_base_unit

  // Legacy fields for backward compatibility
  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  // Virtual fields for DTOs
  get productName(): string {
    return this.product?.name || '';
  }
}
