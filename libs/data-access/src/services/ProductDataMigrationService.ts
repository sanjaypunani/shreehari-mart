import { DataSource } from 'typeorm';
import { Product } from '../entities/Product';

export class ProductDataMigrationService {
  constructor(private dataSource: DataSource) {}

  async migrateProductData(): Promise<void> {
    console.log('🚀 Checking Product data migration...');

    const productRepository = this.dataSource.getRepository(Product);

    try {
      // Find products that need default values set
      const productsToMigrate = await productRepository
        .createQueryBuilder('product')
        .where(
          'product.price IS NULL OR product.quantity IS NULL OR product.unit IS NULL'
        )
        .getMany();

      if (productsToMigrate.length > 0) {
        console.log(
          `📊 Setting defaults for ${productsToMigrate.length} products...`
        );

        for (const product of productsToMigrate) {
          // Set default values for missing fields
          if (product.price == null) product.price = 0;
          if (product.quantity == null) product.quantity = 1;
          if (product.unit == null) product.unit = 'kg';

          await productRepository.save(product);
        }

        console.log('✅ Product data migration completed');
      } else {
        console.log('ℹ️ No products need migration');
      }

      // No additional check needed since we already handled all cases above
    } catch (error) {
      console.error('❌ Product data migration failed:', error);
      throw error;
    }
  }
}
