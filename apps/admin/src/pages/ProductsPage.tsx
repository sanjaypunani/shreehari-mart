import React, { useState, useEffect } from 'react';
import { Group, Text, Stack, Image, Badge } from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCopy,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { ProductDto } from '@shreehari/types';
import {
  useProducts,
  useDeleteProduct,
  useToggleProductAvailability,
  API_BASE_URL,
} from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  SearchFilter,
  PaginationControls,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
} from '@shreehari/ui';
import { formatCurrency, getImageUrl } from '@shreehari/utils';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState({
    unit: '',
    isAvailable: '',
  });

  // API hooks
  const {
    data: productsData,
    loading,
    error,
    refetch,
  } = useProducts(
    page,
    limit,
    searchValue || undefined,
    filters.unit || undefined,
    filters.isAvailable !== '' ? filters.isAvailable === 'true' : undefined
  );
  const { deleteProduct, loading: deleteLoading } = useDeleteProduct();
  const { toggleAvailability, loading: toggleLoading } =
    useToggleProductAvailability();

  const products = productsData?.products || [];
  const total = productsData?.total || 0;
  const totalPages = productsData?.totalPages || 1;

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [searchValue, filters.unit, filters.isAvailable]);

  const handleDeleteProduct = (product: ProductDto) => {
    modals.openConfirmModal({
      title: 'Delete Product',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{product.name}</strong>? This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteProduct(product.id);
          notifications.show({
            title: 'Success',
            message: 'Product deleted successfully',
            color: 'green',
          });
          refetch();
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete product',
            color: 'red',
          });
        }
      },
    });
  };

  const handleToggleAvailability = async (product: ProductDto) => {
    try {
      await toggleAvailability(product.id);
      notifications.show({
        title: 'Success',
        message: `Product ${product.isAvailable ? 'marked unavailable' : 'marked available'}`,
        color: 'green',
      });
      refetch();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update product availability',
        color: 'red',
      });
    }
  };

  const handleViewProduct = (product: ProductDto) => {
    // For now, we'll show a notification. Later we can implement a view modal or detail page
    notifications.show({
      title: 'Product Details',
      message: `Viewing ${product.name} - ₹${product.price} / ${product.quantity}${product.unit}`,
      color: 'blue',
    });
  };

  const handleEditProduct = (product: ProductDto) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleCopyProductList = async () => {
    try {
      // Fetch all available products (no pagination)
      const response = await fetch(
        `${API_BASE_URL}/products?isAvailable=true&limit=1000`
      );
      const data = await response.json();
      console.log('Fetched products for copying:', data);
      const availableProducts = data.data || [];

      if (availableProducts.length === 0) {
        notifications.show({
          title: 'No Products',
          message: 'No available products to copy',
          color: 'orange',
        });
        return;
      }

      // Get current date in Gujarati format
      const today = new Date();
      const day = today.getDate();
      const months = [
        'જાન્યુઆરી',
        'ફેબ્રુઆરી',
        'માર્ચ',
        'એપ્રિલ',
        'મે',
        'જૂન',
        'જુલાઈ',
        'ઓગસ્ટ',
        'સપ્ટેમ્બર',
        'ઓક્ટોબર',
        'નવેમ્બર',
        'ડિસેમ્બર',
      ];
      const month = months[today.getMonth()];
      const year = today.getFullYear();
      const dateStr = `${day} ${month} ${year}`;

      // Format product list
      const productLines = availableProducts
        .map((product: ProductDto) => {
          // Extract only Gujarati name (remove English translation in parentheses)
          const gujaratiName = product.name.split('(')[0].trim();
          const price = `₹${product.price}`;
          const quantity = `${product.quantity}${product.unit}`;
          return `▫️ ${gujaratiName} – ${price} / ${quantity}`;
        })
        .join('\n');

      // Create the full formatted text
      const formattedText = `જય શ્રી કૃષ્ણ • જય સ્વામિનારાયણ 🌸

🥦✨ Shree Hari Mart – તાજા શાકભાજીના ભાવ ✨🥦
📅 🔴 Updated Price : ${dateStr}  🔴


---

${productLines}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(formattedText);

      notifications.show({
        title: 'Success',
        message: `Copied ${availableProducts.length} products to clipboard`,
        color: 'green',
      });
    } catch (error) {
      console.error('Error copying product list:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to copy product list',
        color: 'red',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      unit: '',
      isAvailable: '',
    });
    setSearchValue('');
    setPage(1);
  };

  // Define filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'unit',
      label: 'Unit',
      type: 'select',
      placeholder: 'All units',
      options: [
        { value: 'gm', label: 'Grams (gm)' },
        { value: 'kg', label: 'Kilograms (kg)' },
        { value: 'pc', label: 'Pieces (pc)' },
        { value: 'ltr', label: 'Litres (ltr)' },
        { value: 'ml', label: 'Millilitres (ml)' },
      ],
      value: filters.unit,
    },
    {
      key: 'isAvailable',
      label: 'Availability',
      type: 'select',
      placeholder: 'All products',
      options: [
        { value: 'true', label: 'Available' },
        { value: 'false', label: 'Out of Stock' },
      ],
      value: filters.isAvailable,
    },
  ];

  // Define columns for the DataTable
  const columns: Column<ProductDto>[] = [
    {
      key: 'name',
      title: 'Product',
      render: (value, record) => (
        <Group gap="sm">
          <Image
            src={getImageUrl(record.imageUrl)}
            w={40}
            h={40}
            radius="sm"
            fallbackSrc="https://via.placeholder.com/40"
          />
          <div>
            <Text size="sm" fw={500}>
              {value}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {record.description}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      key: 'unit',
      title: 'Unit',
      render: (value) => <Badge variant="outline">{value.toUpperCase()}</Badge>,
    },
    {
      key: 'price',
      title: 'Price',
      render: (value, record) => (
        <Text fw={500}>
          ₹{value} / {record.quantity}
          {record.unit}
        </Text>
      ),
    },
    {
      key: 'isAvailable',
      title: 'Status',
      render: (value, record) => (
        <Badge
          color={value ? 'green' : 'red'}
          variant="light"
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleAvailability(record)}
        >
          {value ? 'Available' : 'Out of Stock'}
        </Badge>
      ),
    },
  ];

  // Define actions for the DataTable
  const actions: DataTableAction<ProductDto>[] = [
    {
      icon: <IconEye size={16} />,
      label: 'View',
      color: 'blue',
      onClick: handleViewProduct,
    },
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: handleEditProduct,
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: handleDeleteProduct,
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Copy Product List',
      variant: 'outline',
      leftSection: <IconCopy size={16} />,
      onClick: handleCopyProductList,
    },
    {
      label: 'Add Product',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: handleAddProduct,
    },
  ];

  // Show error state
  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Products Management"
          subtitle="Manage product inventory and information"
          actions={headerActions}
        />
        <Text c="red">Error loading products: {error}</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Products Management"
        subtitle="Manage product inventory and information"
        actions={headerActions}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search products by name or description..."
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filtersExpanded={filtersExpanded}
        onToggleFilters={setFiltersExpanded}
      />

      <DataTable
        data={products}
        columns={columns}
        actions={actions}
        loading={loading || deleteLoading || toggleLoading}
        emptyMessage="No products found"
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={loading}
      />
    </Stack>
  );
};
