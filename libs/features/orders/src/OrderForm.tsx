import React from 'react';
import {
  TextInput,
  Select,
  Button,
  Group,
  Stack,
  NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { CreateOrderDto } from '@shreehari/types';

interface OrderFormProps {
  onSubmit: (order: CreateOrderDto) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  loading,
}) => {
  const form = useForm<CreateOrderDto>({
    initialValues: {
      customerId: '',
      customerName: '',
      customerEmail: '',
      items: [],
      status: 'pending',
    },
    validate: {
      customerName: (value) => (!value ? 'Customer name is required' : null),
      customerEmail: (value) => (!value ? 'Customer email is required' : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Customer Name"
          placeholder="Enter customer name"
          {...form.getInputProps('customerName')}
        />

        <TextInput
          label="Customer Email"
          placeholder="Enter customer email"
          type="email"
          {...form.getInputProps('customerEmail')}
        />

        <Select
          label="Status"
          data={[
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          {...form.getInputProps('status')}
        />

        <Group justify="end" mt="md">
          <Button variant="light" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Order
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
