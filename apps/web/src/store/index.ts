/**
 * State Management Exports
 *
 * Central export point for all Zustand stores and selectors.
 */

export {
  useAppStore,
  useAuth,
  useUser,
  useIsAuthenticated,
  useTheme,
  useSidebarCollapsed,
  useChromeVisible,
} from './app-store';

export {
  useCartStore,
  useCartItems,
  useCartTotalItems,
  useCartTotalAmount,
  useCartSavings,
  useCartExpanded,
} from './cart-store';
export type { CartItem } from './cart-store';

export { useAddressesStore, useDefaultAddress } from './addresses-store';
export type { Address, AddressDraft, AddressLabel } from './addresses-store';
