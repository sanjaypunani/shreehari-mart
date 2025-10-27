import { Repository } from 'typeorm';
import { Product } from '../entities/Product';
import { AppDataSource } from '../database/config';

export class ProductRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    unit?: string;
    isAvailable?: boolean;
  }): Promise<{ products: Product[]; total: number }> {
    const { page = 1, limit = 10, search, unit, isAvailable } = options || {};
    const queryBuilder = this.repository.createQueryBuilder('product');
    console.log('search', search);
    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (unit) {
      queryBuilder.andWhere('product.unit = :unit', { unit });
    }

    if (isAvailable !== undefined) {
      queryBuilder.andWhere('product.isAvailable = :isAvailable', {
        isAvailable,
      });
    }

    queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Product | null> {
    return this.repository.findOne({ where: { name } });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.repository.create(productData);
    return this.repository.save(product);
  }

  async update(
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> {
    await this.repository.update(id, productData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }

  async toggleAvailability(id: string): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) return null;

    product.isAvailable = !product.isAvailable;
    return this.repository.save(product);
  }

  async getAvailableProducts(): Promise<Product[]> {
    return this.repository.find({
      where: {
        isAvailable: true,
      },
      order: { name: 'ASC' },
    });
  }
}
