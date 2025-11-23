/**
 * Utility functions for the web application
 *
 * Key Principle: All price calculations use the calculateItemPrice function
 * which matches the backend's pricing logic exactly, ensuring consistency.
 */

import { CartItem } from '../store';
import { CreateOrderItemDto } from '@shreehari/types';

/**
 * Convert cart items to order items format for API submission
 * This properly maps the cart items with their ordered quantities and units
 */
export function cartItemsToOrderItems(
  cartItems: CartItem[]
): CreateOrderItemDto[] {
  return cartItems.map((item) => ({
    productId: item.id,
    orderedQuantity: item.orderedQuantity * item.quantity, // Multiply by cart quantity
    unit: item.unit,
  }));
}

/**
 * Calculate item price with unit conversion support
 * This matches the backend's calculateItemPrice logic exactly
 *
 * @param orderedQuantity - The quantity being ordered
 * @param unit - The unit of the ordered quantity ('gm', 'kg', 'pc')
 * @param productPrice - The base price from API
 * @param productQuantity - The base quantity from API
 * @param productUnit - The unit of the base product ('gm', 'kg', 'pc')
 * @returns The calculated price
 */
export function calculateItemPrice(
  orderedQuantity: number,
  unit: 'gm' | 'kg' | 'pc',
  productPrice: number,
  productQuantity: number,
  productUnit: 'gm' | 'kg' | 'pc'
): number {
  // Convert ordered quantity to the same unit as product pricing
  let normalizedOrderedQuantity: number;

  // Handle unit conversion
  if (productUnit === 'kg' && unit === 'gm') {
    // Product is priced per kg, but ordered in grams
    normalizedOrderedQuantity = orderedQuantity / 1000;
  } else if (productUnit === 'gm' && unit === 'kg') {
    // Product is priced per gram, but ordered in kg
    normalizedOrderedQuantity = orderedQuantity * 1000;
  } else if (productUnit === unit) {
    // Same units, no conversion needed
    normalizedOrderedQuantity = orderedQuantity;
  } else if (productUnit === 'pc' || unit === 'pc') {
    // For pieces, use direct quantity
    normalizedOrderedQuantity = orderedQuantity;
  } else {
    // Fallback for any other cases
    normalizedOrderedQuantity = orderedQuantity;
  }

  // Calculate price per unit of the product
  const pricePerUnit = productPrice / productQuantity;

  return parseFloat((normalizedOrderedQuantity * pricePerUnit).toFixed(2));
}

/**
 * Backward compatibility alias
 * @deprecated Use calculateItemPrice instead for better unit conversion support
 */
export function calculatePriceForQuantity(
  basePrice: number,
  baseQuantity: number,
  targetQuantity: number
): number {
  return calculateItemPrice(
    targetQuantity,
    'gm',
    basePrice,
    baseQuantity,
    'gm'
  );
}

export {};
