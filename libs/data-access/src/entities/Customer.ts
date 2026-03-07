import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order';
import { Address } from './Address';
import { Society } from './Society';
import { Building } from './Building';
import { Wallet } from './Wallet';
import { User } from './User';

@Entity('customers')
@Index(['email'], { unique: true })
@Index(['phone'])
@Index(['mobileNumber'], { unique: true })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  societyId!: string;

  @Column({ type: 'uuid' })
  buildingId!: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  mobileNumber!: string;

  @Column({ type: 'varchar', length: 50 })
  flatNumber!: string;

  @Column({ type: 'uuid', nullable: true, unique: true })
  userId?: string | null;

  @Column({ type: 'boolean', default: false })
  isMonthlyPayment!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Order, (order) => order.customer)
  orders!: Order[];

  @OneToOne(() => Address, (address) => address.customer, { cascade: true })
  @JoinColumn()
  address?: Address;

  @ManyToOne(() => Society, (society) => society.customers, { eager: true })
  @JoinColumn({ name: 'societyId' })
  society!: Society;

  @ManyToOne(() => Building, (building) => building.customers, { eager: true })
  @JoinColumn({ name: 'buildingId' })
  building!: Building;

  @OneToOne(() => Wallet, (wallet) => wallet.customer)
  wallet?: Wallet;

  @OneToOne(() => User, (user) => user.customer, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User | null;

  // Virtual fields for DTOs
  get totalOrders(): number {
    return this.orders?.length || 0;
  }

  get totalSpent(): number {
    return this.orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  }

  get societyName(): string {
    return this.society?.name || '';
  }

  get buildingName(): string {
    return this.building?.name || '';
  }

  get walletBalance(): number {
    return this.wallet?.balance || 0;
  }
}
