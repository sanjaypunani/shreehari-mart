import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('products')
@Index(['name'])
@Index(['unit'])
@Index(['isAvailable'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'integer', default: 1 })
  quantity!: number;

  @Column({
    type: 'enum',
    enum: ['gm', 'kg', 'pc'],
    default: 'kg',
  })
  unit!: 'gm' | 'kg' | 'pc';

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: true })
  isAvailable!: boolean;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string | null;

  @ManyToOne('Category', 'products', {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category?: import('./Category').Category | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
