// Re-export all entities for easy importing (type-only exports for frontend)
export type { Product } from './entities/Product';
export type { Customer } from './entities/Customer';
export type { Order, OrderStatus, PaymentMode } from './entities/Order';
export type { OrderItem } from './entities/OrderItem';
export type {
  OrderPayment,
  PaymentMethod,
  PaymentStatus,
} from './entities/OrderPayment';
export type { Address } from './entities/Address';
export type { Society } from './entities/Society';
export type { Building } from './entities/Building';
export type { Wallet } from './entities/Wallet';
export type {
  WalletTransaction,
  WalletTransactionType,
} from './entities/WalletTransaction';
export type { MonthlyBill } from './entities/MonthlyBill';

// Re-export database utilities (these will be safe now due to the config.ts changes)
export { DatabaseConnection } from './database/connection';
export { AppDataSource, DatabaseConfig } from './database/config';

// Re-export repository classes
export { ProductRepository } from './repositories/ProductRepository';
export { CustomerRepository } from './repositories/CustomerRepository';
export { OrderRepository } from './repositories/OrderRepository';
// export { OrderPaymentRepository } from './repositories/OrderPaymentRepository';
export { SocietyRepository } from './repositories/SocietyRepository';
export { BuildingRepository } from './repositories/BuildingRepository';
export { WalletRepository } from './repositories/WalletRepository';
export { MonthlyBillRepository } from './repositories/MonthlyBillRepository';

// Re-export database service
export { DatabaseService } from './services/DatabaseService';
export { ProductDataMigrationService } from './services/ProductDataMigrationService';
export { MonthlyBillService } from './services/MonthlyBillService';

// Keep existing API functions
import { useState, useEffect } from 'react';
import {
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto,
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  ApiResponse,
  PaginatedResponse,
  SocietyDto,
  CreateSocietyDto,
  UpdateSocietyDto,
  BuildingDto,
  CreateBuildingDto,
  UpdateBuildingDto,
  CustomerDto,
  CreateCustomerDto,
  UpdateCustomerDto,
  WalletDto,
  WalletTransactionDto,
  MonthlyBillDto,
  CreateMonthlyBillDto,
  MonthlyBillingSummaryDto,
  BulkGenerateBillsDto,
  BulkGenerateBillsResponseDto,
  SendInvoiceEmailDto,
  DownloadInvoiceResponseDto,
  BillStatus,
} from '@shreehari/types';

// const API_BASE_URL = 'https://api.shreeharimartindia.in/api';
const API_BASE_URL = 'http://localhost:3000/api';

// Generic API fetch function
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Orders API hooks
export const useOrders = (
  page = 1,
  limit = 10,
  status?: string,
  sortBy?: string,
  sortOrder?: 'ASC' | 'DESC'
) => {
  const [data, setData] = useState<PaginatedResponse<OrderDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        queryParams.append('status', status);
      }

      if (sortBy) {
        queryParams.append('sortBy', sortBy);
      }

      if (sortOrder) {
        queryParams.append('sortOrder', sortOrder);
      }

      const response = await apiCall<PaginatedResponse<OrderDto>>(
        `/orders?${queryParams}`
      );

      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [page, limit, status, sortBy, sortOrder]);

  return { data, loading, error, refetch };
};

export const useOrder = (id: string) => {
  const [data, setData] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<OrderDto>(`/orders/${id}`);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  return { data, loading, error };
};

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderDto): Promise<OrderDto> => {
    try {
      setLoading(true);
      setError(null);
      console.log('orderData:', orderData);
      const response = await apiCall<OrderDto>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

export const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrder = async (
    id: string,
    orderData: UpdateOrderDto | Partial<OrderDto>
  ): Promise<OrderDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<OrderDto>(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateOrder, loading, error };
};

export const useDeleteOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteOrder = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/orders/${id}`, {
        method: 'DELETE',
      });
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrder, loading, error };
};

export const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrderStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'delivered' | 'cancelled',
    notes?: string
  ): Promise<OrderDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<OrderDto>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update order status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderStatus, loading, error };
};

export const useOrderStats = (dateFrom?: string, dateTo?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const response = await apiCall<any>(`/orders/stats?${queryParams}`);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch order stats'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateFrom, dateTo]);

  return { data, loading, error, refetch: fetchStats };
};

// Products API hooks
export const useProducts = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  unit?: string,
  isAvailable?: boolean
) => {
  const [data, setData] = useState<{
    products: ProductDto[];
    total: number;
    totalPages: number;
  }>({ products: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) queryParams.append('search', search);
        if (unit) queryParams.append('unit', unit);
        if (isAvailable !== undefined)
          queryParams.append('isAvailable', isAvailable.toString());

        const response = await apiCall<ProductDto[]>(
          `/products?${queryParams.toString()}`
        );
        setData({
          products: response.data,
          total: (response as any).pagination?.total || response.data.length,
          totalPages: (response as any).pagination?.totalPages || 1,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products'
        );
        setData({ products: [], total: 0, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, search, unit, isAvailable]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useProduct = (id: string) => {
  const [data, setData] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<ProductDto>(`/products/${id}`);
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch product'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { data, loading, error };
};

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (
    productData: CreateProductDto
  ): Promise<ProductDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<ProductDto>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error };
};

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (
    id: string,
    productData: UpdateProductDto
  ): Promise<ProductDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<ProductDto>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
};

export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteProduct, loading, error };
};

export const useToggleProductAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAvailability = async (id: string): Promise<ProductDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<ProductDto>(
        `/products/${id}/availability`,
        {
          method: 'PATCH',
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to toggle product availability';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { toggleAvailability, loading, error };
};

// Society API hooks
export const useSocieties = () => {
  const [data, setData] = useState<SocietyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<SocietyDto[]>('/societies');
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch societies'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useSociety = (id: string) => {
  const [data, setData] = useState<SocietyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<SocietyDto>(`/societies/${id}`);
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch society'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSociety();
    }
  }, [id]);

  return { data, loading, error };
};

export const useCreateSociety = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSociety = async (
    societyData: CreateSocietyDto
  ): Promise<SocietyDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<SocietyDto>('/societies', {
        method: 'POST',
        body: JSON.stringify(societyData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create society';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createSociety, loading, error };
};

export const useUpdateSociety = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSociety = async (
    id: string,
    societyData: UpdateSocietyDto
  ): Promise<SocietyDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<SocietyDto>(`/societies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(societyData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update society';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateSociety, loading, error };
};

export const useDeleteSociety = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSociety = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/societies/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete society';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteSociety, loading, error };
};

// Building API hooks
export const useBuildings = (societyId?: string) => {
  const [data, setData] = useState<BuildingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = societyId ? `?societyId=${societyId}` : '';
        const response = await apiCall<BuildingDto[]>(
          `/buildings${queryParams}`
        );
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch buildings'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [societyId]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useBuilding = (id: string) => {
  const [data, setData] = useState<BuildingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<BuildingDto>(`/buildings/${id}`);
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch building'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBuilding();
    }
  }, [id]);

  return { data, loading, error };
};

export const useCreateBuilding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBuilding = async (
    buildingData: CreateBuildingDto
  ): Promise<BuildingDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<BuildingDto>('/buildings', {
        method: 'POST',
        body: JSON.stringify(buildingData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create building';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createBuilding, loading, error };
};

export const useUpdateBuilding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBuilding = async (
    id: string,
    buildingData: UpdateBuildingDto
  ): Promise<BuildingDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<BuildingDto>(`/buildings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(buildingData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update building';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateBuilding, loading, error };
};

export const useDeleteBuilding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBuilding = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/buildings/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete building';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteBuilding, loading, error };
};

// Enhanced Customer API hooks
export const useCustomers = (
  page = 1,
  limit = 10,
  search?: string,
  societyId?: string,
  buildingId?: string,
  isMonthlyPayment?: boolean
) => {
  const [data, setData] = useState<PaginatedResponse<CustomerDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) queryParams.append('search', search);
        if (societyId) queryParams.append('societyId', societyId);
        if (buildingId) queryParams.append('buildingId', buildingId);
        if (isMonthlyPayment !== undefined)
          queryParams.append('isMonthlyPayment', isMonthlyPayment.toString());

        const response = await apiCall<PaginatedResponse<CustomerDto>>(
          `/customers?${queryParams}`
        );

        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch customers'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, limit, search, societyId, buildingId, isMonthlyPayment]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useCustomer = (id: string) => {
  const [data, setData] = useState<CustomerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<CustomerDto>(`/customers/${id}`);
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch customer'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  return { data, loading, error };
};

export const useCreateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (
    customerData: CreateCustomerDto
  ): Promise<CustomerDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<CustomerDto>('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createCustomer, loading, error };
};

export const useUpdateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCustomer = async (
    id: string,
    customerData: UpdateCustomerDto
  ): Promise<CustomerDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<CustomerDto>(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateCustomer, loading, error };
};

export const useDeleteCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCustomer = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/customers/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteCustomer, loading, error };
};

// Wallet API hooks
export const useCustomerWallet = (customerId: string) => {
  const [data, setData] = useState<WalletDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall<WalletDto>(
          `/customers/${customerId}/wallet`
        );
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchWallet();
    }
  }, [customerId]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const getCustomerWalletById = (customerId: string) => {
  return apiCall<WalletDto>(`/customers/${customerId}/wallet`);
};

export const useWalletTransactions = (
  customerId: string,
  page = 1,
  limit = 20
) => {
  const [data, setData] =
    useState<PaginatedResponse<WalletTransactionDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const response = await apiCall<PaginatedResponse<WalletTransactionDto>>(
          `/customers/${customerId}/wallet/transactions?${queryParams}`
        );

        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch transactions'
        );
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchTransactions();
    }
  }, [customerId, page, limit]);

  return { data, loading, error, refetch: () => setLoading(true) };
};

export const useCreditWallet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const creditWallet = async (
    customerId: string,
    amount: number,
    description: string
  ): Promise<{ wallet: WalletDto; transaction: WalletTransactionDto }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<{
        wallet: WalletDto;
        transaction: WalletTransactionDto;
      }>(`/customers/${customerId}/wallet/credit`, {
        method: 'POST',
        body: JSON.stringify({ amount, description }),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to credit wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { creditWallet, loading, error };
};

export const useDebitWallet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debitWallet = async (
    customerId: string,
    amount: number,
    description: string
  ): Promise<{ wallet: WalletDto; transaction: WalletTransactionDto }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<{
        wallet: WalletDto;
        transaction: WalletTransactionDto;
      }>(`/customers/${customerId}/wallet/debit`, {
        method: 'POST',
        body: JSON.stringify({ amount, description }),
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to debit wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { debitWallet, loading, error };
};

// Analytics hooks
export const useOrderAnalytics = (dateFrom?: string, dateTo?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const response = await apiCall<any>(`/analytics/orders?${queryParams}`);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch order analytics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateFrom, dateTo]);

  return { data, loading, error, refetch: fetchAnalytics };
};

export const useCustomerAnalytics = (dateFrom?: string, dateTo?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const response = await apiCall<any>(
        `/analytics/customers?${queryParams}`
      );
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch customer analytics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateFrom, dateTo]);

  return { data, loading, error, refetch: fetchAnalytics };
};

export const useProductAnalytics = (dateFrom?: string, dateTo?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const response = await apiCall<any>(`/analytics/products?${queryParams}`);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch product analytics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateFrom, dateTo]);

  return { data, loading, error, refetch: fetchAnalytics };
};

export const useDeliveryPlanAnalytics = (
  dateFrom?: string,
  dateTo?: string
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const response = await apiCall<any>(
        `/analytics/delivery-plan?${queryParams}`
      );
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch delivery plan analytics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateFrom, dateTo]);

  return { data, loading, error, refetch: fetchAnalytics };
};

// Monthly Billing API hooks
export const useMonthlyBills = (
  page: number = 1,
  limit: number = 20,
  month?: string,
  status?: string,
  search?: string
) => {
  const [data, setData] = useState<PaginatedResponse<MonthlyBillDto> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (month) queryParams.append('month', month);
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);

      const response = await apiCall<PaginatedResponse<MonthlyBillDto>>(
        `/monthly-billing?${queryParams}`
      );

      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch monthly bills'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [page, limit, month, status, search]);

  return { data, loading, error, refetch };
};

export const useMonthlyBillingSummary = (month?: string) => {
  const [data, setData] = useState<MonthlyBillingSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = month ? `?month=${month}` : '';
      const response = await apiCall<MonthlyBillingSummaryDto>(
        `/monthly-billing/summary${queryParams}`
      );

      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch billing summary'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [month]);

  return { data, loading, error, refetch };
};

export const useMarkBillAsPaid = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markBillAsPaid = async (id: string): Promise<MonthlyBillDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<MonthlyBillDto>(
        `/monthly-billing/${id}/mark-paid`,
        { method: 'PATCH' }
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to mark bill as paid';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { markBillAsPaid, loading, error };
};

export const useMarkBillAsSent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markBillAsSent = async (id: string): Promise<MonthlyBillDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<MonthlyBillDto>(
        `/monthly-billing/${id}/mark-sent`,
        { method: 'PATCH' }
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to mark bill as sent';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { markBillAsSent, loading, error };
};

export const useBulkGenerateBills = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkGenerateBills = async (
    data: BulkGenerateBillsDto
  ): Promise<BulkGenerateBillsResponseDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<BulkGenerateBillsResponseDto>(
        '/monthly-billing/bulk-generate',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate bills';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { bulkGenerateBills, loading, error };
};

export const useDownloadInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadInvoice = async (
    id: string,
    format: 'pdf' | 'excel' = 'pdf'
  ): Promise<DownloadInvoiceResponseDto> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall<DownloadInvoiceResponseDto>(
        `/monthly-billing/${id}/download/${format}`
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to download invoice';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { downloadInvoice, loading, error };
};

export const useSendInvoiceEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInvoiceEmail = async (
    id: string,
    data: SendInvoiceEmailDto
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/monthly-billing/${id}/send-email`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send invoice email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendInvoiceEmail, loading, error };
};

export const useBulkInvoiceAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkInvoiceAction = async (
    action: 'download' | 'email',
    billIds: string[],
    options?: { format?: 'pdf' | 'excel'; emailData?: SendInvoiceEmailDto }
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await apiCall(`/monthly-billing/bulk-${action}`, {
        method: 'POST',
        body: JSON.stringify({ billIds, ...options }),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to ${action} invoices`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { bulkInvoiceAction, loading, error };
};
