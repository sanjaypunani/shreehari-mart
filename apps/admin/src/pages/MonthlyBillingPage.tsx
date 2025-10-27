import React, { useState, useEffect } from 'react';
import {
  Group,
  Text,
  Stack,
  Badge,
  Modal,
  Select,
  Button,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconEye,
  IconSend,
  IconDownload,
  IconPlus,
  IconCalendar,
  IconFileInvoice,
  IconCurrencyRupee,
  IconMail,
  IconCheck,
  IconClock,
  IconExclamationMark,
  IconChartBar,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { MonthlyBillDto, CreateMonthlyBillDto } from '@shreehari/types';
import {
  useMonthlyBills,
  useMonthlyBillingSummary,
  useMarkBillAsPaid,
  useMarkBillAsSent,
  useBulkGenerateBills,
  useDownloadInvoice,
  useSendInvoiceEmail,
  useBulkInvoiceAction,
} from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  StatusBadge,
  SearchFilter,
  PaginationControls,
  ConfirmationModal,
  Form,
  FormField,
  type Column,
  type DataTableAction,
  type PageHeaderAction,
  type FilterOption,
  type FormAction,
} from '@shreehari/ui';
import { formatDate, formatCurrency } from '@shreehari/utils';

export const MonthlyBillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedBill, setSelectedBill] = useState<MonthlyBillDto | null>(null);
  const [billDetailModalOpened, setBillDetailModalOpened] = useState(false);
  const [bulkGenerateModalOpened, setBulkGenerateModalOpened] = useState(false);
  const [emailModalOpened, setEmailModalOpened] = useState(false);
  const [paymentModalOpened, setPaymentModalOpened] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );

  // Filter states
  const [filters, setFilters] = useState({
    month: selectedMonth || '',
    status: '',
    search: '',
  });

  // Email form data
  const [emailForm, setEmailForm] = useState({
    emailAddress: '',
    customMessage: '',
  });

  // Bulk generate form data
  const [bulkGenerateForm, setBulkGenerateForm] = useState({
    month: new Date().toISOString().slice(0, 7),
    year: new Date().getFullYear(),
  });

  // API hooks
  const {
    data: billsData,
    loading,
    error,
    refetch,
  } = useMonthlyBills(page, limit, filters.month, filters.status, searchValue);

  const {
    data: summaryData,
    loading: summaryLoading,
    refetch: refetchSummary,
  } = useMonthlyBillingSummary(filters.month);

  const { markBillAsPaid, loading: markPaidLoading } = useMarkBillAsPaid();
  const { markBillAsSent, loading: markSentLoading } = useMarkBillAsSent();
  const { bulkGenerateBills, loading: bulkGenerateLoading } =
    useBulkGenerateBills();
  const { downloadInvoice, loading: downloadLoading } = useDownloadInvoice();
  const { sendInvoiceEmail, loading: emailLoading } = useSendInvoiceEmail();
  const { bulkInvoiceAction, loading: bulkActionLoading } =
    useBulkInvoiceAction();

  const bills = billsData?.data || [];
  const total = billsData?.total || 0;
  const totalPages = billsData?.totalPages || 1;

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [searchValue, filters.month, filters.status]);

  // Filter handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      month: '',
      status: '',
      search: '',
    });
    setSearchValue('');
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Bill action handlers
  const handleViewBill = (bill: MonthlyBillDto) => {
    setSelectedBill(bill);
    setBillDetailModalOpened(true);
  };

  const handleMarkAsPaid = async (bill: MonthlyBillDto) => {
    try {
      await markBillAsPaid(bill.id);
      notifications.show({
        title: 'Success',
        message: `Bill ${bill.billNumber} marked as paid`,
        color: 'green',
      });
      refetch();
      refetchSummary();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to mark bill as paid',
        color: 'red',
      });
    }
  };

  const handleMarkAsSent = async (bill: MonthlyBillDto) => {
    try {
      await markBillAsSent(bill.id);
      notifications.show({
        title: 'Success',
        message: `Bill ${bill.billNumber} marked as sent`,
        color: 'green',
      });
      refetch();
      refetchSummary();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to mark bill as sent',
        color: 'red',
      });
    }
  };

  const handleDownloadInvoice = async (
    bill: MonthlyBillDto,
    format: 'pdf' | 'excel' = 'pdf'
  ) => {
    try {
      const result = await downloadInvoice(bill.id, format);

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notifications.show({
        title: 'Download Started',
        message: `Invoice ${bill.billNumber} download started`,
        color: 'blue',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to download invoice',
        color: 'red',
      });
    }
  };

  const handleSendEmail = (bill: MonthlyBillDto) => {
    setSelectedBill(bill);
    setEmailForm({
      emailAddress: bill.customer.email,
      customMessage: '',
    });
    setEmailModalOpened(true);
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBill) return;

    try {
      await sendInvoiceEmail(selectedBill.id, {
        emailAddress: emailForm.emailAddress || undefined,
        customMessage: emailForm.customMessage || undefined,
      });

      notifications.show({
        title: 'Email Sent',
        message: `Invoice sent to ${emailForm.emailAddress}`,
        color: 'green',
      });

      setEmailModalOpened(false);
      refetch();
      refetchSummary();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to send email',
        color: 'red',
      });
    }
  };

  const handleBulkGenerate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const result = await bulkGenerateBills({
        billingPeriod: {
          month: bulkGenerateForm.month,
          year: bulkGenerateForm.year,
        },
      });

      notifications.show({
        title: 'Bills Generated',
        message: `Generated ${result.generated} bills successfully`,
        color: 'green',
      });

      if (result.errors && result.errors.length > 0) {
        console.warn('Generation errors:', result.errors);
      }

      setBulkGenerateModalOpened(false);
      refetch();
      refetchSummary();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to generate bills',
        color: 'red',
      });
    }
  };

  // Map bill status to StatusBadge variant
  const mapBillStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'sent':
        return 'active';
      case 'overdue':
        return 'error';
      case 'draft':
      default:
        return 'pending';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <IconCheck size={14} />;
      case 'sent':
        return <IconSend size={14} />;
      case 'overdue':
        return <IconExclamationMark size={14} />;
      case 'draft':
      default:
        return <IconClock size={14} />;
    }
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'month',
      label: 'Billing Month',
      type: 'select',
      placeholder: 'Select month',
      options: [
        { value: '2025-01', label: 'January 2025' },
        { value: '2025-02', label: 'February 2025' },
        { value: '2025-03', label: 'March 2025' },
        { value: '2025-04', label: 'April 2025' },
        { value: '2025-05', label: 'May 2025' },
        { value: '2025-06', label: 'June 2025' },
        { value: '2025-07', label: 'July 2025' },
        { value: '2025-08', label: 'August 2025' },
        { value: '2025-09', label: 'September 2025' },
        { value: '2025-10', label: 'October 2025' },
        { value: '2025-11', label: 'November 2025' },
        { value: '2025-12', label: 'December 2025' },
      ],
      value: filters.month,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'All statuses',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
      ],
      value: filters.status,
    },
  ];

  // Define columns for the DataTable
  const columns: Column<MonthlyBillDto>[] = [
    {
      key: 'billNumber',
      title: 'Bill Number',
      render: (value) => <Text fw={500}>#{value}</Text>,
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value, record) => (
        <div>
          <Text size="sm" fw={500}>
            {value.name}
          </Text>
          <Text size="xs" c="dimmed">
            {value.society?.name} - {value.flatNumber}
          </Text>
        </div>
      ),
    },
    {
      key: 'billingPeriod',
      title: 'Period',
      render: (value) => (
        <Text size="sm" fw={500}>
          {new Date(value.month + '-01').toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      ),
    },
    {
      key: 'orderCount',
      title: 'Orders',
      render: (value) => (
        <Badge variant="light" color="blue">
          {value} orders
        </Badge>
      ),
    },
    {
      key: 'totalAmount',
      title: 'Amount',
      render: (value) => <Text fw={500}>{formatCurrency(value)}</Text>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <StatusBadge
          status={mapBillStatus(value)}
          leftSection={getStatusIcon(value)}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Generated',
      render: (value) => <Text size="sm">{formatDate(value)}</Text>,
    },
    {
      key: 'paidAt',
      title: 'Paid On',
      render: (value) => (
        <Text size="sm" c={value ? 'green' : 'dimmed'}>
          {value ? formatDate(value) : 'Not paid'}
        </Text>
      ),
    },
  ];

  // Define actions for the DataTable
  const actions: DataTableAction<MonthlyBillDto>[] = [
    {
      icon: <IconEye size={16} />,
      label: 'View Details',
      color: 'blue',
      onClick: handleViewBill,
    },
    {
      icon: <IconDownload size={16} />,
      label: 'Download PDF',
      color: 'green',
      onClick: (bill) => handleDownloadInvoice(bill, 'pdf'),
    },
    {
      icon: <IconMail size={16} />,
      label: 'Send Email',
      color: 'orange',
      onClick: handleSendEmail,
    },
    {
      icon: <IconCheck size={16} />,
      label: 'Mark as Paid',
      color: 'green',
      onClick: handleMarkAsPaid,
    },
    {
      icon: <IconSend size={16} />,
      label: 'Mark as Sent',
      color: 'blue',
      onClick: handleMarkAsSent,
    },
  ];

  // Define header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Analytics',
      variant: 'outline',
      leftSection: <IconChartBar size={16} />,
      onClick: () => console.log('View billing analytics'), // TODO: Implement analytics page
    },
    {
      label: 'Generate Bills',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: () => setBulkGenerateModalOpened(true),
    },
  ];

  // Email form actions
  const emailFormActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: () => setEmailModalOpened(false),
    },
    {
      label: 'Send Email',
      variant: 'brand',
      type: 'submit',
      loading: emailLoading,
      onClick: () => {},
    },
  ];

  // Bulk generate form actions
  const bulkGenerateFormActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: () => setBulkGenerateModalOpened(false),
    },
    {
      label: 'Generate Bills',
      variant: 'brand',
      type: 'submit',
      loading: bulkGenerateLoading,
      onClick: () => {},
    },
  ];

  // Show error state
  if (error) {
    return (
      <Stack gap="md">
        <PageHeader
          title="Monthly Billing Management"
          subtitle="Manage monthly bills for customers with monthly payment mode"
          actions={headerActions}
        />
        <Text c="red">Error loading bills: {error}</Text>
        <Button onClick={() => refetch()}>Retry</Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <PageHeader
        title="Monthly Billing Management"
        subtitle="Manage monthly bills for customers with monthly payment mode"
        actions={headerActions}
      />

      {/* Summary Cards */}
      {summaryData && (
        <Group gap="md">
          <Badge size="xl" variant="light" color="blue">
            {summaryData.billCount} Total Bills
          </Badge>
          <Badge size="xl" variant="light" color="green">
            {formatCurrency(summaryData.paidAmount)} Paid
          </Badge>
          <Badge size="xl" variant="light" color="orange">
            {formatCurrency(summaryData.pendingAmount)} Pending
          </Badge>
          <Badge size="xl" variant="light" color="red">
            {formatCurrency(summaryData.overdueAmount)} Overdue
          </Badge>
        </Group>
      )}

      {/* Search and Filters */}
      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search bills by customer name, email, or bill number..."
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filtersExpanded={filtersExpanded}
        onToggleFilters={setFiltersExpanded}
      />

      {/* Bills Table */}
      <DataTable
        data={bills}
        columns={columns}
        actions={actions}
        loading={loading || markPaidLoading || markSentLoading}
        emptyMessage="No monthly bills found"
      />

      {/* Pagination */}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={loading}
      />

      {/* Bill Details Modal */}
      <Modal
        opened={billDetailModalOpened}
        onClose={() => setBillDetailModalOpened(false)}
        title={`Bill Details - ${selectedBill?.billNumber}`}
        size="lg"
      >
        {selectedBill && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={500}>Customer:</Text>
              <Text>{selectedBill.customer.name}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Email:</Text>
              <Text>{selectedBill.customer.email}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Mobile:</Text>
              <Text>{selectedBill.customer.mobileNumber}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Address:</Text>
              <Text>
                {selectedBill.customer.society?.name} -{' '}
                {selectedBill.customer.flatNumber}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Billing Period:</Text>
              <Text fw={500}>
                {new Date(
                  selectedBill.billingPeriod.month + '-01'
                ).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Status:</Text>
              <StatusBadge status={mapBillStatus(selectedBill.status)}>
                {selectedBill.status.charAt(0).toUpperCase() +
                  selectedBill.status.slice(1)}
              </StatusBadge>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Total Amount:</Text>
              <Text fw={500} size="lg">
                {formatCurrency(selectedBill.totalAmount)}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Orders Count:</Text>
              <Badge variant="light" color="blue">
                {selectedBill.orderCount} orders
              </Badge>
            </Group>
            {selectedBill.sentAt && (
              <Group justify="space-between">
                <Text fw={500}>Sent On:</Text>
                <Text>{formatDate(selectedBill.sentAt)}</Text>
              </Group>
            )}
            {selectedBill.paidAt && (
              <Group justify="space-between">
                <Text fw={500}>Paid On:</Text>
                <Text c="green">{formatDate(selectedBill.paidAt)}</Text>
              </Group>
            )}
            {selectedBill.dueDate && (
              <Group justify="space-between">
                <Text fw={500}>Due Date:</Text>
                <Text
                  c={
                    new Date(selectedBill.dueDate) < new Date() ? 'red' : 'blue'
                  }
                >
                  {formatDate(selectedBill.dueDate)}
                </Text>
              </Group>
            )}

            {/* Orders in the bill */}
            {selectedBill.orders && selectedBill.orders.length > 0 && (
              <>
                <Text fw={500}>Orders in this bill:</Text>
                <Stack gap="xs">
                  {selectedBill.orders.map((order) => (
                    <Group
                      key={order.id}
                      justify="space-between"
                      p="xs"
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                      }}
                    >
                      <Text size="sm">
                        Order #{order.id.slice(0, 8)} -{' '}
                        {formatDate(order.createdAt)}
                      </Text>
                      <Text size="sm" fw={500}>
                        {formatCurrency(order.totalAmount)}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        )}
      </Modal>

      {/* Email Modal */}
      <Modal
        opened={emailModalOpened}
        onClose={() => setEmailModalOpened(false)}
        title={`Send Invoice - ${selectedBill?.billNumber}`}
        size="md"
      >
        <Form onSubmit={handleEmailSubmit} actions={emailFormActions}>
          <Stack gap="md">
            <FormField>
              <TextInput
                label="Email Address"
                placeholder="Enter email address"
                value={emailForm.emailAddress}
                onChange={(event) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    emailAddress: event.currentTarget.value,
                  }))
                }
                required
              />
            </FormField>
            <FormField>
              <Textarea
                label="Custom Message (Optional)"
                placeholder="Add a custom message to include with the invoice"
                value={emailForm.customMessage}
                onChange={(event) =>
                  setEmailForm((prev) => ({
                    ...prev,
                    customMessage: event.currentTarget.value,
                  }))
                }
                minRows={3}
              />
            </FormField>
          </Stack>
        </Form>
      </Modal>

      {/* Bulk Generate Modal */}
      <Modal
        opened={bulkGenerateModalOpened}
        onClose={() => setBulkGenerateModalOpened(false)}
        title="Generate Monthly Bills"
        size="md"
      >
        <Form onSubmit={handleBulkGenerate} actions={bulkGenerateFormActions}>
          <Stack gap="md">
            <FormField>
              <Select
                label="Billing Month"
                placeholder="Select billing month"
                data={[
                  { value: '2025-01', label: 'January 2025' },
                  { value: '2025-02', label: 'February 2025' },
                  { value: '2025-03', label: 'March 2025' },
                  { value: '2025-04', label: 'April 2025' },
                  { value: '2025-05', label: 'May 2025' },
                  { value: '2025-06', label: 'June 2025' },
                  { value: '2025-07', label: 'July 2025' },
                  { value: '2025-08', label: 'August 2025' },
                  { value: '2025-09', label: 'September 2025' },
                  { value: '2025-10', label: 'October 2025' },
                  { value: '2025-11', label: 'November 2025' },
                  { value: '2025-12', label: 'December 2025' },
                ]}
                value={bulkGenerateForm.month}
                onChange={(value) =>
                  setBulkGenerateForm((prev) => ({
                    ...prev,
                    month: value || '',
                    year: parseInt(value?.split('-')[0] || '2025'),
                  }))
                }
                required
              />
            </FormField>
            <Text size="sm" c="dimmed">
              This will generate bills for all customers with monthly payment
              mode enabled who have orders in the selected month.
            </Text>
          </Stack>
        </Form>
      </Modal>
    </Stack>
  );
};
