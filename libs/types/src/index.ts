export interface OrderDto {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerSociety?: string;
  customerMobileNumber?: string;
  customerFlatNumber?: string;
  deliveryDate?: string;
  items: OrderItemDto[];
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentMode: 'wallet' | 'monthly' | 'cod';
  totalAmount: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
  pricePerBaseUnit: number;
  baseQuantity: number;
  finalPrice: number;
  // Legacy fields for backward compatibility
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
}

export interface OrderPaymentDto {
  id: string;
  orderId: string;
  amount: number;
  method: 'wallet' | 'monthly' | 'cod';
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
}

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDto {
  id: string;
  societyId: string;
  buildingId: string;
  name: string;
  email: string;
  phone?: string;
  mobileNumber: string;
  flatNumber: string;
  isMonthlyPayment: boolean;
  address?: AddressDto;
  society?: SocietyDto;
  building?: BuildingDto;
  wallet?: WalletDto;
  orders?: OrderDto[];
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDto {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Society DTOs
export interface SocietyDto {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocietyDto {
  name: string;
  address: string;
}

export interface UpdateSocietyDto extends Partial<CreateSocietyDto> {}

// Building DTOs
export interface BuildingDto {
  id: string;
  societyId: string;
  name: string;
  society?: SocietyDto;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuildingDto {
  societyId: string;
  name: string;
}

export interface UpdateBuildingDto extends Partial<CreateBuildingDto> {}

// Wallet DTOs
export interface WalletDto {
  id: string;
  customerId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransactionDto {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
}

export interface CreateWalletTransactionDto {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

export interface CreateOrderDto {
  customerId: string;
  items: CreateOrderItemDto[];
  notes?: string;
  deliveryDate: string;
  discount?: number;
}

export interface CreateOrderItemDto {
  productId: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
}

export interface UpdateOrderDto {
  deliveryDate?: string;
  discount?: number;
  notes?: string;
  items?: CreateOrderItemDto[];
}

export interface CreateProductDto {
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description?: string;
  imageUrl?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isAvailable?: boolean;
}

export interface CreateCustomerDto {
  societyId: string;
  buildingId: string;
  name: string;
  email: string;
  phone?: string;
  mobileNumber: string;
  flatNumber: string;
  isMonthlyPayment?: boolean;
  address?: AddressDto;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Monthly Billing DTOs
export interface MonthlyBillDto {
  id: string;
  customerId: string;
  customer: CustomerDto;
  billNumber: string;
  billingPeriod: {
    month: string; // YYYY-MM format
    year: number;
  };
  orders: OrderDto[];
  orderCount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate?: string;
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMonthlyBillDto {
  customerId: string;
  billingPeriod: {
    month: string; // YYYY-MM format
    year: number;
  };
  orderIds: string[];
}

export interface MonthlyBillingSummaryDto {
  billCount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalAmount: number;
}

export interface BulkGenerateBillsDto {
  billingPeriod: {
    month: string; // YYYY-MM format
    year: number;
  };
}

export interface BulkGenerateBillsResponseDto {
  generated: number;
  errors?: string[];
}

export interface SendInvoiceEmailDto {
  emailAddress?: string;
  customMessage?: string;
}

export interface DownloadInvoiceResponseDto {
  downloadUrl: string;
  filename: string;
}

export type BillStatus = 'draft' | 'sent' | 'paid' | 'overdue';
