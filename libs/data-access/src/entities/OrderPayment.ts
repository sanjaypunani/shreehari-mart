import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './Order';

export type PaymentMethod = 'wallet' | 'monthly' | 'cod';
export type PaymentStatus = 'pending' | 'success' | 'failed';

@Entity('order_payments')
@Index(['method'])
@Index(['status'])
@Index(['createdAt'])
export class OrderPayment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: ['wallet', 'monthly', 'cod'],
  })
  method!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  })
  status!: PaymentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => Order, { eager: true })
  @JoinColumn({ name: 'orderId' })
  order!: Order;
}
