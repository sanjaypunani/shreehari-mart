const { MongoClient } = require('mongodb');
const { Client } = require('pg');
require('dotenv').config();

// MongoDB connection configuration
const MONGODB_URI =
  'mongodb+srv://shreehari:Sanjay28899@cluster0.u7g40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DATABASE = 'order_management';
const MONGODB_ORDERS_COLLECTION = 'orders';
const MONGODB_ORDER_ITEMS_COLLECTION = 'order_items';

// PostgreSQL connection configuration
const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shreehari_mart',
};

class OrderMigration {
  constructor() {
    this.mongoClient = new MongoClient(MONGODB_URI);
    this.pgClient = new Client(PG_CONFIG);
    this.customerMap = new Map(); // Map MongoDB customerId to PostgreSQL customerId
    this.productMap = new Map(); // Map product name to PostgreSQL productId
  }

  async initialize() {
    console.log('🔌 Connecting to MongoDB...');
    await this.mongoClient.connect();
    console.log('✅ MongoDB connected successfully');

    console.log('🔌 Connecting to PostgreSQL...');
    await this.pgClient.connect();
    console.log('✅ PostgreSQL connected successfully');

    // Load customer mapping
    await this.loadCustomerMapping();
    await this.loadProductMapping();
  }

  async cleanup() {
    console.log('🧹 Cleaning up connections...');
    await this.mongoClient.close();
    await this.pgClient.end();
    console.log('✅ Cleanup completed');
  }

  /**
   * Load customer mapping from PostgreSQL to MongoDB
   */
  async loadCustomerMapping() {
    console.log('📋 Loading customer mapping...');
    const result = await this.pgClient.query(
      'SELECT id, "mobileNumber" FROM customers'
    );

    const customerNumbers = result.rows.map((row) => row.mobileNumber);

    // Get MongoDB customers to create mapping
    const db = this.mongoClient.db(MONGODB_DATABASE);
    const customersCollection = db.collection('customers');

    const mongoCustomers = await customersCollection
      .find({
        mobileNumber: { $in: customerNumbers },
      })
      .toArray();

    mongoCustomers.forEach((mongoCustomer) => {
      const pgCustomer = result.rows.find(
        (row) => row.mobileNumber === mongoCustomer.mobileNumber
      );
      if (pgCustomer) {
        this.customerMap.set(mongoCustomer._id.toString(), pgCustomer.id);
      }
    });

    console.log(`✅ Loaded ${this.customerMap.size} customer mappings`);
  }

  /**
   * Load product mapping from PostgreSQL
   */
  async loadProductMapping() {
    console.log('📋 Loading product mapping...');
    const result = await this.pgClient.query('SELECT id, name FROM products');

    result.rows.forEach((row) => {
      this.productMap.set(row.name, row.id);
    });

    // Store the placeholder product ID for missing items
    const placeholderProduct = result.rows.find(
      (row) => row.name === 'Unknown Product (Placeholder)'
    );
    if (placeholderProduct) {
      this.placeholderProductId = placeholderProduct.id;
      console.log(`📋 Found placeholder product: ${placeholderProduct.id}`);
    } else {
      console.warn(
        '⚠️  No placeholder product found. Missing items will be skipped.'
      );
    }

    console.log(`✅ Loaded ${this.productMap.size} product mappings`);
  }

  /**
   * Standardize unit values to match PostgreSQL enum
   */
  standardizeUnit(unit) {
    const unitMap = {
      KG: 'kg',
      GM: 'gm',
      PCS: 'pc',
      kg: 'kg',
      gm: 'gm',
      pc: 'pc',
      PIECE: 'pc',
      PIECES: 'pc',
      GRAM: 'gm',
      GRAMS: 'gm',
      KILOGRAM: 'kg',
      KILOGRAMS: 'kg',
    };

    const standardized = unitMap[unit?.toUpperCase()] || 'pc';
    return standardized;
  }

  /**
   * Map order status to PostgreSQL enum
   */
  mapOrderStatus(status) {
    const statusMap = {
      pending: 'pending',
      confirmed: 'confirmed',
      delivered: 'delivered',
      cancelled: 'cancelled',
      processing: 'confirmed',
      shipped: 'confirmed',
      completed: 'delivered',
    };

    return statusMap[status?.toLowerCase()] || 'pending';
  }

  /**
   * Determine payment mode based on order data
   */
  determinePaymentMode(mongoOrder) {
    // If wallet was used, set as wallet
    if (mongoOrder.walletUsed === true && mongoOrder.walletAmount > 0) {
      return 'wallet';
    }

    // Default to cod for now - this can be enhanced based on your business logic
    return 'cod';
  }

  /**
   * Parse and validate delivery date
   */
  parseDeliveryDate(deliveryDate) {
    if (!deliveryDate) {
      return null;
    }

    // Handle different date formats
    let date;
    if (typeof deliveryDate === 'string') {
      date = new Date(deliveryDate);
    } else if (deliveryDate instanceof Date) {
      date = deliveryDate;
    } else {
      return null;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  /**
   * Validate and clean price
   */
  validatePrice(price) {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return 0.0;
    }
    return numPrice;
  }

  /**
   * Validate and clean quantity
   */
  validateQuantity(quantity) {
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
      return 1;
    }
    return numQuantity;
  }

  /**
   * Validate and clean discount
   */
  validateDiscount(discount) {
    const numDiscount = parseFloat(discount);
    if (isNaN(numDiscount) || numDiscount < 0) {
      return 0.0;
    }
    return numDiscount;
  }

  /**
   * Calculate base quantity and price per base unit for order items
   */
  calculateOrderItemPricing(item) {
    const unit = this.standardizeUnit(item.unit);
    const orderedQuantity = this.validateQuantity(item.quantity);
    const itemPrice = this.validatePrice(item.price);

    let baseQuantity = 1;
    let pricePerBaseUnit = itemPrice;

    // Adjust base quantity based on unit
    if (unit === 'kg') {
      baseQuantity = 1000; // 1kg = 1000gm
      pricePerBaseUnit = itemPrice; // Price is already per kg
    } else if (unit === 'gm') {
      baseQuantity = 1000; // Base unit is 1kg (1000gm)
      pricePerBaseUnit = (itemPrice / orderedQuantity) * 1000; // Convert to price per kg
    } else if (unit === 'pc') {
      baseQuantity = 1; // Base unit is 1 piece
      pricePerBaseUnit = itemPrice / orderedQuantity; // Price per piece
    }

    const finalPrice = (orderedQuantity / baseQuantity) * pricePerBaseUnit;

    return {
      orderedQuantity,
      unit,
      pricePerBaseUnit: Math.round(pricePerBaseUnit * 100) / 100, // Round to 2 decimal places
      baseQuantity,
      finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
    };
  }

  /**
   * Calculate pricing for placeholder products to preserve original order totals
   */
  calculatePlaceholderPricing(item) {
    const unit = this.standardizeUnit(item.unit);
    const orderedQuantity = this.validateQuantity(item.quantity);
    const itemPrice = this.validatePrice(item.price);

    // For placeholder products, we want to preserve the exact original price
    // We'll calculate a custom pricePerBaseUnit that results in the correct finalPrice
    let baseQuantity = 1000; // Use gm as base (placeholder product is in gm)
    let pricePerBaseUnit;

    if (unit === 'kg') {
      // If ordered in kg, calculate price per kg that gives us the right total
      pricePerBaseUnit = itemPrice; // Price is already per kg
    } else if (unit === 'gm') {
      // If ordered in gm, calculate price per kg that gives us the right total
      pricePerBaseUnit = (itemPrice / orderedQuantity) * 1000; // Convert to price per kg
    } else if (unit === 'pc') {
      // For pieces, we'll treat each piece as 1000gm (1kg) for calculation
      baseQuantity = 1; // Base unit is 1 piece
      pricePerBaseUnit = itemPrice / orderedQuantity; // Price per piece
    }

    // Ensure the final price matches the original exactly
    const finalPrice = itemPrice;

    return {
      orderedQuantity,
      unit,
      pricePerBaseUnit: Math.round(pricePerBaseUnit * 100) / 100, // Round to 2 decimal places
      baseQuantity,
      finalPrice: Math.round(finalPrice * 100) / 100, // Preserve original price exactly
    };
  }

  /**
   * Dry run method
   */
  async dryRun() {
    try {
      await this.initialize();

      const db = this.mongoClient.db(MONGODB_DATABASE);
      const ordersCollection = db.collection(MONGODB_ORDERS_COLLECTION);
      const orderItemsCollection = db.collection(
        MONGODB_ORDER_ITEMS_COLLECTION
      );

      const totalOrders = await ordersCollection.countDocuments();
      const totalOrderItems = await orderItemsCollection.countDocuments();

      console.log(
        `🔍 DRY RUN: Found ${totalOrders} orders and ${totalOrderItems} order items`
      );

      // Sample first 5 orders for validation
      const sampleOrders = await ordersCollection.find({}).limit(5).toArray();

      console.log('\n📋 SAMPLE ORDERS PREVIEW:');
      console.log('==========================');

      for (const [index, order] of sampleOrders.entries()) {
        const customerExists = this.customerMap.has(
          order.customerId?.toString()
        );
        const mappedStatus = this.mapOrderStatus(order.status);
        const paymentMode = this.determinePaymentMode(order);
        const cleanTotal = this.validatePrice(
          order.totalAmount || order.finalAmount
        );

        console.log(`${index + 1}. Order ID: ${order._id}`);
        console.log(
          `   Customer: ${order.customerName} (${order.customerNumber})`
        );
        console.log(
          `   Customer ID exists in PG: ${customerExists ? '✅' : '❌'}`
        );
        console.log(`   Society: ${order.socityName || 'N/A'}`);
        console.log(`   Flat: ${order.flatNumber || 'N/A'}`);
        console.log(`   Status: ${order.status} → ${mappedStatus}`);
        console.log(`   Payment Mode: ${paymentMode}`);
        console.log(
          `   Total Amount: ${order.totalAmount || order.finalAmount} → ${cleanTotal}`
        );
        console.log(`   Discount: ${order.discount || 0}`);
        console.log(
          `   Final Amount: ${order.finalAmount || order.totalAmount}`
        );
        console.log(`   Wallet Used: ${order.walletUsed || false}`);
        console.log(`   Wallet Amount: ${order.walletAmount || 0}`);
        console.log(
          `   Delivery Date: ${order.deliveryDate || 'N/A'} → ${this.parseDeliveryDate(order.deliveryDate) || 'NULL'}`
        );
        console.log(`   Created: ${order.createdAt || 'N/A'}`);

        // Get order items for this order
        const orderItems = await orderItemsCollection
          .find({
            orderId: order._id,
          })
          .toArray();

        console.log(`   Order Items (${orderItems.length}):`);
        orderItems.forEach((item, itemIndex) => {
          const productExists = this.productMap.has(item.name);
          const pricing = this.calculateOrderItemPricing(item);

          console.log(`     ${itemIndex + 1}. ${item.name}`);
          console.log(
            `        Product exists in PG: ${productExists ? '✅' : '❌'}`
          );
          console.log(
            `        Quantity: ${item.quantity} ${item.unit} → ${pricing.orderedQuantity} ${pricing.unit}`
          );
          console.log(
            `        Price: ${item.price} → Final: ${pricing.finalPrice}`
          );
          console.log(
            `        Price per base unit: ${pricing.pricePerBaseUnit}`
          );
          console.log(`        Base quantity: ${pricing.baseQuantity}`);
        });
        console.log('   ---');
      }

      // Check for orders without customers in PostgreSQL
      const ordersWithoutCustomers = [];
      const allOrders = await ordersCollection.find({}).toArray();

      allOrders.forEach((order) => {
        if (!this.customerMap.has(order.customerId?.toString())) {
          ordersWithoutCustomers.push({
            orderId: order._id,
            customerNumber: order.customerNumber,
            customerName: order.customerName,
          });
        }
      });

      if (ordersWithoutCustomers.length > 0) {
        console.log('\n⚠️  ORDERS WITHOUT MATCHING CUSTOMERS:');
        console.log(
          `Found ${ordersWithoutCustomers.length} orders without matching customers in PostgreSQL`
        );
        ordersWithoutCustomers.slice(0, 10).forEach((order, index) => {
          console.log(
            `   ${index + 1}. Order: ${order.orderId}, Customer: ${order.customerName} (${order.customerNumber})`
          );
        });
        if (ordersWithoutCustomers.length > 10) {
          console.log(`   ... and ${ordersWithoutCustomers.length - 10} more`);
        }
      }

      // Check for order items without matching products
      const itemsWithoutProducts = [];
      const allOrderItems = await orderItemsCollection.find({}).toArray();

      allOrderItems.forEach((item) => {
        if (!this.productMap.has(item.name)) {
          itemsWithoutProducts.push({
            itemId: item._id,
            orderId: item.orderId,
            productName: item.name,
          });
        }
      });

      if (itemsWithoutProducts.length > 0) {
        console.log('\n⚠️  ORDER ITEMS WITHOUT MATCHING PRODUCTS:');
        console.log(
          `Found ${itemsWithoutProducts.length} order items without matching products in PostgreSQL`
        );

        // Get unique product names
        const uniqueProductNames = [
          ...new Set(itemsWithoutProducts.map((item) => item.productName)),
        ];
        uniqueProductNames.slice(0, 10).forEach((productName, index) => {
          const count = itemsWithoutProducts.filter(
            (item) => item.productName === productName
          ).length;
          console.log(`   ${index + 1}. "${productName}" (${count} items)`);
        });
        if (uniqueProductNames.length > 10) {
          console.log(
            `   ... and ${uniqueProductNames.length - 10} more unique products`
          );
        }
      }

      // Status distribution
      const statusStats = await ordersCollection
        .aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ])
        .toArray();

      console.log('\n📊 ORDER STATUS DISTRIBUTION:');
      statusStats.forEach((stat) => {
        const mapped = this.mapOrderStatus(stat._id);
        console.log(`   ${stat._id} → ${mapped}: ${stat.count} orders`);
      });

      console.log('\n✅ Dry run completed successfully');
    } catch (error) {
      console.error('💥 Dry run failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Main migration method
   */
  async migrate() {
    const stats = {
      totalOrders: 0,
      migratedOrders: 0,
      skippedOrders: 0,
      totalOrderItems: 0,
      migratedOrderItems: 0,
      skippedOrderItems: 0,
      errors: [],
    };

    try {
      await this.initialize();

      // Get MongoDB collections
      const db = this.mongoClient.db(MONGODB_DATABASE);
      const ordersCollection = db.collection(MONGODB_ORDERS_COLLECTION);
      const orderItemsCollection = db.collection(
        MONGODB_ORDER_ITEMS_COLLECTION
      );

      // Get total counts
      stats.totalOrders = await ordersCollection.countDocuments();
      stats.totalOrderItems = await orderItemsCollection.countDocuments();

      console.log(
        `📊 Found ${stats.totalOrders} orders and ${stats.totalOrderItems} order items to migrate`
      );

      // Process orders in batches
      const batchSize = 50;
      let skip = 0;

      while (skip < stats.totalOrders) {
        const orders = await ordersCollection
          .find({})
          .skip(skip)
          .limit(batchSize)
          .toArray();

        console.log(
          `🔄 Processing orders batch ${Math.floor(skip / batchSize) + 1} (${orders.length} orders)...`
        );

        for (const mongoOrder of orders) {
          try {
            await this.migrateOrder(mongoOrder, orderItemsCollection, stats);
          } catch (error) {
            const errorMessage = `Failed to migrate order ${mongoOrder._id}: ${error.message}`;
            console.error(`❌ ${errorMessage}`);
            stats.errors.push(errorMessage);
          }
        }

        skip += batchSize;
      }

      console.log('🎉 Migration completed!');
      this.printStats(stats);
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    } finally {
      await this.cleanup();
    }

    return stats;
  }

  /**
   * Migrate a single order with its items
   */
  async migrateOrder(mongoOrder, orderItemsCollection, stats) {
    // Check if customer exists in PostgreSQL
    const customerId = this.customerMap.get(mongoOrder.customerId?.toString());

    if (!customerId) {
      console.log(
        `⚠️  Order ${mongoOrder._id}: Customer ${mongoOrder.customerNumber} not found in PostgreSQL, skipping...`
      );
      stats.skippedOrders++;
      return;
    }

    // Check if order already exists
    const existingQuery = `SELECT id FROM orders WHERE id = $1 LIMIT 1`;
    const orderIdToCheck = mongoOrder._id
      .toString()
      .replace(/[^a-f0-9]/gi, '')
      .substring(0, 32);

    // Map MongoDB fields to PostgreSQL schema
    const orderData = {
      customerId: customerId,
      status: this.mapOrderStatus(mongoOrder.status),
      paymentMode: this.determinePaymentMode(mongoOrder),
      totalAmount: this.validatePrice(
        mongoOrder.totalAmount || mongoOrder.finalAmount
      ),
      discount: this.validateDiscount(mongoOrder.discount),
      notes: this.generateOrderNotes(mongoOrder),
      deliveryDate: this.parseDeliveryDate(mongoOrder.deliveryDate),
      createdAt: mongoOrder.createdAt || new Date(),
      updatedAt: mongoOrder.updatedAt || new Date(),
    };

    // Insert order
    const orderQuery = `
      INSERT INTO orders (
        "customerId", status, "paymentMode", "totalAmount", discount, notes, "deliveryDate", "createdAt", "updatedAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const orderResult = await this.pgClient.query(orderQuery, [
      orderData.customerId,
      orderData.status,
      orderData.paymentMode,
      orderData.totalAmount,
      orderData.discount,
      orderData.notes,
      orderData.deliveryDate,
      orderData.createdAt,
      orderData.updatedAt,
    ]);

    const newOrderId = orderResult.rows[0].id;

    // Get and migrate order items
    const orderItems = await orderItemsCollection
      .find({
        orderId: mongoOrder._id,
      })
      .toArray();

    let migratedItemsCount = 0;
    for (const mongoItem of orderItems) {
      try {
        const migrated = await this.migrateOrderItem(
          mongoItem,
          newOrderId,
          stats
        );
        if (migrated) {
          migratedItemsCount++;
        }
      } catch (error) {
        const errorMessage = `Failed to migrate order item ${mongoItem._id}: ${error.message}`;
        console.error(`❌ ${errorMessage}`);
        stats.errors.push(errorMessage);
      }
    }

    stats.migratedOrders++;
    console.log(
      `✅ Migrated order: ${mongoOrder.customerName} (${orderData.status}) - ₹${orderData.totalAmount} with ${migratedItemsCount} items`
    );
  }

  /**
   * Migrate a single order item
   */
  async migrateOrderItem(mongoItem, orderId, stats) {
    let productId = this.productMap.get(mongoItem.name);
    let isPlaceholder = false;

    if (!productId) {
      if (this.placeholderProductId) {
        productId = this.placeholderProductId;
        isPlaceholder = true;
        console.log(
          `📝 Using placeholder for missing product: "${mongoItem.name}"`
        );
      } else {
        console.log(
          `⚠️  Order item: Product "${mongoItem.name}" not found in PostgreSQL, skipping...`
        );
        stats.skippedOrderItems++;
        return false;
      }
    }

    let pricing;
    if (isPlaceholder) {
      // For placeholder products, calculate pricing to preserve original total
      pricing = this.calculatePlaceholderPricing(mongoItem);
    } else {
      pricing = this.calculateOrderItemPricing(mongoItem);
    }

    // Map MongoDB fields to PostgreSQL schema
    const orderItemData = {
      orderId: orderId,
      productId: productId,
      orderedQuantity: pricing.orderedQuantity,
      unit: pricing.unit,
      pricePerBaseUnit: pricing.pricePerBaseUnit,
      baseQuantity: pricing.baseQuantity,
      finalPrice: pricing.finalPrice,
      // Legacy fields for backward compatibility
      quantity: this.validateQuantity(mongoItem.quantity),
      price: this.validatePrice(mongoItem.price),
      total: pricing.finalPrice,
      createdAt: new Date(),
    };

    // Insert order item
    const orderItemQuery = `
      INSERT INTO order_items (
        "orderId", "productId", "orderedQuantity", unit, "pricePerBaseUnit", 
        "baseQuantity", "finalPrice", quantity, price, total, "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;

    await this.pgClient.query(orderItemQuery, [
      orderItemData.orderId,
      orderItemData.productId,
      orderItemData.orderedQuantity,
      orderItemData.unit,
      orderItemData.pricePerBaseUnit,
      orderItemData.baseQuantity,
      orderItemData.finalPrice,
      orderItemData.quantity,
      orderItemData.price,
      orderItemData.total,
      orderItemData.createdAt,
    ]);

    stats.migratedOrderItems++;
    if (isPlaceholder) {
      stats.placeholderItems = (stats.placeholderItems || 0) + 1;
    }
    return true;
  }

  /**
   * Generate comprehensive order notes from MongoDB data
   */
  generateOrderNotes(mongoOrder) {
    const notes = [];

    if (mongoOrder.socityName) {
      notes.push(`Society: ${mongoOrder.socityName}`);
    }

    if (mongoOrder.flatNumber) {
      notes.push(`Flat: ${mongoOrder.flatNumber}`);
    }

    // Discount is now handled as a separate field, no need to include in notes

    if (mongoOrder.walletUsed && mongoOrder.walletAmount > 0) {
      notes.push(`Wallet Used: ₹${mongoOrder.walletAmount}`);
    }

    if (mongoOrder.delivery_day) {
      notes.push(`Delivery Day: ${mongoOrder.delivery_day}`);
    }

    if (mongoOrder.order_month && mongoOrder.order_year) {
      notes.push(
        `Order Period: ${mongoOrder.order_month}/${mongoOrder.order_year}`
      );
    }

    if (mongoOrder.week_of_month) {
      notes.push(`Week: ${mongoOrder.week_of_month}`);
    }

    return notes.length > 0 ? notes.join(' | ') : null;
  }

  /**
   * Print migration statistics
   */
  printStats(stats) {
    console.log('\n📈 MIGRATION STATISTICS');
    console.log('========================');
    console.log(`Total orders found: ${stats.totalOrders}`);
    console.log(`Successfully migrated orders: ${stats.migratedOrders}`);
    console.log(`Skipped orders: ${stats.skippedOrders}`);
    console.log(`Total order items found: ${stats.totalOrderItems}`);
    console.log(
      `Successfully migrated order items: ${stats.migratedOrderItems}`
    );
    console.log(`Skipped order items: ${stats.skippedOrderItems}`);

    // Placeholder item statistics
    const placeholderItems = stats.placeholderItems || 0;
    if (placeholderItems > 0) {
      console.log(`🔧 Items using placeholder products: ${placeholderItems}`);
      const placeholderPercentage =
        stats.totalOrderItems > 0
          ? ((placeholderItems / stats.totalOrderItems) * 100).toFixed(2)
          : 0;
      console.log(`   (${placeholderPercentage}% of total items)`);
    }

    console.log(`Errors encountered: ${stats.errors.length}`);

    if (stats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      stats.errors.slice(0, 20).forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      if (stats.errors.length > 20) {
        console.log(`... and ${stats.errors.length - 20} more errors`);
      }
    }

    const orderSuccessRate =
      stats.totalOrders > 0
        ? ((stats.migratedOrders / stats.totalOrders) * 100).toFixed(2)
        : 0;
    const itemSuccessRate =
      stats.totalOrderItems > 0
        ? ((stats.migratedOrderItems / stats.totalOrderItems) * 100).toFixed(2)
        : 0;

    console.log(`\n✅ Order success rate: ${orderSuccessRate}%`);
    console.log(`✅ Order item success rate: ${itemSuccessRate}%`);

    if (placeholderItems > 0) {
      console.log(`\n🔧 PLACEHOLDER PRODUCT USAGE:`);
      console.log(
        `   • ${placeholderItems} items mapped to placeholder product`
      );
      console.log(`   • Original pricing preserved for all placeholder items`);
      console.log(`   • No data loss - all order totals maintained`);
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const migration = new OrderMigration();

  try {
    switch (command) {
      case 'dry-run':
        console.log('🔍 Starting order migration dry run...');
        await migration.dryRun();
        break;

      case 'migrate':
        console.log('🚀 Starting order migration...');
        const stats = await migration.migrate();

        if (stats.errors.length > 0) {
          console.log(
            '\n⚠️  Migration completed with errors. Please review the error log above.'
          );
          process.exit(1);
        } else {
          console.log('\n🎉 Order migration completed successfully!');
          process.exit(0);
        }
        break;

      default:
        console.log('📖 Order Migration Tool');
        console.log('=========================');
        console.log('Usage:');
        console.log('  node migrationorders.js dry-run   # Preview migration');
        console.log('  node migrationorders.js migrate   # Execute migration');
        console.log('');
        console.log('Prerequisites:');
        console.log('  1. Customer migration must be completed first');
        console.log('  2. Product migration must be completed first');
        console.log('  3. PostgreSQL database must be running');
        console.log('');
        console.log('Environment Variables Required:');
        console.log(
          '  DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME (PostgreSQL)'
        );
        console.log('');
        console.log('MongoDB → PostgreSQL Field Mapping:');
        console.log('');
        console.log('ORDERS:');
        console.log('  customerId (via mapping) → customerId');
        console.log(
          '  status → status (pending/confirmed/delivered/cancelled)'
        );
        console.log('  totalAmount/finalAmount → totalAmount');
        console.log('  discount → discount');
        console.log('  walletUsed + walletAmount → paymentMode determination');
        console.log('  deliveryDate → deliveryDate');
        console.log(
          '  Multiple fields → notes (society, flat, wallet usage, etc.)'
        );
        console.log('  createdAt → createdAt');
        console.log('  updatedAt → updatedAt');
        console.log('');
        console.log('ORDER ITEMS:');
        console.log('  orderId (mapped) → orderId');
        console.log('  name (via product mapping) → productId');
        console.log('  quantity → orderedQuantity');
        console.log('  unit (GM/KG/PCS) → unit (gm/kg/pc)');
        console.log('  price → calculated pricePerBaseUnit & finalPrice');
        console.log(
          '  Legacy fields: quantity, price, total (for compatibility)'
        );
        console.log('');
        console.log('Ignored/Transformed Fields:');
        console.log(
          '  customerNumber, customerName, socityName, flatNumber → notes'
        );
        console.log('  delivery_day, order_month, order_year → notes');
        console.log('  week_of_month, deliveryDate → notes');
        console.log('  walletTransactionId → handled separately');
        break;
    }
  } catch (error) {
    console.error('💥 Command failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = OrderMigration;
