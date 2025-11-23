/**
 * API Service Modules
 *
 * Centralized API functions organized by resource.
 * These functions use the configured axios client.
 */

import { apiClient } from '../api-client';

/**
 * Generic API Response Type
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Products API Service
 */
export const productsApi = {
  /**
   * Get all products with pagination and filters
   */
  getAll: async (
    params?: PaginationParams & { unit?: string; isAvailable?: boolean }
  ) => {
    const response = await apiClient.get<PaginatedResponse<any>>('/products', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product
   */
  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/products', data);
    return response.data;
  },

  /**
   * Update a product
   */
  update: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/products/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a product
   */
  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/products/${id}`
    );
    return response.data;
  },

  /**
   * Toggle product availability
   */
  toggleAvailability: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/products/${id}/availability`
    );
    return response.data;
  },
};

/**
 * Orders API Service
 */
export const ordersApi = {
  getAll: async (
    params?: PaginationParams & { status?: string; customerId?: string }
  ) => {
    const response = await apiClient.get<PaginatedResponse<any>>('/orders', {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/orders', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/orders/${id}`,
      data
    );
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/orders/${id}/status`,
      { status }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/orders/${id}`);
    return response.data;
  },
};

/**
 * Customers API Service
 */
export const customersApi = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<any>>('/customers', {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/customers/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/customers', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/customers/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/customers/${id}`
    );
    return response.data;
  },
};

/**
 * Buildings API Service
 */
export const buildingsApi = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<any>>('/buildings', {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/buildings/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/buildings', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/buildings/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/buildings/${id}`
    );
    return response.data;
  },
};

/**
 * Auth API Service
 */
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post<
      ApiResponse<{ user: any; token: string }>
    >('/auth/login', credentials);
    return response.data;
  },

  register: async (data: any) => {
    const response = await apiClient.post<
      ApiResponse<{ user: any; token: string }>
    >('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response =
      await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data;
  },
};
