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

export interface AuthCustomerProfile {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  societyId: string;
  buildingId: string;
  flatNumber: string;
  deliveryInstructions?: string | null;
  isMonthlyPayment: boolean;
  society?: {
    id: string;
    name: string;
  } | null;
  building?: {
    id: string;
    name: string;
    societyId: string;
  } | null;
}

export interface AuthUserProfile {
  id: string;
  role: string;
  mobileNumber: string;
  email?: string | null;
  name: string;
  customerId: string | null;
}

export interface AuthProfilePayload {
  requiresSignup: boolean;
  user: AuthUserProfile;
  customer: AuthCustomerProfile | null;
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

  getWallet: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/customers/${id}/wallet`
    );
    return response.data;
  },

  getWalletTransactions: async (
    id: string,
    params?: Pick<PaginationParams, 'page' | 'limit'>
  ) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      `/customers/${id}/wallet/transactions`,
      { params }
    );
    return response.data;
  },
};

/**
 * Buildings API Service
 */
export const buildingsApi = {
  getAll: async (params?: PaginationParams & { societyId?: string }) => {
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
 * Societies API Service
 */
export const societiesApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/societies');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/societies/${id}`);
    return response.data;
  },
};

/**
 * Monthly Billing API Service
 */
export const monthlyBillingApi = {
  getAll: async (
    params?: PaginationParams & {
      month?: string;
      status?: 'draft' | 'sent' | 'paid' | 'overdue';
      customerId?: string;
    }
  ) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      '/monthly-billing',
      { params }
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/monthly-billing/${id}`
    );
    return response.data;
  },
};

/**
 * Auth API Service
 */
export const authApi = {
  requestOtp: async (data: { mobileNumber: string }) => {
    const response = await apiClient.post<
      ApiResponse<{
        requestId: string;
        mobileNumber: string;
        expiresAt: string;
        otp?: string;
        isRegisteredCustomer: boolean;
      }>
    >('/auth/request-otp', data);
    return response.data;
  },

  verifyOtp: async (data: { mobileNumber: string; otp: string }) => {
    const response = await apiClient.post<
      ApiResponse<{
        token: string;
        requiresSignup: boolean;
        user: AuthUserProfile;
        customer: AuthCustomerProfile | null;
      }>
    >('/auth/verify-otp', data);
    return response.data;
  },

  completeSignup: async (data: {
    name: string;
    email: string;
    societyId: string;
    buildingId: string;
    flatNumber: string;
  }) => {
    const response = await apiClient.post<
      ApiResponse<{
        token: string;
        requiresSignup: boolean;
        user: AuthUserProfile;
        customer: AuthCustomerProfile | null;
      }>
    >('/auth/complete-signup', data);
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get<ApiResponse<AuthProfilePayload>>(
      '/auth/me'
    );
    return response.data;
  },

  updateProfile: async (data: {
    name: string;
    email: string;
    societyId: string;
    buildingId: string;
    flatNumber: string;
    deliveryInstructions?: string;
  }) => {
    const response = await apiClient.put<
      ApiResponse<{
        user: AuthUserProfile;
        customer: AuthCustomerProfile;
      }>
    >('/auth/profile', data);
    return response.data;
  },

  login: async (_credentials: { email: string; password: string }) => {
    throw new Error(
      'Password login is not enabled. Please use mobile OTP authentication.'
    );
  },

  register: async (_data: any) => {
    throw new Error(
      'Registration is not enabled from this flow. Please contact support.'
    );
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }

    return {
      success: true,
      data: undefined,
      message: 'Logged out successfully',
    } as ApiResponse<void>;
  },
};
