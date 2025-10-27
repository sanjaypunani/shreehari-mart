import React from 'react';
import { Table, Badge, Button, Group } from '@mantine/core';
import { OrderDto } from '@shreehari/types';
import { formatCurrency, formatDate } from '@shreehari/utils';

interface OrdersTableProps {
  orders: OrderDto[];
  onEdit?: (order: OrderDto) => void;
  onView?: (order: OrderDto) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onEdit,
  onView,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'red';
      case 'processing':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const rows = orders.map((order) => (
    <Table.Tr key={order.id}>
      <Table.Td>{order.id}</Table.Td>
      <Table.Td>{order.customerName}</Table.Td>
      <Table.Td>{formatCurrency(order.total)}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(order.status)} size="sm">
          {order.status}
        </Badge>
      </Table.Td>
      <Table.Td>{formatDate(order.createdAt)}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Button size="xs" variant="light" onClick={() => onView?.(order)}>
            View
          </Button>
          <Button size="xs" onClick={() => onEdit?.(order)}>
            Edit
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Order ID</Table.Th>
          <Table.Th>Customer</Table.Th>
          <Table.Th>Total</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
