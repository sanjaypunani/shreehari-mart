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
import { Society } from './Society';
import { Customer } from './Customer';

@Entity('buildings')
@Index(['name', 'societyId'], { unique: true })
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  societyId!: string;

  @Column({ type: 'varchar', length: 10 })
  name!: string; // e.g., A, B, C

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Society, (society) => society.buildings, { eager: true })
  @JoinColumn({ name: 'societyId' })
  society!: Society;

  @OneToMany(() => Customer, (customer) => customer.building)
  customers!: Customer[];

  // Virtual fields for DTOs
  get societyName(): string {
    return this.society?.name || '';
  }
}
