import React, { useState, useEffect } from 'react';
import { Stack, Group, Text, Badge } from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconBuilding,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { SocietyDto } from '@shreehari/types';
import { useSocieties, useDeleteSociety } from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  ConfirmationModal,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
} from '@shreehari/ui';
import { formatDate } from '@shreehari/utils';

export const SocietiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: societies, loading, error, refetch } = useSocieties();
  const { deleteSociety, loading: deleting } = useDeleteSociety();

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState<SocietyDto | null>(
    null
  );

  const handleDeleteSociety = (society: SocietyDto) => {
    setSelectedSociety(society);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!selectedSociety) return;

    try {
      await deleteSociety(selectedSociety.id);
      notifications.show({
        title: 'Success',
        message: 'Society deleted successfully',
        color: 'green',
      });
      refetch();
      setDeleteModalOpened(false);
      setSelectedSociety(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete society',
        color: 'red',
      });
    }
  };

  const handleViewSociety = (society: SocietyDto) => {
    // Navigate to buildings page filtered by this society
    navigate(`/buildings?societyId=${society.id}`);
  };

  const handleEditSociety = (society: SocietyDto) => {
    navigate(`/societies/${society.id}/edit`);
  };

  const handleAddSociety = () => {
    navigate('/societies/new');
  };

  // Define columns for the DataTable
  const columns: Column<SocietyDto>[] = [
    {
      key: 'name',
      title: 'Society Name',
      render: (value, record) => (
        <div>
          <Text size="sm" fw={500}>
            {value}
          </Text>
          <Text size="xs" c="dimmed">
            ID: {record.id}
          </Text>
        </div>
      ),
    },
    {
      key: 'address',
      title: 'Address',
      render: (value) => (
        <Text size="sm" lineClamp={2}>
          {value}
        </Text>
      ),
    },
    {
      key: 'buildings',
      title: 'Buildings',
      render: (value) => (
        <Group gap="xs">
          <IconBuilding size={14} />
          <Badge variant="light" color="blue">
            {value?.length || 0} buildings
          </Badge>
        </Group>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (value) => <Text size="sm">{formatDate(value)}</Text>,
    },
  ];

  // Define actions for the DataTable
  const actions: DataTableAction<SocietyDto>[] = [
    {
      icon: <IconEye size={16} />,
      label: 'View',
      color: 'blue',
      onClick: handleViewSociety,
    },
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: handleEditSociety,
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: handleDeleteSociety,
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Add Society',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: handleAddSociety,
    },
  ];

  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Societies Management"
          subtitle="Manage housing societies and complexes"
          actions={headerActions}
        />
        <Text c="red">Error loading societies: {error}</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Societies Management"
        subtitle="Manage housing societies and complexes"
        actions={headerActions}
      />

      <DataTable
        data={societies}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No societies found"
      />

      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={confirmDelete}
        title="Delete Society"
        message={`Are you sure you want to delete "${selectedSociety?.name}"? This action cannot be undone and will affect all associated buildings and customers.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        variant="danger"
      />
    </Stack>
  );
};
