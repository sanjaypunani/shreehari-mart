#!/usr/bin/env ts-node
/**
 * Refined Order Module Demo
 *
 * This script demonstrates the new order module features:
 * 1. Automatic payment mode selection
 * 2. Advanced price calculation logic
 * 3. New order item structure with units and quantities
 */

import 'reflect-metadata';
import { DatabaseConnection } from '../database/connection';
import { OrderService } from '../services/OrderService';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { WalletRepository } from '../repositories/WalletRepository';

class OrderModuleDemo {
  private orderService: OrderService;
  private customerRepo: CustomerRepository;
  private productRepo: ProductRepository;
  private walletRepo: WalletRepository;

  constructor() {
    this.orderService = new OrderService();
    this.customerRepo = new CustomerRepository();
    this.productRepo = new ProductRepository();
    this.walletRepo = new WalletRepository();
  }

  async runDemo() {
    console.log('🚀 Refined Order Module Demo Started\n');

    try {
      // Initialize database connection
      const dbConnection = DatabaseConnection.getInstance();
      await dbConnection.connect();

      await this.demonstratePriceCalculation();
      await this.demonstratePaymentModeSelection();
      await this.demonstrateOrderCreation();
    } catch (error) {
      console.error('❌ Demo failed:', error);
    } finally {
      console.log('\n✅ Demo completed');
      process.exit(0);
    }
  }

  async demonstratePriceCalculation() {
    console.log('📊 Price Calculation Logic Demo');
    console.log('='.repeat(40));

    // Example 1: Potato - ₹40 per 1kg, customer orders 500gm
    const potato500gm = this.orderService.calculateItemPrice(
      500, // ordered quantity
      'gm', // ordered unit
      40, // product price
      1, // product quantity (1kg)
      'kg' // product unit
    );
    console.log('🥔 Potato Example:');
    console.log(`   Product: ₹40 per 1kg`);
    console.log(`   Order: 500gm`);
    console.log(`   Calculation: (500 / 1000) * 40 = ₹${potato500gm}`);

    // Example 2: Cabbage - ₹10 per 1pc, customer orders 1pc
    const cabbage1pc = this.orderService.calculateItemPrice(
      1, // ordered quantity
      'pc', // ordered unit
      10, // product price
      1, // product quantity
      'pc' // product unit
    );
    console.log('\n🥬 Cabbage Example:');
    console.log(`   Product: ₹10 per 1pc`);
    console.log(`   Order: 1pc`);
    console.log(`   Calculation: (1 / 1) * 10 = ₹${cabbage1pc}`);

    console.log(`\n💰 Total Order Value: ₹${potato500gm + cabbage1pc}\n`);
  }

  async demonstratePaymentModeSelection() {
    console.log('💳 Payment Mode Auto-Selection Demo');
    console.log('='.repeat(40));

    try {
      const customers = await this.customerRepo.findAll({ page: 1, limit: 3 });

      for (const customer of customers.customers) {
        const wallet = customer.wallet;
        const walletBalance = wallet?.balance || 0;
        const isMonthlyPayment = customer.isMonthlyPayment;

        console.log(`👤 Customer: ${customer.name}`);
        console.log(`   Wallet Balance: ₹${walletBalance}`);
        console.log(`   Monthly Payment: ${isMonthlyPayment ? 'Yes' : 'No'}`);

        // Simulate order total of ₹30
        const orderTotal = 30;
        let selectedPaymentMode = 'cod';
        let reason = 'Default';

        if (walletBalance >= orderTotal) {
          selectedPaymentMode = 'wallet';
          reason = 'Sufficient wallet balance';
        } else if (isMonthlyPayment) {
          selectedPaymentMode = 'monthly';
          reason = 'Monthly payment customer';
        }

        console.log(
          `   For ₹${orderTotal} order → Payment Mode: ${selectedPaymentMode.toUpperCase()}`
        );
        console.log(`   Reason: ${reason}\n`);
      }
    } catch (error) {
      console.log('   Could not fetch customer data for demo\n');
    }
  }

  async demonstrateOrderCreation() {
    console.log('📝 Order Creation Demo');
    console.log('='.repeat(40));

    try {
      // Get first customer and products for demo
      const customers = await this.customerRepo.findAll({ page: 1, limit: 1 });
      const products = await this.productRepo.findAll({ page: 1, limit: 2 });

      if (customers.customers.length === 0 || products.products.length === 0) {
        console.log('   ⚠️  No customers or products found for demo');
        return;
      }

      const customer = customers.customers[0];
      const potato =
        products.products.find((p: any) =>
          p.name.toLowerCase().includes('potato')
        ) || products.products[0];
      const cabbage =
        products.products.find((p: any) =>
          p.name.toLowerCase().includes('cabbage')
        ) || products.products[1];

      console.log(`👤 Creating order for: ${customer.name}`);
      console.log(`📦 Order Items:`);
      console.log(
        `   - 500gm of ${potato.name} (₹${potato.price} per ${potato.quantity}${potato.unit})`
      );
      if (cabbage) {
        console.log(
          `   - 1pc of ${cabbage.name} (₹${cabbage.price} per ${cabbage.quantity}${cabbage.unit})`
        );
      }

      const orderData = {
        customerId: customer.id,
        items: [
          {
            productId: potato.id,
            orderedQuantity: 500,
            unit: 'gm' as const,
          },
          ...(cabbage
            ? [
                {
                  productId: cabbage.id,
                  orderedQuantity: 1,
                  unit: 'pc' as const,
                },
              ]
            : []),
        ],
        notes: 'Demo order created by refined order module',
      };

      const result = await this.orderService.createOrder(orderData);

      if (result.success) {
        console.log('\n✅ Order created successfully!');
        console.log(`   Order ID: ${result.data?.id}`);
        console.log(
          `   Payment Mode: ${result.data?.paymentMode?.toUpperCase()}`
        );
        console.log(`   Total Amount: ₹${result.data?.totalAmount}`);
        console.log(`   Status: ${result.data?.status?.toUpperCase()}`);
        console.log(`   ${result.message}`);
      } else {
        console.log(`\n❌ Order creation failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Demo order creation failed: ${error}`);
    }
  }
}

// Run the demo if this script is executed directly
if (require.main === module) {
  const demo = new OrderModuleDemo();
  demo.runDemo();
}

export { OrderModuleDemo };
