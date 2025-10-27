import React from 'react';
import {
  Badge as MantineBadge,
  BadgeProps as MantineBadgeProps,
} from '@mantine/core';

export interface StatusBadgeProps extends Omit<MantineBadgeProps, 'color'> {
  status:
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'pending'
    | 'active'
    | 'inactive';
  customColor?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customColor,
  variant = 'light',
  ...props
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'active':
      case 'delivered':
        return 'green';
      case 'warning':
      case 'pending':
        return 'yellow';
      case 'error':
      case 'cancelled':
        return 'red';
      case 'info':
      case 'processing':
        return 'blue';
      case 'inactive':
        return 'gray';
      case 'shipped':
        return 'cyan';
      default:
        return 'gray';
    }
  };

  const color = customColor || getStatusColor(status);

  return <MantineBadge color={color} variant={variant} {...props} />;
};

// Stock Status Badge specifically for inventory
export interface StockBadgeProps
  extends Omit<MantineBadgeProps, 'color' | 'children'> {
  stock: number;
  lowStockThreshold?: number;
  outOfStockLabel?: string;
  lowStockLabel?: string;
  inStockLabel?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  stock,
  lowStockThreshold = 50,
  outOfStockLabel = 'Out of Stock',
  lowStockLabel = 'Low Stock',
  inStockLabel = 'In Stock',
  variant = 'light',
  ...props
}) => {
  const getStockStatus = () => {
    if (stock === 0) return { color: 'red', label: outOfStockLabel };
    if (stock < lowStockThreshold)
      return { color: 'yellow', label: lowStockLabel };
    return { color: 'green', label: inStockLabel };
  };

  const status = getStockStatus();

  return (
    <MantineBadge color={status.color} variant={variant} {...props}>
      {status.label}
    </MantineBadge>
  );
};
