import React, { useState, useEffect } from 'react';
import {
  Group,
  Text,
  Stack,
  Button,
  Modal,
  Select,
  Checkbox,
  Badge,
} from '@mantine/core';
import {
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconRefresh,
  IconChartBar,
  IconCheck,
  IconSearch,
  IconFilter,
  IconCopy,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { OrderDto } from '@shreehari/types';
import {
  DataTable,
  PageHeader,
  StatusBadge,
  SearchFilter,
  PaginationControls,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
} from '@shreehari/ui';
import { formatDate, formatCurrency } from '@shreehari/utils';
import {
  useOrders,
  useDeleteOrder,
  useUpdateOrderStatus,
  getCustomerWalletById,
} from '@shreehari/data-access';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [statusUpdateOpened, setStatusUpdateOpened] = useState(false);
  const [bulkStatusUpdateOpened, setBulkStatusUpdateOpened] = useState(false);
  const [newStatus, setNewStatus] = useState<
    'pending' | 'confirmed' | 'delivered' | 'cancelled'
  >('pending');
  const [bulkNewStatus, setBulkNewStatus] = useState<
    'pending' | 'confirmed' | 'delivered' | 'cancelled'
  >('pending');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Search and filter states
  const [searchValue, setSearchValue] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentMode: '',
    dateFrom: '',
    dateTo: '',
  });

  // API hooks
  const {
    data: ordersData,
    loading,
    error,
    refetch,
  } = useOrders(page, limit, filters.status);
  const { deleteOrder, loading: deleteLoading } = useDeleteOrder();
  const { updateOrderStatus, loading: updateLoading } = useUpdateOrderStatus();

  const orders = ordersData?.data || [];
  const total = ordersData?.total || 0;
  const totalPages = ordersData?.totalPages || 0;

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedOrders([]); // Clear selection when page changes
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
    setSelectedOrders([]); // Clear selection when limit changes
  };

  // Reset page and clear selection when filters change
  useEffect(() => {
    setPage(1);
    setSelectedOrders([]);
  }, [filters.status]);

  // Reset page and clear selection when search changes
  useEffect(() => {
    setPage(1);
    setSelectedOrders([]);
  }, [searchValue]);

  // Map order status to StatusBadge status
  const mapOrderStatus = (
    status: string
  ):
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'pending'
    | 'active'
    | 'inactive' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'confirmed':
        return 'active';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'error';
      default:
        return 'inactive';
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      notifications.show({
        title: 'Success',
        message: 'Order deleted successfully',
        color: 'green',
      });
      refetch(); // Refresh the orders list
    } catch (error) {
      console.error('Failed to delete order:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete order',
        color: 'red',
      });
    }
  };

  const handleViewOrder = (order: OrderDto) => {
    setSelectedOrder(order);
    open();
  };

  const handleEditOrder = (order: OrderDto) => {
    navigate(`/orders/${order.id}/edit`);
  };

  const handleCreateOrder = () => {
    navigate('/orders/new');
  };

  const handleUpdateStatus = (order: OrderDto) => {
    setSelectedOrder(order);
    setNewStatus(
      order.status as 'pending' | 'confirmed' | 'delivered' | 'cancelled'
    );
    setStatusUpdateOpened(true);
  };

  const handleStatusSubmit = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setStatusUpdateOpened(false);
      setSelectedOrder(null);
      notifications.show({
        title: 'Success',
        message: 'Order status updated successfully',
        color: 'green',
      });
      refetch(); // Refresh the orders list
    } catch (error) {
      console.error('Failed to update order status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update order status',
        color: 'red',
      });
    }
  };

  // Bulk operations handlers
  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Filter handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      paymentMode: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'All statuses',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
      value: filters.status,
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      placeholder: 'All payment modes',
      options: [
        { value: 'wallet', label: 'Wallet' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'cod', label: 'Cash on Delivery' },
      ],
      value: filters.paymentMode,
    },
    {
      key: 'dateFrom',
      label: 'From Date',
      type: 'date',
      value: filters.dateFrom,
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date',
      value: filters.dateTo,
    },
  ];

  const handleBulkStatusUpdate = () => {
    if (selectedOrders.length === 0) {
      notifications.show({
        title: 'Warning',
        message: 'Please select orders to update',
        color: 'yellow',
      });
      return;
    }
    setBulkStatusUpdateOpened(true);
  };

  const handleBulkStatusSubmit = async () => {
    try {
      // Update status for all selected orders
      await Promise.all(
        selectedOrders.map((orderId) =>
          updateOrderStatus(orderId, bulkNewStatus)
        )
      );

      setBulkStatusUpdateOpened(false);
      setSelectedOrders([]);
      notifications.show({
        title: 'Success',
        message: `Updated status for ${selectedOrders.length} orders`,
        color: 'green',
      });
      refetch(); // Refresh the orders list
    } catch (error) {
      console.error('Failed to update order statuses:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update order statuses',
        color: 'red',
      });
    }
  };

  const handleCopyOrderSummary = async (order: OrderDto) => {
    try {
      const orderSummary = await generateOrderSummary(order);
      await navigator.clipboard.writeText(orderSummary);

      notifications.show({
        title: 'Order Summary Copied',
        message: 'Order summary has been copied to your clipboard.',
        color: 'green',
        icon: <IconCopy size={16} />,
      });
    } catch (error) {
      console.error('Failed to copy order summary:', error);

      // Fallback: show the summary in an alert if clipboard fails
      const orderSummary = generateOrderSummary(order);
      alert(
        'Failed to copy automatically. Please copy manually:\n\n' + orderSummary
      );

      notifications.show({
        title: 'Copy Failed',
        message: 'Unable to copy to clipboard. Summary displayed in alert.',
        color: 'red',
      });
    }
  };

  const generateOrderSummary = async (order: OrderDto): Promise<string> => {
    const customerWallet = await getCustomerWalletById(order.customerId);
    const deliveryDate =
      order.deliveryDate || new Date().toISOString().split('T')[0];
    const formattedDeliveryDate = new Date(deliveryDate).toLocaleDateString(
      'en-IN'
    );

    // Extract customer mobile number (if available in customerEmail or as separate field)
    // For now, using a placeholder since mobile isn't in the current OrderDto
    const customerMobile = order.customerMobileNumber; // This would need to come from customer data

    // Format customer society and flat info
    const societyInfo = order.customerSociety || 'N/A';
    const flatInfo = order.customerFlatNumber
      ? ` ${order.customerFlatNumber}`
      : '';
    const fullAddress = `${societyInfo}${flatInfo}`;

    // Generate items list
    const itemsList = order.items
      .map((item) => {
        const quantity = item.orderedQuantity || item.quantity;
        const unit = item.unit.toUpperCase();
        const price = Math.round(item.finalPrice || item.total || 0);

        // Handle different unit displays
        let displayUnit = unit;
        if (unit === 'GM') displayUnit = 'GM';
        else if (unit === 'KG') displayUnit = 'KG';
        else if (unit === 'PC') displayUnit = 'PCS';

        // Format product name with quantity and price
        return `* ${item.productName} – ${quantity} ${displayUnit} – ${price} RS`;
      })
      .join('\n');

    const totalAmount = Math.round(order.totalAmount || 0);
    const discount = Math.round(order.discount || 0);

    // Calculate wallet usage based on payment mode
    const isWalletPayment = order.paymentMode === 'wallet';
    let walletUsed = 0;
    let afterWalletBalance = customerWallet.data.balance;
    let finalAmountToPay = totalAmount - discount;
    let beforeWalletBalance =
      Number(afterWalletBalance) + Number(order.totalAmount); // This should come from customer data

    if (isWalletPayment) {
      // For wallet payments, the entire amount after discount is deducted from wallet
      walletUsed = finalAmountToPay;
      finalAmountToPay = 0; // No cash payment needed
    } else if (order.paymentMode === 'monthly') {
      // For monthly payments, might have partial wallet usage
      // This logic would depend on your business rules
      finalAmountToPay = totalAmount - discount;
    } else {
      // For COD, full amount to be paid in cash
      finalAmountToPay = totalAmount - discount;
    }

    // Build the summary string
    let summary = `*Shree Hari Mart – Order Summary*

Delivery Date: ${formattedDeliveryDate}
Customer: ${order.customerName}
Mobile: ${customerMobile}
Society: ${fullAddress}

Items:
${itemsList}

Total Amount: ${totalAmount} RS`;

    // Add discount section if there's a discount
    if (discount > 0) {
      summary += `
Discount: ${discount} RS`;
    }

    // Add wallet information if wallet is used
    if (isWalletPayment && walletUsed > 0) {
      summary += `

💰 Wallet Usage:
Before Wallet Balance: ${beforeWalletBalance} RS
Deduct from Wallet: ${walletUsed} RS
After Wallet Balance: ${afterWalletBalance} RS

*FINAL AMOUNT TO PAY: ${finalAmountToPay} RS*`;
    } else {
      summary += `

*FINAL AMOUNT TO PAY: ${finalAmountToPay} RS*`;
    }
    summary += `
    
Payment Mode: ${
      order.paymentMode === 'cod'
        ? 'Cash on Delivery'
        : order.paymentMode.charAt(0).toUpperCase() + order.paymentMode.slice(1)
    }`;

    // Add current wallet balance info
    if (isWalletPayment) {
      summary += `

💰 Your current wallet balance: ${afterWalletBalance} RS`;
    }

    // Add footer
    summary += `

Thank you for your order.

*Shree Hari Mart*`;

    return summary;
  };

  // Define columns for the DataTable
  const columns: Column<OrderDto>[] = [
    {
      key: 'select',
      title: '',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedOrders.includes(record.id)}
          onChange={(event) =>
            handleSelectOrder(record.id, event.currentTarget.checked)
          }
        />
      ),
    },
    {
      key: 'id',
      title: 'Order ID',
      render: (value) => <Text fw={500}>#{value.slice(0, 8)}</Text>,
    },
    {
      key: 'customerName',
      title: 'Customer',
      render: (value, record) => (
        <div>
          <Text size="sm" fw={500}>
            {value}
          </Text>
          <Text size="xs" c="dimmed">
            {record.customerEmail}
          </Text>
        </div>
      ),
    },
    {
      key: 'customerSociety',
      title: 'Society',
      render: (value) => <Text size="sm">{value || 'N/A'}</Text>,
    },
    {
      key: 'customerFlatNumber',
      title: 'Flat No.',
      render: (value) => (
        <Text size="sm" fw={500}>
          {value || 'N/A'}
        </Text>
      ),
    },
    {
      key: 'deliveryDate',
      title: 'Delivery Date',
      render: (value) => (
        <Text size="sm" fw={500}>
          {value ? formatDate(value) : 'Not set'}
        </Text>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <StatusBadge status={mapOrderStatus(value)}>{value}</StatusBadge>
      ),
    },
    {
      key: 'paymentMode',
      title: 'Payment',
      render: (value) => (
        <Text size="sm" tt="capitalize">
          {value || 'N/A'}
        </Text>
      ),
    },
    {
      key: 'totalAmount',
      title: 'Total',
      render: (value) => <Text fw={500}>{formatCurrency(value || 0)}</Text>,
    },
    {
      key: 'discount',
      title: 'Discount',
      render: (value) => (
        <Text fw={500} c={value && value > 0 ? 'green' : 'gray'}>
          {value && value > 0 ? formatCurrency(value) : '-'}
        </Text>
      ),
    },
    {
      key: 'createdAt',
      title: 'Order Date',
      render: (value) => <Text size="sm">{formatDate(value)}</Text>,
    },
  ];

  // Define actions for the DataTable
  const actions: DataTableAction<OrderDto>[] = [
    {
      icon: <IconEye size={16} />,
      label: 'View',
      color: 'blue',
      onClick: handleViewOrder,
    },
    {
      icon: <IconRefresh size={16} />,
      label: 'Update Status',
      color: 'green',
      onClick: handleUpdateStatus,
    },
    {
      icon: <IconCopy size={16} />,
      label: 'Copy Summary',
      color: 'teal',
      onClick: handleCopyOrderSummary,
    },
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: handleEditOrder,
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: (order) => handleDeleteOrder(order.id),
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Analytics',
      variant: 'outline',
      leftSection: <IconChartBar size={16} />,
      onClick: () => navigate('/orders/analytics'),
    },
    {
      label: 'New Order',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: handleCreateOrder,
    },
  ];

  // Error display
  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Orders Management"
          subtitle="Manage and track all customer orders"
          actions={headerActions}
        />
        <Text c="red">Error loading orders: {error}</Text>
        <Button onClick={() => refetch()}>Retry</Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Orders Management"
        subtitle="Manage and track all customer orders"
        actions={headerActions}
      />

      {/* Bulk Selection Header */}
      <Group
        justify="space-between"
        style={{ display: orders.length > 0 ? 'flex' : 'none' }}
      >
        <Group gap="sm">
          <Checkbox
            checked={
              selectedOrders.length === orders.length && orders.length > 0
            }
            indeterminate={
              selectedOrders.length > 0 && selectedOrders.length < orders.length
            }
            onChange={(event) => handleSelectAll(event.currentTarget.checked)}
            label={`Select all (${orders.length} orders)`}
          />

          {selectedOrders.length > 0 && (
            <Badge size="lg" variant="light" color="blue">
              {selectedOrders.length} selected
            </Badge>
          )}
        </Group>

        {selectedOrders.length > 0 && (
          <Group gap="sm">
            <Button
              variant="outline"
              size="sm"
              leftSection={<IconRefresh size={16} />}
              onClick={handleBulkStatusUpdate}
            >
              Update Status ({selectedOrders.length})
            </Button>
            <Button
              variant="light"
              size="sm"
              color="gray"
              onClick={() => setSelectedOrders([])}
            >
              Clear Selection
            </Button>
          </Group>
        )}
      </Group>

      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search orders by customer, email, or order ID..."
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filtersExpanded={filtersExpanded}
        onToggleFilters={setFiltersExpanded}
      />

      <DataTable
        data={orders}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No orders found"
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

      {/* Order Details Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={`Order Details - #${selectedOrder?.id?.slice(0, 8) || ''}`}
        size="lg"
      >
        {selectedOrder && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>Customer:</Text>
              <Text>{selectedOrder.customerName}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Email:</Text>
              <Text>{selectedOrder.customerEmail}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Society:</Text>
              <Text>{selectedOrder.customerSociety || 'N/A'}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Flat Number:</Text>
              <Text>{selectedOrder.customerFlatNumber || 'N/A'}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Delivery Date:</Text>
              <Text fw={500} c={selectedOrder.deliveryDate ? 'blue' : 'red'}>
                {selectedOrder.deliveryDate
                  ? formatDate(selectedOrder.deliveryDate)
                  : 'Not set'}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Status:</Text>
              <StatusBadge status={mapOrderStatus(selectedOrder.status)}>
                {selectedOrder.status}
              </StatusBadge>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Payment Mode:</Text>
              <Text tt="capitalize">{selectedOrder.paymentMode || 'N/A'}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Total Amount:</Text>
              <Text fw={500} size="lg">
                {formatCurrency(selectedOrder.totalAmount || 0)}
              </Text>
            </Group>
            {selectedOrder.discount && selectedOrder.discount > 0 && (
              <Group justify="space-between">
                <Text fw={500}>Discount:</Text>
                <Text fw={500} c="green">
                  {formatCurrency(selectedOrder.discount)}
                </Text>
              </Group>
            )}
            <Group justify="space-between">
              <Text fw={500}>Order Date:</Text>
              <Text>{formatDate(selectedOrder.createdAt)}</Text>
            </Group>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <>
                <Text fw={500}>Items:</Text>
                <Stack gap="xs">
                  {selectedOrder.items.map((item, index) => (
                    <Group key={index} justify="space-between">
                      <Text>
                        {item.productName} x{' '}
                        {item.orderedQuantity || item.quantity}
                        {item.unit && ` ${item.unit}`}
                      </Text>
                      <Text>
                        {formatCurrency(item.finalPrice || item.total || 0)}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        opened={statusUpdateOpened}
        onClose={() => setStatusUpdateOpened(false)}
        title={`Update Order Status - #${selectedOrder?.id?.slice(0, 8) || ''}`}
        size="md"
      >
        {selectedOrder && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>Customer:</Text>
              <Text>{selectedOrder.customerName}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Current Status:</Text>
              <StatusBadge status={mapOrderStatus(selectedOrder.status)}>
                {selectedOrder.status}
              </StatusBadge>
            </Group>

            <Select
              label="New Status"
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={newStatus}
              onChange={(value) =>
                setNewStatus(
                  value as 'pending' | 'confirmed' | 'delivered' | 'cancelled'
                )
              }
              required
            />

            <Group justify="end" mt="md">
              <Button
                variant="outline"
                onClick={() => setStatusUpdateOpened(false)}
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusSubmit} loading={updateLoading}>
                Update Status
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Bulk Status Update Modal */}
      <Modal
        opened={bulkStatusUpdateOpened}
        onClose={() => setBulkStatusUpdateOpened(false)}
        title={`Bulk Update Status for ${selectedOrders.length} Orders`}
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            This will update the status for all {selectedOrders.length} selected
            orders.
          </Text>

          <Select
            label="New Status"
            data={[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={bulkNewStatus}
            onChange={(value) =>
              setBulkNewStatus(
                value as 'pending' | 'confirmed' | 'delivered' | 'cancelled'
              )
            }
            required
          />

          <Group justify="end" mt="md">
            <Button
              variant="outline"
              onClick={() => setBulkStatusUpdateOpened(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkStatusSubmit}
              loading={updateLoading}
              leftSection={<IconCheck size={16} />}
            >
              Update {selectedOrders.length} Orders
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
