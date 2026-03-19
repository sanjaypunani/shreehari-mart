import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { AppDataSource } from '../database/config';

export class CategoryRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = AppDataSource.getRepository(Category);
  }

  /**
   * Returns all categories ordered by name ASC.
   * Includes a computed productCount via LEFT JOIN aggregate on products.
   */
  async findAll(): Promise<(Category & { productCount: number })[]> {
    const rows = await this.repository
      .createQueryBuilder('category')
      .loadRelationCountAndMap(
        'category.productCount',
        'category.products'
      )
      .orderBy('category.name', 'ASC')
      .getMany();

    // TypeORM loadRelationCountAndMap attaches the count directly on the entity
    return rows as (Category & { productCount: number })[];
  }

  /**
   * Returns a single category by primary key, or null if not found.
   */
  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Returns a category matching the given name (case-sensitive), or null.
   * Used for uniqueness validation on create.
   */
  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({ where: { name } });
  }

  /**
   * Inserts and returns the new category.
   */
  async create(data: Pick<Category, 'name'> & { imageUrl?: string }): Promise<Category> {
    const category = this.repository.create(data);
    return this.repository.save(category);
  }

  /**
   * Updates an existing category and returns the updated record, or null if not found.
   */
  async update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'imageUrl'>>
  ): Promise<Category | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Hard-deletes a category. Products with this categoryId have their
   * categoryId set to NULL via ON DELETE SET NULL at the DB level.
   * Returns true if a row was deleted, false if not found.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }
}
