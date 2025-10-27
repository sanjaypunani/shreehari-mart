import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Customer } from './Customer';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 500 })
  street!: string;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({ type: 'varchar', length: 100 })
  state!: string;

  @Column({ type: 'varchar', length: 20 })
  zipCode!: string;

  @Column({ type: 'varchar', length: 100, default: 'India' })
  country!: string;

  // Relations
  @OneToOne(() => Customer, (customer) => customer.address)
  customer!: Customer;
}
