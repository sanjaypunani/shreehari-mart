/**
 * Addresses State Management with Zustand
 *
 * Local-only address book persisted to localStorage. The backend currently
 * exposes only a single `address` string on the customer record, so we keep
 * this list client-side for the address-flow UX. Once a real /addresses
 * endpoint exists, swap the actions for API calls.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type AddressLabel = 'Home' | 'Work' | 'Hotel' | 'Other';

export interface Address {
  id: string;
  label: AddressLabel;
  /** Display name for the picked location (e.g. "Koramangala 5th Block") */
  area: string;
  /** Full second line / street + pincode */
  fullAddress: string;
  /** Flat / building line entered by user */
  flat: string;
  landmark?: string;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
}

/**
 * Draft state used while the user picks a pin on the map and then fills
 * the form. Cleared once the address is saved.
 */
export interface AddressDraft {
  area: string;
  fullAddress: string;
  pin: { x: number; y: number };
}

interface AddressesStore {
  addresses: Address[];
  draft: AddressDraft | null;

  setDraft: (draft: AddressDraft | null) => void;
  upsertAddress: (
    address: Omit<Address, 'id' | 'isDefault'> & { id?: string }
  ) => Address;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
  clearAll: () => void;
}

const generateId = () => `addr_${Date.now().toString(36)}_${Math.random()
  .toString(36)
  .slice(2, 7)}`;

const SEED: Address[] = [
  {
    id: 'addr_seed_home',
    label: 'Home',
    area: 'Koramangala 5th Block',
    fullAddress: '80 Feet Road, Koramangala, Bengaluru 560095',
    flat: '142 Willowbrook Lane, Apt 3B',
    landmark: 'Near Forum Mall',
    receiverName: 'Juno Greene',
    receiverPhone: '9876543210',
    isDefault: true,
  },
];

export const useAddressesStore = create<AddressesStore>()(
  devtools(
    persist(
      (set, get) => ({
        addresses: SEED,
        draft: null,

        setDraft: (draft) => set({ draft }),

        upsertAddress: (input) => {
          const { addresses } = get();
          const existing = input.id
            ? addresses.find((a) => a.id === input.id)
            : undefined;

          const next: Address = existing
            ? { ...existing, ...input, id: existing.id }
            : {
                ...input,
                id: input.id || generateId(),
                // First address auto-becomes default
                isDefault: addresses.length === 0,
              };

          const updated = existing
            ? addresses.map((a) => (a.id === next.id ? next : a))
            : [...addresses, next];

          set({ addresses: updated, draft: null });
          return next;
        },

        removeAddress: (id) => {
          const remaining = get().addresses.filter((a) => a.id !== id);
          // If the default was removed, promote the first remaining one
          if (
            remaining.length > 0 &&
            !remaining.some((a) => a.isDefault)
          ) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          set({ addresses: remaining });
        },

        setDefault: (id) =>
          set((state) => ({
            addresses: state.addresses.map((a) => ({
              ...a,
              isDefault: a.id === id,
            })),
          })),

        clearAll: () => set({ addresses: [], draft: null }),
      }),
      {
        name: 'cropzo-addresses',
        partialize: (state) => ({ addresses: state.addresses }),
      }
    ),
    { name: 'addresses-store' }
  )
);

export const useDefaultAddress = () =>
  useAddressesStore(
    (state) =>
      state.addresses.find((a) => a.isDefault) || state.addresses[0] || null
  );
