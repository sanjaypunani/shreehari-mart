import React, { useState, useEffect } from 'react';
import { Stack, Group, Text, Badge, Select } from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconUsers,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BuildingDto, SocietyDto } from '@shreehari/types';
import {
  useBuildings,
  useSocieties,
  useDeleteBuilding,
} from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  ConfirmationModal,
  SearchFilter,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
} from '@shreehari/ui';
import { formatDate } from '@shreehari/utils';

export const BuildingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedSocietyId = searchParams.get('societyId');

  const [selectedSocietyId, setSelectedSocietyId] = useState<string>(
    preSelectedSocietyId || ''
  );
  const [searchValue, setSearchValue] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingDto[]>([]);

  const { data: societies } = useSocieties();
  const {
    data: buildings,
    loading,
    error,
    refetch,
  } = useBuildings(selectedSocietyId || undefined);
  const { deleteBuilding, loading: deleting } = useDeleteBuilding();

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingDto | null>(
    null
  );

  // Filter buildings based on search
  useEffect(() => {
    if (!buildings) {
      setFilteredBuildings([]);
      return;
    }

    if (!searchValue) {
      setFilteredBuildings(buildings);
      return;
    }

    const filtered = buildings.filter(
      (building) =>
        building.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        building.society?.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredBuildings(filtered);
  }, [buildings, searchValue]);

  const handleDeleteBuilding = (building: BuildingDto) => {
    setSelectedBuilding(building);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (!selectedBuilding) return;

    try {
      await deleteBuilding(selectedBuilding.id);
      notifications.show({
        title: 'Success',
        message: 'Building deleted successfully',
        color: 'green',
      });
      refetch();
      setDeleteModalOpened(false);
      setSelectedBuilding(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete building',
        color: 'red',
      });
    }
  };

  const handleViewBuilding = (building: BuildingDto) => {
    // Navigate to building customers page
    navigate(`/customers?buildingId=${building.id}`);
  };

  const handleEditBuilding = (building: BuildingDto) => {
    navigate(`/buildings/${building.id}/edit`);
  };

  const handleAddBuilding = () => {
    if (selectedSocietyId) {
      navigate(`/buildings/new?societyId=${selectedSocietyId}`);
    } else {
      navigate('/buildings/new');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'society') {
      setSelectedSocietyId(value || '');
    }
  };
  const filterOptions: FilterOption[] = [
    {
      key: 'society',
      label: 'Society',
      type: 'select',
      options:
        societies?.map((society) => ({
          value: society.id,
          label: society.name,
        })) || [],
      value: selectedSocietyId,
      placeholder: 'All societies',
    },
  ];

  // Define columns for the DataTable
  const columns: Column<BuildingDto>[] = [
    {
      key: 'name',
      title: 'Building',
      render: (value, record) => (
        <div>
          <Text size="sm" fw={500}>
            Building {value}
          </Text>
          <Text size="xs" c="dimmed">
            ID: {record.id}
          </Text>
        </div>
      ),
    },
    {
      key: 'society',
      title: 'Society',
      render: (value) => (
        <div>
          <Text size="sm" fw={500}>
            {value?.name}
          </Text>
          <Text size="xs" c="dimmed">
            {value?.address}
          </Text>
        </div>
      ),
    },
    {
      key: 'customers',
      title: 'Customers',
      render: (value) => (
        <Group gap="xs">
          <IconUsers size={14} />
          <Badge variant="light" color="green">
            {value?.length || 0} customers
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
  const actions: DataTableAction<BuildingDto>[] = [
    {
      icon: <IconEye size={16} />,
      label: 'View',
      color: 'blue',
      onClick: handleViewBuilding,
    },
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: handleEditBuilding,
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: handleDeleteBuilding,
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Add Building',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: handleAddBuilding,
    },
  ];

  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Buildings Management"
          subtitle="Manage buildings within societies"
          actions={headerActions}
        />
        <Text c="red">Error loading buildings: {error}</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Buildings Management"
        subtitle="Manage buildings within societies"
        actions={headerActions}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search buildings by name or society..."
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={() => {
          setSelectedSocietyId('');
          setSearchValue('');
        }}
      />

      <DataTable
        data={filteredBuildings}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No buildings found"
      />

      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={confirmDelete}
        title="Delete Building"
        message={`Are you sure you want to delete Building "${selectedBuilding?.name}" from ${selectedBuilding?.society?.name}? This action cannot be undone and will affect all associated customers.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        variant="danger"
      />
    </Stack>
  );
};
