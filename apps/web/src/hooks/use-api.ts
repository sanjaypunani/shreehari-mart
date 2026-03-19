/**
 * React Query Hooks
 *
 * Custom hooks that combine TanStack Query with API services.
 * These hooks provide data fetching, caching, and mutation capabilities.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { queryKeys } from '../lib/query-client';
import {
  productsApi,
  ordersApi,
  customersApi,
  buildingsApi,
  authApi,
} from '../lib/api/services';
import type {
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '../lib/api/services';
import React from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useCartStore } from '../store/cart-store';
import { calculateItemPrice } from '../utils/index';
import { toApiAssetUrl } from '../config/api';

type QueryHookOptions<TData> = Omit<
  UseQueryOptions<TData>,
  'queryKey' | 'queryFn'
>;

/**
 * Products Hooks
 */

export const useProducts = (
  params?: PaginationParams & { unit?: string; isAvailable?: boolean },
  options?: QueryHookOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getAll(params),
    ...options,
  });
};

export const useProduct = (
  id: string,
  options?: QueryHookOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateProduct = (
  options?: UseMutationOptions<ApiResponse<any>, Error, any>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    ...options,
  });
};

export const useUpdateProduct = (
  options?: UseMutationOptions<
    ApiResponse<any>,
    Error,
    { id: string; data: any }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific product and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    ...options,
  });
};

export const useDeleteProduct = (
  options?: UseMutationOptions<ApiResponse<void>, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    ...options,
  });
};

export const useToggleProductAvailability = (
  options?: UseMutationOptions<ApiResponse<any>, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.toggleAvailability,
    onSuccess: (_, id) => {
      // Invalidate specific product and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    ...options,
  });
};

/**
 * Orders Hooks
 */

export const useOrders = (
  params?: PaginationParams & { status?: string; customerId?: string },
  options?: QueryHookOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersApi.getAll(params),
    ...options,
  });
};

export const useOrder = (
  id: string,
  options?: QueryHookOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateOrder = (
  options?: UseMutationOptions<ApiResponse<any>, Error, any>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    ...options,
  });
};

export const useUpdateOrder = (
  options?: UseMutationOptions<
    ApiResponse<any>,
    Error,
    { id: string; data: any }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => ordersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    ...options,
  });
};

export const useUpdateOrderStatus = (
  options?: UseMutationOptions<
    ApiResponse<any>,
    Error,
    { id: string; status: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => ordersApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    ...options,
  });
};

/**
 * Customers Hooks
 */

export const useCustomers = (
  params?: PaginationParams,
  options?: QueryHookOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => customersApi.getAll(params),
    ...options,
  });
};

export const useCustomer = (
  id: string,
  options?: QueryHookOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateCustomer = (
  options?: UseMutationOptions<ApiResponse<any>, Error, any>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
    },
    ...options,
  });
};

/**
 * Buildings Hooks
 */

export const useBuildings = (
  params?: PaginationParams,
  options?: QueryHookOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.buildings.list(params),
    queryFn: () => buildingsApi.getAll(params),
    ...options,
  });
};

export const useBuilding = (
  id: string,
  options?: QueryHookOptions<ApiResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.buildings.detail(id),
    queryFn: () => buildingsApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateBuilding = (
  options?: UseMutationOptions<ApiResponse<any>, Error, any>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buildingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings.lists() });
    },
    ...options,
  });
};

/**
 * Auth Hooks
 */

export const useLogin = (
  options?: UseMutationOptions<
    ApiResponse<{ user: any; token: string }>,
    Error,
    { email: string; password: string }
  >
) => {
  return useMutation({
    mutationFn: authApi.login,
    ...options,
  });
};

export const useRegister = (
  options?: UseMutationOptions<
    ApiResponse<{ user: any; token: string }>,
    Error,
    any
  >
) => {
  return useMutation({
    mutationFn: authApi.register,
    ...options,
  });
};

export const useLogout = (
  options?: UseMutationOptions<ApiResponse<void>, Error, void>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
    ...options,
  });
};

export const useCurrentUser = (options?: UseQueryOptions<ApiResponse<any>>) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    ...options,
  });
};

/**
 * Reorder Hook
 *
 * Encapsulates the async reorder logic shared across all surfaces
 * (Account page, Order List page, Order Detail page).
 *
 * @param multiOrder - When true, tracks loading per order ID instead of a boolean flag.
 */

interface ReorderOrderItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
}

interface ReorderOrder {
  id: string;
  items?: ReorderOrderItem[];
}

export function useReorder(multiOrder?: boolean) {
  const router = useRouter();
  const [isReordering, setIsReordering] = React.useState(false);
  const [reorderingOrderId, setReorderingOrderId] = React.useState<string | null>(null);
  const [confirmOpen, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const pendingOrderRef = React.useRef<ReorderOrder | null>(null);

  const executeReorder = async (order: ReorderOrder) => {
    const validItems = (order.items ?? []).filter((item) => !!item.productId);

    if (validItems.length === 0) {
      notifications.show({
        color: 'red',
        title: 'Unable to reorder',
        message: 'None of the items could be added. They may be unavailable.',
        autoClose: 5000,
      });
      return;
    }

    if (multiOrder) {
      setReorderingOrderId(order.id);
    } else {
      setIsReordering(true);
    }

    try {
      const results = await Promise.allSettled(
        validItems.map((item) => productsApi.getById(item.productId))
      );

      const addedItems: string[] = [];
      const skippedNames: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          skippedNames.push(validItems[index].productName);
          return;
        }

        const rawProduct =
          (result.value as any)?.data?.data ??
          (result.value as any)?.data ??
          result.value;

        if (!rawProduct || rawProduct.isAvailable === false) {
          skippedNames.push(validItems[index].productName);
          return;
        }

        const basePrice = Number(rawProduct.price || 0);
        const baseQuantity = Number(rawProduct.quantity || 1);
        const baseUnit = (rawProduct.unit || validItems[index].unit) as 'gm' | 'kg' | 'pc';
        const orderedQty =
          Number(validItems[index].orderedQuantity) > 0
            ? Number(validItems[index].orderedQuantity)
            : baseQuantity;

        const itemPrice = calculateItemPrice(
          orderedQty,
          validItems[index].unit,
          basePrice,
          baseQuantity,
          baseUnit
        );

        useCartStore.getState().addItem({
          id: rawProduct.id,
          name: rawProduct.name,
          image: toApiAssetUrl(rawProduct.imageUrl),
          price: itemPrice,
          quantity: 1,
          orderedQuantity: orderedQty,
          unit: validItems[index].unit,
          productQuantity: `${orderedQty} ${validItems[index].unit}`,
          baseQuantity,
          basePrice,
          baseUnit,
          isAvailable: true,
          selectedVariant: `${orderedQty}${validItems[index].unit}`,
        });

        addedItems.push(rawProduct.name);
      });

      if (addedItems.length === 0) {
        notifications.show({
          color: 'red',
          title: 'Unable to reorder',
          message: 'None of the items could be added. They may be unavailable.',
          autoClose: 5000,
        });
        return;
      }

      if (skippedNames.length > 0) {
        notifications.show({
          color: 'yellow',
          title: 'Some items were unavailable',
          message: `The following items could not be added: ${skippedNames.join(', ')}.`,
          autoClose: 6000,
        });
      } else {
        notifications.show({
          color: 'green',
          title: 'Added to cart',
          message: 'Items from this order were added to your cart.',
          autoClose: 3000,
        });
      }

      router.push('/cart');
    } finally {
      if (multiOrder) {
        setReorderingOrderId(null);
      } else {
        setIsReordering(false);
      }
    }
  };

  const handleReorder = (order: ReorderOrder) => {
    if (!order.items?.length || (multiOrder ? !!reorderingOrderId : isReordering)) return;
    const cartItems = useCartStore.getState().items;
    if (cartItems.length > 0) {
      pendingOrderRef.current = order;
      openConfirm();
    } else {
      executeReorder(order);
    }
  };

  const handleConfirmReorder = () => {
    useCartStore.getState().clearCart();
    if (pendingOrderRef.current) {
      executeReorder(pendingOrderRef.current);
      pendingOrderRef.current = null;
    }
  };

  return {
    handleReorder,
    handleConfirmReorder,
    isReordering,
    reorderingOrderId,
    confirmOpen,
    closeConfirm,
  };
}
