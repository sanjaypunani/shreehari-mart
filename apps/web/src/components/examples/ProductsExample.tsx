/**
 * Example: Products List Component
 *
 * Demonstrates how to use TanStack Query hooks and Zustand store.
 * This is a reference implementation - copy and modify as needed.
 */

'use client';

import { useState } from 'react';
import {
  Stack,
  Button,
  Group,
  Text,
  Card,
  Badge,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import {
  useProducts,
  useDeleteProduct,
  useToggleProductAvailability,
} from '@/hooks/use-api';
import { useAppStore } from '@/store';

export default function ProductsExample() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Get UI state from Zustand
  const theme = useAppStore((state) => state.ui.theme);
  const user = useAppStore((state) => state.auth.user);

  // Fetch products using TanStack Query
  const { data, isLoading, error, refetch } = useProducts(
    { page, limit: 20, search },
    {
      // Optional: Configure query options
      staleTime: 1000 * 60 * 5, // 5 minutes
      // refetchInterval: 1000 * 30, // Refetch every 30 seconds
    }
  );

  // Delete mutation
  const deleteProduct = useDeleteProduct({
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
      });
      refetch(); // Refetch products after deletion
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  // Toggle availability mutation
  const toggleAvailability = useToggleProductAvailability({
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Product availability updated',
        color: 'blue',
      });
    },
  });

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(productId);
    }
  };

  const handleToggle = (productId: string) => {
    toggleAvailability.mutate(productId);
  };

  // Loading state
  if (isLoading) {
    return <Text>Loading products...</Text>;
  }

  // Error state
  if (error) {
    return (
      <Stack>
        <Text c="red">Error: {error.message}</Text>
        <Button onClick={() => refetch()}>Retry</Button>
      </Stack>
    );
  }

  const products = data?.data || [];
  const total = data?.total || 0;

  return (
    <Stack gap="md">
      {/* Header with user info from Zustand */}
      <Group justify="space-between">
        <div>
          <Text size="xl" fw={700}>
            Products
          </Text>
          <Text size="sm" c="dimmed">
            Total: {total} products | Theme: {theme} | User:{' '}
            {user?.name || 'Guest'}
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />}>Add Product</Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Search products..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to first page on search
        }}
      />

      {/* Products List */}
      <Stack gap="sm">
        {products.length === 0 ? (
          <Text c="dimmed">No products found</Text>
        ) : (
          products.map((product: any) => (
            <Card key={product.id} shadow="sm" padding="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text fw={500}>{product.name}</Text>
                  <Text size="sm" c="dimmed">
                    {product.description}
                  </Text>
                  <Text size="sm" mt="xs">
                    ₹{product.price} / {product.quantity}
                    {product.unit}
                  </Text>
                </div>
                <Group gap="xs">
                  <Badge
                    color={product.isAvailable ? 'green' : 'red'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggle(product.id)}
                  >
                    {product.isAvailable ? 'Available' : 'Out of Stock'}
                  </Badge>
                  <Button
                    size="xs"
                    color="red"
                    onClick={() => handleDelete(product.id)}
                    loading={deleteProduct.isPending}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>
            </Card>
          ))
        )}
      </Stack>

      {/* Pagination */}
      <Group justify="center" mt="md">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Text>
          Page {page} of {data?.totalPages || 1}
        </Text>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (data?.totalPages || 1)}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
}
