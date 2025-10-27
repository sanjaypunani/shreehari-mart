import { OrderDto } from '@shreehari/types';

export interface OrderFeatureProps {
  orders: OrderDto[];
  loading?: boolean;
  onCreateOrder?: (order: Partial<OrderDto>) => void;
  onUpdateOrder?: (id: string, order: Partial<OrderDto>) => void;
  onDeleteOrder?: (id: string) => void;
}

export const orderFeatureConfig = {
  name: 'orders',
  displayName: 'Orders Management',
  description: 'Manage customer orders and order processing',
  permissions: ['orders:read', 'orders:write', 'orders:delete'],
};

export * from './OrdersTable';
export * from './OrderForm';
export * from './OrderDetails';
