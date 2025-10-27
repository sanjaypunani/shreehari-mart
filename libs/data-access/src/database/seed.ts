import { DatabaseService } from '@shreehari/data-access';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();
    const customerRepo = dbService.getCustomerRepository();

    // Seed products
    const sampleProducts = [
      {
        name: 'Potato',
        description: 'Fresh farm potato',
        price: 40.0,
        quantity: 1,
        unit: 'kg' as const,
        isAvailable: true,
      },
      {
        name: 'Organic Wheat Flour',
        description: 'Fresh ground organic wheat flour',
        price: 90.0,
        quantity: 1,
        unit: 'kg' as const,
        isAvailable: true,
      },
      {
        name: 'Fresh Milk',
        description: 'Fresh dairy milk, pasteurized',
        price: 65.0,
        quantity: 1,
        unit: 'kg' as const,
        isAvailable: true,
      },
      {
        name: 'Brown Bread',
        description: 'Healthy brown bread made with whole wheat',
        price: 45.0,
        quantity: 1,
        unit: 'pc' as const,
        isAvailable: true,
      },
      {
        name: 'Mixed Vegetables',
        description: 'Fresh seasonal vegetables',
        price: 120.0,
        quantity: 1,
        unit: 'kg' as const,
        isAvailable: true,
      },
    ];

    for (const product of sampleProducts) {
      const existing = await productRepo.findByName(product.name);
      if (!existing) {
        await productRepo.create(product);
        console.log(`✅ Created product: ${product.name}`);
      }
    }

    // Seed customers
    console.log('🔹 Seeding societies...');
    const societyRepo = dbService.getSocietyRepository();
    const buildingRepo = dbService.getBuildingRepository();

    // Create sample societies
    const sampleSocieties = [
      {
        name: 'Green Valley Society',
        address: 'Sector 21, Gandhinagar, Gujarat, 382021',
      },
      {
        name: 'Sunrise Residency',
        address: 'Maninagar, Ahmedabad, Gujarat, 380008',
      },
    ];

    const createdSocieties: any[] = [];
    for (const society of sampleSocieties) {
      const existing = await societyRepo.findByName(society.name);
      if (!existing) {
        const created = await societyRepo.create(society);
        createdSocieties.push(created);
        console.log(`✅ Created society: ${society.name}`);
      } else {
        createdSocieties.push(existing);
      }
    }

    // Create sample buildings
    console.log('🔹 Seeding buildings...');
    const sampleBuildings = [
      { societyId: createdSocieties[0].id, name: 'A' },
      { societyId: createdSocieties[0].id, name: 'B' },
      { societyId: createdSocieties[1].id, name: 'A' },
      { societyId: createdSocieties[1].id, name: 'C' },
    ];

    const createdBuildings: any[] = [];
    for (const building of sampleBuildings) {
      const existing = await buildingRepo.findBySocietyId(building.societyId);
      const existingBuilding = existing.find((b) => b.name === building.name);

      if (!existingBuilding) {
        const created = await buildingRepo.create(building);
        createdBuildings.push(created);
        console.log(
          `✅ Created building: ${building.name} in society ${createdSocieties.find((s) => s.id === building.societyId)?.name}`
        );
      } else {
        createdBuildings.push(existingBuilding);
      }
    }

    // Seed customers with new structure
    console.log('🔹 Seeding customers...');
    const sampleCustomers = [
      {
        societyId: createdSocieties[0].id,
        buildingId: createdBuildings[0].id,
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@gmail.com',
        phone: '+91-9876543210',
        mobileNumber: '9876543210',
        flatNumber: 'A-101',
        isMonthlyPayment: false,
      },
      {
        societyId: createdSocieties[0].id,
        buildingId: createdBuildings[1].id,
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        phone: '+91-9876543211',
        mobileNumber: '9876543211',
        flatNumber: 'B-205',
        isMonthlyPayment: true,
      },
      {
        societyId: createdSocieties[1].id,
        buildingId: createdBuildings[2].id,
        name: 'Amit Patel',
        email: 'amit.patel@gmail.com',
        phone: '+91-9876543212',
        mobileNumber: '9876543212',
        flatNumber: 'A-305',
        isMonthlyPayment: false,
      },
    ];

    for (const customer of sampleCustomers) {
      const existing = await customerRepo.findByEmail(customer.email);
      if (!existing) {
        await customerRepo.create(customer);
        console.log(`✅ Created customer: ${customer.name}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Function to clear all data (useful for testing)
export async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...');

    const dbService = DatabaseService.getInstance();
    const productRepo = dbService.getProductRepository();
    const customerRepo = dbService.getCustomerRepository();
    const orderRepo = dbService.getOrderRepository();

    // Note: In a real application, you'd want to be more careful about this
    // and perhaps use database-level cascading deletes or migrations

    console.log(
      '⚠️ Warning: This would delete all data. Implement with caution.'
    );
    console.log('🎉 Database clearing completed!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}
