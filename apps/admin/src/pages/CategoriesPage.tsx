import React, { useState } from 'react';
import { Text, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import type { CategoryDto } from '@shreehari/types';
import {
  useCategories,
  useDeleteCategory,
  useReorderCategories,
} from '@shreehari/data-access';
import {
  PageHeader,
  SearchFilter,
  type PageHeaderAction,
} from '@shreehari/ui';
import { DnDStatusBanner } from '../components/categories/DnDStatusBanner';
import { SortableCategoryList } from '../components/categories/SortableCategoryList';

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
  const { reorderCategories, loading: reorderLoading } = useReorderCategories();

  // Client-side filtering by name
  const filteredCategories = (categoriesData ?? []).filter((cat) =>
    cat.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // DnD is disabled when search is active
  const isDndDisabled = searchValue.trim() !== '';

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

  const handleReorder = async (ids: string[]) => {
    await reorderCategories({ ids });
    refetch();
  };

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

      <DnDStatusBanner visible={isDndDisabled} />

      <SortableCategoryList
        categories={filteredCategories}
        onReorder={handleReorder}
        loading={loading || deleteLoading || reorderLoading}
        isDndDisabled={isDndDisabled}
        onEdit={(id) => navigate(`/categories/${id}/edit`)}
        onDelete={handleDeleteCategory}
      />
    </Stack>
  );
};
