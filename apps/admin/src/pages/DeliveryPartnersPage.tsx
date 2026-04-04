import React, { useState, useMemo } from 'react';
import { Stack, Text, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { DeliveryPartnerDto } from '@shreehari/types';
import {
  useDeliveryPartners,
  useDeleteDeliveryPartner,
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

export function DeliveryPartnersPage() {
  const navigate = useNavigate();

  // Search and filter states
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Delete modal state
  const [deletePartnerId, setDeletePartnerId] = useState<string | null>(null);
  const [deletePartnerName, setDeletePartnerName] = useState('');

  // API hooks
  const { data: partners, loading, error, refetch } = useDeliveryPartners();
  const { deleteDeliveryPartner, loading: deleting } =
    useDeleteDeliveryPartner();

  // Client-side filtering
  const filteredPartners = useMemo(() => {
    return (partners ?? []).filter((partner) => {
      // Search filter
      const search = searchValue.toLowerCase();
      const matchesSearch =
        !search ||
        partner.name.toLowerCase().includes(search) ||
        partner.mobileNumber.toLowerCase().includes(search);

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'active') {
        matchesStatus = partner.isActive === true;
      } else if (statusFilter === 'inactive') {
        matchesStatus = partner.isActive === false;
      }

      return matchesSearch && matchesStatus;
    });
  }, [partners, searchValue, statusFilter]);

  const handleDeletePartner = (partner: DeliveryPartnerDto) => {
    setDeletePartnerId(partner.id);
    setDeletePartnerName(partner.name);
  };

  const confirmDelete = async () => {
    if (deletePartnerId) {
      try {
        await deleteDeliveryPartner(deletePartnerId);
        setDeletePartnerId(null);
        setDeletePartnerName('');
        refetch();
        notifications.show({
          title: 'Success',
          message: 'Delivery partner deleted successfully',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete delivery partner',
          color: 'red',
        });
      }
    }
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      value: statusFilter,
      placeholder: 'All',
    },
  ];

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'status') {
      setStatusFilter(value || '');
    }
  };

  // DataTable columns
  const columns: Column<DeliveryPartnerDto>[] = [
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
      key: 'mobileNumber',
      title: 'Mobile Number',
      render: (value) => <Text size="sm">{value}</Text>,
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => (
        <Badge variant="light" color={value ? 'green' : 'gray'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  // DataTable actions
  const actions: DataTableAction<DeliveryPartnerDto>[] = [
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: (partner) => navigate(`/delivery-partners/${partner.id}/edit`),
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: handleDeletePartner,
    },
  ];

  // Header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Add Delivery Partner',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: () => navigate('/delivery-partners/new'),
    },
  ];

  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Delivery Partners"
          subtitle="Manage delivery partners and their availability"
          actions={headerActions}
        />
        <Text c="red">Error loading delivery partners: {error}</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Delivery Partners"
        subtitle="Manage delivery partners and their availability"
        actions={headerActions}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search by name or mobile number..."
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={() => {
          setSearchValue('');
          setStatusFilter('');
        }}
      />

      <DataTable
        data={filteredPartners}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No delivery partners found"
      />

      <ConfirmationModal
        opened={deletePartnerId !== null}
        onClose={() => {
          setDeletePartnerId(null);
          setDeletePartnerName('');
        }}
        onConfirm={confirmDelete}
        title="Delete Delivery Partner"
        message={`Are you sure you want to delete "${deletePartnerName}"? Any orders assigned to this partner will become unassigned.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        variant="danger"
      />
    </Stack>
  );
}
