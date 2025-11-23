/**
 * Quick Cart Integration Example
 *
 * This file demonstrates how to use the cart in your components
 */

import { useCartStore, useCartItems, useCartTotalItems } from '../store';

// Example 1: Add item to cart from a product component
export function ProductComponent() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: 'tomato-1',
      name: 'Indian Tomato',
      image: '/uploads/products/tomato.jpg',
      price: 41,
      unit: 'gm',
      productQuantity: '500 gm',
      orderedQuantity: 500,
      baseQuantity: 250,
      basePrice: 20.5,
      baseUnit: 'gm',
      isAvailable: true,
    });
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}

// Example 2: Display cart count in header
export function HeaderCartIcon() {
  const totalItems = useCartTotalItems();

  return (
    <div>
      Cart
      {totalItems > 0 && <span>{totalItems}</span>}
    </div>
  );
}

// Example 3: Access full cart state
export function CartSummary() {
  const { items, totalAmount, clearCart } = useCartStore();

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      <p>Total: ₹{totalAmount}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

// Example 4: Update item quantity
export function CartItemQuantity({
  itemId,
  currentQuantity,
}: {
  itemId: string;
  currentQuantity: number;
}) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <div>
      <button onClick={() => updateQuantity(itemId, currentQuantity - 1)}>
        -
      </button>
      <span>{currentQuantity}</span>
      <button onClick={() => updateQuantity(itemId, currentQuantity + 1)}>
        +
      </button>
    </div>
  );
}

// Example 5: Remove item from cart
export function RemoveItemButton({ itemId }: { itemId: string }) {
  const removeItem = useCartStore((state) => state.removeItem);

  return <button onClick={() => removeItem(itemId)}>Remove</button>;
}

// Example 6: Toggle cart expanded state
export function CartToggle() {
  const { isExpanded, toggleExpanded } = useCartStore();

  return (
    <button onClick={toggleExpanded}>
      {isExpanded ? 'Collapse Cart' : 'Expand Cart'}
    </button>
  );
}
