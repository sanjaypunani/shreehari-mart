import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { AppDataSource } from '../database/config';

export class ReorderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReorderValidationError';
  }
}

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
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.name', 'ASC')
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
   * Wraps in a transaction that shifts all existing categories up by 1 and
   * inserts the new category at sortOrder = 0 (top of the list).
   */
  async create(
    data: Pick<Category, 'name'> & { imageUrl?: string }
  ): Promise<Category> {
    return AppDataSource.transaction(async (manager) => {
      // Shift all existing rows up by 1
      await manager
        .createQueryBuilder()
        .update(Category)
        .set({ sortOrder: () => '"sortOrder" + 1' })
        .execute();

      // Insert new category at position 0
      const category = manager.create(Category, { ...data, sortOrder: 0 });
      return manager.save(Category, category);
    });
  }

  /**
   * Reorders all categories by assigning each ID its array index as sortOrder.
   * The orderedIds array must contain exactly all current category IDs.
   * Throws ReorderValidationError for validation failures.
   */
  async reorder(orderedIds: string[]): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      // Guard: non-empty list required to avoid generating invalid SQL
      if (orderedIds.length === 0) {
        throw new ReorderValidationError('The provided ID list must not be empty.');
      }

      // Guard: no duplicate IDs
      if (new Set(orderedIds).size !== orderedIds.length) {
        throw new ReorderValidationError('The provided ID list contains duplicate entries.');
      }

      // Fetch all current category IDs for validation
      const existing = await manager
        .createQueryBuilder(Category, 'category')
        .select('category.id')
        .getMany();

      const existingIdSet = new Set(existing.map((c) => c.id));

      // Validate: submitted list must contain exactly the same IDs
      if (
        orderedIds.length !== existingIdSet.size ||
        !orderedIds.every((id) => existingIdSet.has(id))
      ) {
        throw new ReorderValidationError(
          'The provided ID list does not match the complete set of categories.'
        );
      }

      // Bulk-assign sortOrder = array index using a single parameterized CASE statement.
      // Parameters: alternating id / index pairs.
      const caseParts: string[] = [];
      const params: (string | number)[] = [];

      orderedIds.forEach((id, index) => {
        const p1 = params.length + 1; // parameter index for id
        const p2 = params.length + 2; // parameter index for sortOrder value
        caseParts.push(`WHEN id = $${p1} THEN $${p2}`);
        params.push(id, index);
      });

      // Reuse id parameters ($1, $3, $5, ...) for the WHERE IN clause
      const inParams = orderedIds.map((_, i) => `$${i * 2 + 1}`).join(', ');

      await manager.query(
        `UPDATE categories SET "sortOrder" = CASE ${caseParts.join(' ')} ELSE "sortOrder" END WHERE id IN (${inParams})`,
        params
      );
    });
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
