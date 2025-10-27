import React, { useState, useEffect } from 'react';
import {
  Group,
  Text,
  Stack,
  Avatar,
  Badge,
  NumberInput,
  Textarea,
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconWallet,
  IconCurrencyRupee,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { CustomerDto, SocietyDto, BuildingDto } from '@shreehari/types';
import {
  useCustomers,
  useSocieties,
  useBuildings,
  useDeleteCustomer,
  useCreditWallet,
  useDebitWallet,
  useCustomerWallet,
} from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  ConfirmationModal,
  SearchFilter,
  Modal,
  Form,
  FormField,
  PaginationControls,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
  type FormAction,
} from '@shreehari/ui';
import { formatDate, formatCurrency } from '@shreehari/utils';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Search and filter states
  const [searchValue, setSearchValue] = useState('');
  const [selectedSocietyId, setSelectedSocietyId] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');

  const {
    data: customerData,
    loading,
    error,
    refetch,
  } = useCustomers(
    page,
    limit,
    searchValue || undefined,
    selectedSocietyId || undefined,
    selectedBuildingId || undefined,
    selectedPaymentMode === 'monthly'
      ? true
      : selectedPaymentMode === 'per-order'
        ? false
        : undefined
  );

  console.log('Customer Data:', customerData);

  const { data: societies } = useSocieties();
  const { data: buildings } = useBuildings(selectedSocietyId || undefined);
  const { deleteCustomer, loading: deleting } = useDeleteCustomer();
  const { creditWallet, loading: crediting } = useCreditWallet();
  const { debitWallet, loading: debiting } = useDebitWallet();

  // Modal states
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [walletModalOpened, setWalletModalOpened] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(
    null
  );
  const [walletOperation, setWalletOperation] = useState<'credit' | 'debit'>(
    'credit'
  );
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [walletDescription, setWalletDescription] = useState('');

  const customers = customerData?.data || [];
  const total = customerData?.total || 0;
  const totalPages = customerData?.totalPages || 1;

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [searchValue, selectedSocietyId, selectedBuildingId, selectedPaymentMode]);

  const handleDeleteCustomer = (customer: CustomerDto) => {
    setSelectedCustomer(customer);
    setDeleteModalOpened(true);
  };

  const confirmDelete = async () => {
    if (selectedCustomer) {
      try {
        await deleteCustomer(selectedCustomer.id);
        setDeleteModalOpened(false);
        setSelectedCustomer(null);
        refetch();
        notifications.show({
          title: 'Success',
          message: 'Customer deleted successfully',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to delete customer',
          color: 'red',
        });
      }
    }
  };

  const handleViewCustomer = (customer: CustomerDto) => {
    navigate(`/customers/${customer.id}/wallet`);
  };

  const handleEditCustomer = (customer: CustomerDto) => {
    navigate(`/customers/${customer.id}/edit`);
  };

  const handleWalletOperation = (
    customer: CustomerDto,
    operation: 'credit' | 'debit'
  ) => {
    setSelectedCustomer(customer);
    setWalletOperation(operation);
    setWalletAmount(0);
    setWalletDescription('');
    setWalletModalOpened(true);
  };

  const handleWalletSubmit = async () => {
    if (!selectedCustomer || walletAmount <= 0) {
      notifications.show({
        title: 'Error',
        message: 'Please enter a valid amount',
        color: 'red',
      });
      return;
    }

    try {
      if (walletOperation === 'credit') {
        await creditWallet(
          selectedCustomer.id,
          walletAmount,
          walletDescription
        );
        notifications.show({
          title: 'Success',
          message: `₹${walletAmount} credited to wallet successfully`,
          color: 'green',
        });
      } else {
        await debitWallet(selectedCustomer.id, walletAmount, walletDescription);
        notifications.show({
          title: 'Success',
          message: `₹${walletAmount} debited from wallet successfully`,
          color: 'green',
        });
      }

      refetch();
      setWalletModalOpened(false);
      setSelectedCustomer(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${walletOperation} wallet`,
        color: 'red',
      });
    }
  };

  const handleAddCustomer = () => {
    navigate('/customers/new');
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  // Filter options
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
    {
      key: 'building',
      label: 'Building',
      type: 'select',
      options:
        buildings?.map((building) => ({
          value: building.id,
          label: `Building ${building.name}`,
        })) || [],
      value: selectedBuildingId,
      placeholder: 'All buildings',
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      options: [
        { value: 'monthly', label: 'Monthly Payment' },
        { value: 'per-order', label: 'Per Order Payment' },
      ],
      value: selectedPaymentMode,
      placeholder: 'All payment modes',
    },
  ];

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'society') {
      setSelectedSocietyId(value || '');
      setSelectedBuildingId(''); // Reset building when society changes
    } else if (key === 'building') {
      setSelectedBuildingId(value || '');
    } else if (key === 'paymentMode') {
      setSelectedPaymentMode(value || '');
    }
  };

  // Define columns for the DataTable
  const columns: Column<CustomerDto>[] = [
    {
      key: 'name',
      title: 'Customer',
      render: (value, record) => (
        <Group gap="sm">
          <Avatar name={value} color="initials" size="sm" />
          <div>
            <Text size="sm" fw={500}>
              {value}
            </Text>
            <Text size="xs" c="dimmed">
              {record.email}
            </Text>
          </div>
        </Group>
      ),
    },
    {
      key: 'mobileNumber',
      title: 'Contact',
      render: (value, record) => (
        <div>
          <Text size="sm" fw={500}>
            {value}
          </Text>
          {record.phone && (
            <Text size="xs" c="dimmed">
              {record.phone}
            </Text>
          )}
        </div>
      ),
    },
    {
      key: 'society',
      title: 'Location',
      render: (value, record) => (
        <div>
          <Text size="sm" fw={500}>
            {value?.name}
          </Text>
          <Text size="xs" c="dimmed">
            Building {record.building?.name}, Flat {record.flatNumber}
          </Text>
        </div>
      ),
    },
    {
      key: 'wallet',
      title: 'Wallet Balance',
      render: (value) => (
        <Group gap="xs">
          <IconWallet size={14} />
          <Text fw={500} c={value?.balance > 0 ? 'green' : 'red'}>
            {formatCurrency(value?.balance || 0)}
          </Text>
        </Group>
      ),
    },
    {
      key: 'isMonthlyPayment',
      title: 'Payment Mode',
      render: (value) => (
        <Badge variant="light" color={value ? 'blue' : 'gray'}>
          {value ? 'Monthly' : 'Per Order'}
        </Badge>
      ),
    },
    {
      key: 'orders',
      title: 'Orders',
      render: (value) => <Text fw={500}>{value.length || 0}</Text>,
    },
    {
      key: 'createdAt',
      title: 'Joined',
      render: (value) => <Text size="sm">{formatDate(value)}</Text>,
    },
  ];

  // Define actions for the DataTable
  const actions: DataTableAction<CustomerDto>[] = [
    {
      icon: <IconEye size={16} />,
      label: 'View',
      color: 'blue',
      onClick: handleViewCustomer,
    },
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: handleEditCustomer,
    },
    {
      icon: <IconCurrencyRupee size={16} />,
      label: 'Credit Wallet',
      color: 'green',
      onClick: (customer) => handleWalletOperation(customer, 'credit'),
    },
    {
      icon: <IconWallet size={16} />,
      label: 'Debit Wallet',
      color: 'orange',
      onClick: (customer) => handleWalletOperation(customer, 'debit'),
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: handleDeleteCustomer,
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Add Customer',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: handleAddCustomer,
    },
  ];

  // Wallet modal form actions
  const walletFormActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: () => setWalletModalOpened(false),
      disabled: crediting || debiting,
    },
    {
      label: walletOperation === 'credit' ? 'Credit Amount' : 'Debit Amount',
      variant: 'brand',
      type: 'submit',
      loading: crediting || debiting,
      onClick: () => {}, // Handled by form onSubmit
    },
  ];

  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Customers Management"
          subtitle="Manage customer information and relationships"
          actions={headerActions}
        />
        <Text c="red">Error loading customers: {error}</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Customers Management"
        subtitle="Manage customer information and relationships"
        actions={headerActions}
      />

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search customers by name, email, mobile number, or flat number..."
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={() => {
          setSearchValue('');
          setSelectedSocietyId('');
          setSelectedBuildingId('');
          setSelectedPaymentMode('');
          setPage(1);
        }}
      />

      <DataTable
        data={customers}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No customers found"
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedCustomer?.name}"? This action cannot be undone and will remove all associated data including wallet and order history.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        variant="danger"
      />

      {/* Wallet Operation Modal */}
      <Modal
        opened={walletModalOpened}
        onClose={() => setWalletModalOpened(false)}
        title={`${walletOperation === 'credit' ? 'Credit' : 'Debit'} Wallet - ${selectedCustomer?.name}`}
        size="md"
      >
        <Form onSubmit={handleWalletSubmit} actions={walletFormActions}>
          <Stack gap="md">
            <FormField label="Amount" error="" required>
              <NumberInput
                placeholder="Enter amount"
                min={0}
                decimalScale={2}
                required
                value={walletAmount}
                onChange={(value) => setWalletAmount(Number(value) || 0)}
              />
            </FormField>

            <FormField label="Description" error="">
              <Textarea
                placeholder="Enter transaction description..."
                value={walletDescription}
                onChange={(event) =>
                  setWalletDescription(event.currentTarget.value)
                }
                rows={3}
              />
            </FormField>
          </Stack>
        </Form>
      </Modal>
    </Stack>
  );
};
