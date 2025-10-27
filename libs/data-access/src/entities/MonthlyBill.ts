import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Customer } from './Customer';
import { Order } from './Order';

export type BillStatus = 'draft' | 'sent' | 'paid' | 'overdue';

@Entity('monthly_bills')
@Index(['customerId'])
@Index(['status'])
@Index(['billingMonth'])
@Index(['createdAt'])
export class MonthlyBill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  customerId!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  billNumber!: string;

  @Column({ type: 'varchar', length: 7 }) // YYYY-MM format
  billingMonth!: string;

  @Column({ type: 'integer' })
  billingYear!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'integer', default: 0 })
  orderCount!: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft',
  })
  status!: BillStatus;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.id, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @OneToMany(() => Order, (order) => order.monthlyBill)
  orders!: Order[];

  // Virtual fields for DTOs
  get billingPeriod(): { month: string; year: number } {
    return {
      month: this.billingMonth,
      year: this.billingYear,
    };
  }
}
