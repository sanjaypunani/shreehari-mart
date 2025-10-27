import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { OrderItem } from './OrderItem';
import { MonthlyBill } from './MonthlyBill';

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export type PaymentMode = 'wallet' | 'monthly' | 'cod';

@Entity('orders')
@Index(['status'])
@Index(['paymentMode'])
@Index(['deliveryDate'])
@Index(['createdAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  customerId!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status!: OrderStatus;

  @Column({
    type: 'enum',
    enum: ['wallet', 'monthly', 'cod'],
    default: 'cod',
  })
  paymentMode!: PaymentMode;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: true,
  })
  discount?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'date', nullable: true })
  deliveryDate?: Date;

  @Column({ type: 'uuid', nullable: true })
  monthlyBillId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];

  @ManyToOne(() => MonthlyBill, (monthlyBill) => monthlyBill.orders, {
    nullable: true,
  })
  @JoinColumn({ name: 'monthlyBillId' })
  monthlyBill?: MonthlyBill;

  // Virtual fields for DTOs
  get customerName(): string {
    return this.customer?.name || '';
  }

  get customerEmail(): string {
    return this.customer?.email || '';
  }
}
