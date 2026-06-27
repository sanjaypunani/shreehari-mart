/**
 * Cart State Management with Zustand
 *
 * Cart is keyed per (productId, selectedVariant). Adding a 500g and a 1kg of
 * the same product creates two separate lines, and +/- on a line steps that
 * variant's quantity up or down without ever swapping which variant is in
 * the cart.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // productId
  name: string;
  image: string;
  price: number; // unit price for this variant
  quantity: number; // how many of THIS variant the user wants
  orderedQuantity: number; // size of the variant (e.g., 500 for 500gm)
  unit: 'gm' | 'kg' | 'pc';
  productQuantity: string; // display label (e.g., "500 gm")
  baseQuantity: number;
  basePrice: number;
  baseUnit: 'gm' | 'kg' | 'pc';
  isAvailable: boolean;
  selectedVariant: string; // variant key (e.g., "500gm") — required for line identity
}

const lineKeyFor = (productId: string, variant: string) =>
  `${productId}::${variant}`;

const findLineIndex = (
  items: CartItem[],
  productId: string,
  variant: string
) =>
  items.findIndex(
    (i) => i.id === productId && i.selectedVariant === variant
  );

interface CartStore {
  items: CartItem[];
  isExpanded: boolean;

  totalItems: number;
  totalAmount: number;
  savings: number;

  addItem: (
    item: Omit<CartItem, 'quantity' | 'selectedVariant'> & {
      quantity?: number;
      selectedVariant: string;
    }
  ) => void;
  removeItem: (productId: string) => void;
  removeLine: (productId: string, variant: string) => void;
  updateLineQuantity: (
    productId: string,
    variant: string,
    quantity: number
  ) => void;
  incrementLine: (productId: string, variant: string) => void;
  decrementLine: (productId: string, variant: string) => void;
  getLineQuantity: (productId: string, variant: string) => number;
  getProductTotalQuantity: (productId: string) => number;
  clearCart: () => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

const initialState = {
  items: [] as CartItem[],
  isExpanded: false,
  totalItems: 0,
  totalAmount: 0,
  savings: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const savings = totalAmount * 0.2;
  return { totalItems, totalAmount, savings };
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        addItem: (item) => {
          const items = get().items;
          const idx = findLineIndex(items, item.id, item.selectedVariant);

          let newItems: CartItem[];
          const incomingQty = item.quantity ?? 1;

          if (idx !== -1) {
            // Same product+variant already in cart — add to its quantity.
            newItems = items.map((i, index) =>
              index === idx
                ? { ...i, quantity: i.quantity + incomingQty }
                : i
            );
          } else {
            newItems = [
              ...items,
              { ...item, quantity: incomingQty } as CartItem,
            ];
          }

          set(
            { items: newItems, ...calculateTotals(newItems) },
            false,
            'cart/addItem'
          );
        },

        // Removes EVERY line for the given product (used when a product becomes
        // unavailable and we want to drop all its variants from the basket).
        removeItem: (productId) => {
          const items = get().items.filter((i) => i.id !== productId);
          set(
            { items, ...calculateTotals(items) },
            false,
            'cart/removeItem'
          );
        },

        removeLine: (productId, variant) => {
          const items = get().items.filter(
            (i) => !(i.id === productId && i.selectedVariant === variant)
          );
          set(
            { items, ...calculateTotals(items) },
            false,
            'cart/removeLine'
          );
        },

        updateLineQuantity: (productId, variant, quantity) => {
          if (quantity <= 0) {
            get().removeLine(productId, variant);
            return;
          }
          const items = get().items.map((i) =>
            i.id === productId && i.selectedVariant === variant
              ? { ...i, quantity }
              : i
          );
          set(
            { items, ...calculateTotals(items) },
            false,
            'cart/updateLineQuantity'
          );
        },

        incrementLine: (productId, variant) => {
          const items = get().items;
          const idx = findLineIndex(items, productId, variant);
          if (idx === -1) return;
          const next = items.map((i, index) =>
            index === idx ? { ...i, quantity: i.quantity + 1 } : i
          );
          set(
            { items: next, ...calculateTotals(next) },
            false,
            'cart/incrementLine'
          );
        },

        decrementLine: (productId, variant) => {
          const items = get().items;
          const idx = findLineIndex(items, productId, variant);
          if (idx === -1) return;
          const current = items[idx];
          if (current.quantity <= 1) {
            get().removeLine(productId, variant);
            return;
          }
          const next = items.map((i, index) =>
            index === idx ? { ...i, quantity: i.quantity - 1 } : i
          );
          set(
            { items: next, ...calculateTotals(next) },
            false,
            'cart/decrementLine'
          );
        },

        getLineQuantity: (productId, variant) => {
          const line = get().items.find(
            (i) => i.id === productId && i.selectedVariant === variant
          );
          return line?.quantity ?? 0;
        },

        getProductTotalQuantity: (productId) =>
          get()
            .items.filter((i) => i.id === productId)
            .reduce((sum, i) => sum + i.quantity, 0),

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

        toggleExpanded: () => {
          set(
            (state) => ({ isExpanded: !state.isExpanded }),
            false,
            'cart/toggleExpanded'
          );
        },

        setExpanded: (expanded) => {
          set({ isExpanded: expanded }, false, 'cart/setExpanded');
        },
      }),
      {
        name: 'shreehari-mart-cart',
        partialize: (state) => ({ items: state.items }),
        onRehydrateStorage: () => (state) => {
          if (state && state.items.length > 0) {
            const totals = calculateTotals(state.items);
            state.totalItems = totals.totalItems;
            state.totalAmount = totals.totalAmount;
            state.savings = totals.savings;
          }
        },
      }
    ),
    { name: 'CartStore' }
  )
);

export const cartLineKey = lineKeyFor;

export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotalItems = () =>
  useCartStore((state) => state.totalItems);
export const useCartTotalAmount = () =>
  useCartStore((state) => state.totalAmount);
export const useCartSavings = () => useCartStore((state) => state.savings);
export const useCartExpanded = () => useCartStore((state) => state.isExpanded);
