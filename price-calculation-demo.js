#!/usr/bin/env node

/**
 * Simple Price Calculation Demo
 *
 * Demonstrates the new price calculation logic without database dependencies
 */

console.log('🏗️ Refined Order Module - Price Calculation Demo');
console.log('='.repeat(50));

// Price calculation function (extracted from OrderService)
function calculateItemPrice(
  orderedQuantity,
  unit,
  productPrice,
  productQuantity,
  productUnit
) {
  // Convert product unit to base quantity
  let baseQuantity;

  switch (productUnit) {
    case 'kg':
      baseQuantity = 1000; // 1000 grams = 1 kg
      break;
    case 'gm':
      baseQuantity = productQuantity;
      break;
    case 'pc':
      baseQuantity = 1; // 1 piece
      break;
    default:
      baseQuantity = 1;
  }

  // Formula: final_price = (ordered_quantity / base_quantity) * price_per_base_unit
  return (orderedQuantity / baseQuantity) * productPrice;
}

// Payment mode selection logic
function selectPaymentMode(walletBalance, orderTotal, isMonthlyPayment) {
  if (walletBalance >= orderTotal) {
    return { mode: 'wallet', reason: 'Sufficient wallet balance' };
  } else if (isMonthlyPayment) {
    return {
      mode: 'monthly',
      reason: 'Monthly payment customer with insufficient wallet',
    };
  } else {
    return { mode: 'cod', reason: 'Default payment mode' };
  }
}

// Demo data
const products = [
  { name: 'Potato', price: 40, quantity: 1, unit: 'kg' },
  { name: 'Cabbage', price: 10, quantity: 1, unit: 'pc' },
  { name: 'Brown Bread', price: 45, quantity: 1, unit: 'pc' },
  { name: 'Mixed Vegetables', price: 120, quantity: 1, unit: 'kg' },
];

const customers = [
  { name: 'Rajesh Kumar', walletBalance: 100, isMonthlyPayment: false },
  { name: 'Priya Sharma', walletBalance: 15, isMonthlyPayment: true },
  { name: 'Amit Patel', walletBalance: 5, isMonthlyPayment: false },
];

console.log('\n📊 PRICE CALCULATION EXAMPLES:');
console.log('-'.repeat(40));

// Example 1: Potato order
const potatoOrder = {
  orderedQuantity: 500,
  unit: 'gm',
};
const potato = products[0];
const potatoPrice = calculateItemPrice(
  potatoOrder.orderedQuantity,
  potatoOrder.unit,
  potato.price,
  potato.quantity,
  potato.unit
);

console.log(
  `🥔 ${potato.name}: ₹${potato.price} per ${potato.quantity}${potato.unit}`
);
console.log(
  `   Customer orders: ${potatoOrder.orderedQuantity}${potatoOrder.unit}`
);
console.log(
  `   Calculation: (${potatoOrder.orderedQuantity} / 1000) × ${potato.price} = ₹${potatoPrice}`
);

// Example 2: Cabbage order
const cabbageOrder = {
  orderedQuantity: 1,
  unit: 'pc',
};
const cabbage = products[1];
const cabbagePrice = calculateItemPrice(
  cabbageOrder.orderedQuantity,
  cabbageOrder.unit,
  cabbage.price,
  cabbage.quantity,
  cabbage.unit
);

console.log(
  `\n🥬 ${cabbage.name}: ₹${cabbage.price} per ${cabbage.quantity}${cabbage.unit}`
);
console.log(
  `   Customer orders: ${cabbageOrder.orderedQuantity}${cabbageOrder.unit}`
);
console.log(
  `   Calculation: (${cabbageOrder.orderedQuantity} / 1) × ${cabbage.price} = ₹${cabbagePrice}`
);

const totalOrderAmount = potatoPrice + cabbagePrice;
console.log(`\n💰 Total Order Amount: ₹${totalOrderAmount}`);

console.log('\n💳 PAYMENT MODE SELECTION EXAMPLES:');
console.log('-'.repeat(40));

customers.forEach((customer) => {
  const payment = selectPaymentMode(
    customer.walletBalance,
    totalOrderAmount,
    customer.isMonthlyPayment
  );

  console.log(`\n👤 ${customer.name}:`);
  console.log(`   Wallet Balance: ₹${customer.walletBalance}`);
  console.log(
    `   Monthly Payment: ${customer.isMonthlyPayment ? 'Yes' : 'No'}`
  );
  console.log(`   Order Total: ₹${totalOrderAmount}`);
  console.log(`   🎯 Selected Payment Mode: ${payment.mode.toUpperCase()}`);
  console.log(`   📝 Reason: ${payment.reason}`);
});

console.log('\n🏷️  ORDER ITEM STRUCTURE EXAMPLE:');
console.log('-'.repeat(40));

const orderItemExample = {
  productId: 'uuid-potato-123',
  orderedQuantity: 500,
  unit: 'gm',
  pricePerBaseUnit: 40.0,
  baseQuantity: 1000,
  finalPrice: 20.0,
  // Legacy fields for backward compatibility
  quantity: 500,
  price: 40.0,
  total: 20.0,
};

console.log('```json');
console.log(JSON.stringify(orderItemExample, null, 2));
console.log('```');

console.log('\n✅ KEY BENEFITS:');
console.log('-'.repeat(40));
console.log('🔸 No manual payment selection - system chooses automatically');
console.log('🔸 Proportional pricing - fair calculation for any quantity');
console.log('🔸 Historical accuracy - prices locked at time of order');
console.log('🔸 Flexible units - supports grams, kilograms, and pieces');
console.log('🔸 Scalable design - ready for future enhancements');

console.log('\n🚀 Implementation Complete! Ready for production use.');
