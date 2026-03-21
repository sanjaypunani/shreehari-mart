import React, { useState } from 'react';
import { Group, Text, Stack, Image, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { CategoryDto } from '@shreehari/types';
import { useCategories, useDeleteCategory } from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  SearchFilter,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
} from '@shreehari/ui';
import { getImageUrl } from '@shreehari/utils';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // API hooks
  const {
    data: categoriesData,
    loading,
    error,
    refetch,
  } = useCategories();
  const { deleteCategory, loading: deleteLoading } = useDeleteCategory();

  // Client-side filtering by name
  const filteredCategories = (categoriesData ?? []).filter((cat) =>
    cat.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDeleteCategory = (category: CategoryDto) => {
    modals.openConfirmModal({
      title: 'Delete Category',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{category.name}</strong>?
          Products in this category will become uncategorized. This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteCategory(category.id);
          notifications.show({
            title: 'Success',
            message: 'Category deleted successfully',
            color: 'green',
          });
          refetch();
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete category',
            color: 'red',
          });
        }
      },
    });
  };

  // Define columns for the DataTable
  const columns: Column<CategoryDto>[] = [
    {
      key: 'imageUrl',
      title: 'Image',
      render: (value) => (
        <Image
          src={getImageUrl(value)}
          w={48}
          h={48}
          radius="sm"
          fallbackSrc="https://via.placeholder.com/48"
        />
      ),
    },
    {
      key: 'name',
      title: 'Name',
      render: (value) => (
        <Text size="sm" fw={500}>
          {value}
        </Text>
      ),
    },
    {
      key: 'productCount',
      title: 'Products',
      render: (value) => (
        <Badge variant="outline">{value ?? 0}</Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      render: (value) => (
        <Text size="sm" c="dimmed">
          {new Date(value).toLocaleDateString('en-IN')}
        </Text>
      ),
    },
  ];

  // Define actions for the DataTable
  const actions: DataTableAction<CategoryDto>[] = [
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: (category) => navigate(`/categories/${category.id}/edit`),
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: handleDeleteCategory,
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'New Category',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: () => navigate('/categories/new'),
    },
  ];

  // Show error state
  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Categories"
          subtitle="Manage product categories"
          actions={headerActions}
        />
        <Text c="red">Error loading categories: {error}</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Categories"
        subtitle="Manage product categories"
        actions={headerActions}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search categories by name..."
        filters={[]}
        onFilterChange={() => {}}
        onClearFilters={() => setSearchValue('')}
        filtersExpanded={filtersExpanded}
        onToggleFilters={setFiltersExpanded}
      />

      <DataTable
        data={filteredCategories}
        columns={columns}
        actions={actions}
        loading={loading || deleteLoading}
        emptyMessage="No categories found"
      />
    </Stack>
  );
};
