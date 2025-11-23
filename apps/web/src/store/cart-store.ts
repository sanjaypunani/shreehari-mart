/**
 * Cart State Management with Zustand
 *
 * Manages shopping cart state including items, quantities, and total calculations.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Cart Item Interface
 */
export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number; // Current price based on selected variant
  quantity: number; // Cart quantity (how many times added)
  orderedQuantity: number; // Actual quantity ordered (e.g., 500 for 500gm)
  unit: 'gm' | 'kg' | 'pc';
  productQuantity: string; // Display string (e.g., "500 gm", "1 kg")
  baseQuantity: number; // Product's base quantity from API (e.g., 250)
  basePrice: number; // Product's base price from API (e.g., 30.00)
  baseUnit: 'gm' | 'kg' | 'pc'; // Product's base unit from API
  isAvailable: boolean;
  selectedVariant?: string;
}

/**
 * Cart Store Interface
 */
interface CartStore {
  // State
  items: CartItem[];
  isExpanded: boolean;

  // Computed
  totalItems: number;
  totalAmount: number;
  savings: number;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateVariant: (
    itemId: string,
    variantValue: string,
    variantLabel: string,
    variantPrice: number,
    orderedQuantity: number,
    unit: 'gm' | 'kg' | 'pc'
  ) => void;
  clearCart: () => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

/**
 * Initial state
 */
const initialState = {
  items: [],
  isExpanded: false,
  totalItems: 0,
  totalAmount: 0,
  savings: 0,
};

/**
 * Calculate cart totals
 */
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // Mock savings calculation (assuming 20% discount on all items)
  const savings = totalAmount * 0.2;

  return { totalItems, totalAmount, savings };
};

/**
 * Create the cart store
 */
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Add item to cart
        addItem: (item) => {
          const items = get().items;
          const existingItemIndex = items.findIndex((i) => i.id === item.id);

          let newItems: CartItem[];

          if (existingItemIndex !== -1) {
            // Item exists, replace it with new item data (don't increment quantity)
            newItems = items.map((i, index) =>
              index === existingItemIndex
                ? ({ ...item, quantity: item.quantity || 1 } as CartItem)
                : i
            );
          } else {
            // New item, add to cart
            newItems = [
              ...items,
              { ...item, quantity: item.quantity || 1 } as CartItem,
            ];
          }

          const totals = calculateTotals(newItems);
          set(
            {
              items: newItems,
              ...totals,
            },
            false,
            'cart/addItem'
          );
        },

        // Remove item from cart
        removeItem: (itemId) => {
          const items = get().items.filter((i) => i.id !== itemId);
          const totals = calculateTotals(items);
          set(
            {
              items,
              ...totals,
            },
            false,
            'cart/removeItem'
          );
        },

        // Update item quantity
        updateQuantity: (itemId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(itemId);
            return;
          }

          const items = get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          );
          const totals = calculateTotals(items);
          set(
            {
              items,
              ...totals,
            },
            false,
            'cart/updateQuantity'
          );
        },

        // Update item variant
        updateVariant: (
          itemId,
          variantValue,
          variantLabel,
          variantPrice,
          orderedQuantity,
          unit
        ) => {
          const items = get().items.map((i) => {
            if (i.id === itemId) {
              return {
                ...i,
                selectedVariant: variantValue,
                productQuantity: variantLabel,
                price: variantPrice,
                orderedQuantity,
                unit,
              };
            }
            return i;
          });
          const totals = calculateTotals(items);
          set(
            {
              items,
              ...totals,
            },
            false,
            'cart/updateVariant'
          );
        },

        // Clear cart
        clearCart: () => {
          set(
            {
              items: [],
              totalItems: 0,
              totalAmount: 0,
              savings: 0,
            },
            false,
            'cart/clearCart'
          );
        },

        // Toggle expanded state
        toggleExpanded: () => {
          set(
            (state) => ({
              isExpanded: !state.isExpanded,
            }),
            false,
            'cart/toggleExpanded'
          );
        },

        // Set expanded state
        setExpanded: (expanded) => {
          set(
            {
              isExpanded: expanded,
            },
            false,
            'cart/setExpanded'
          );
        },
      }),
      {
        name: 'shreehari-mart-cart', // localStorage key
        partialize: (state) => ({
          // Persist cart items
          items: state.items,
        }),
        onRehydrateStorage: () => (state) => {
          // Recalculate totals after hydration
          if (state && state.items.length > 0) {
            const totals = calculateTotals(state.items);
            state.totalItems = totals.totalItems;
            state.totalAmount = totals.totalAmount;
            state.savings = totals.savings;
          }
        },
      }
    ),
    {
      name: 'CartStore', // DevTools name
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotalItems = () =>
  useCartStore((state) => state.totalItems);
export const useCartTotalAmount = () =>
  useCartStore((state) => state.totalAmount);
export const useCartSavings = () => useCartStore((state) => state.savings);
export const useCartExpanded = () => useCartStore((state) => state.isExpanded);
