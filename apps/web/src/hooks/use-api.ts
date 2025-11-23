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

/**
 * Products Hooks
 */

export const useProducts = (
  params?: PaginationParams & { unit?: string; isAvailable?: boolean },
  options?: UseQueryOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getAll(params),
    ...options,
  });
};

export const useProduct = (
  id: string,
  options?: UseQueryOptions<ApiResponse<any>>
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
  options?: UseQueryOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersApi.getAll(params),
    ...options,
  });
};

export const useOrder = (
  id: string,
  options?: UseQueryOptions<ApiResponse<any>>
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
  options?: UseQueryOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => customersApi.getAll(params),
    ...options,
  });
};

export const useCustomer = (
  id: string,
  options?: UseQueryOptions<ApiResponse<any>>
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
  options?: UseQueryOptions<PaginatedResponse<any>>
) => {
  return useQuery({
    queryKey: queryKeys.buildings.list(params),
    queryFn: () => buildingsApi.getAll(params),
    ...options,
  });
};

export const useBuilding = (
  id: string,
  options?: UseQueryOptions<ApiResponse<any>>
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
