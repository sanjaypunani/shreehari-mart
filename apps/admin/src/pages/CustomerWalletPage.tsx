import React, { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Card,
  Badge,
  NumberInput,
  Textarea,
} from '@mantine/core';
import {
  IconWallet,
  IconCurrencyRupee,
  IconPlus,
  IconMinus,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { WalletTransactionDto } from '@shreehari/types';
import {
  useCustomer,
  useCustomerWallet,
  useWalletTransactions,
  useCreditWallet,
  useDebitWallet,
} from '@shreehari/data-access';
import {
  DataTable,
  PageHeader,
  Modal,
  Form,
  FormField,
  type Column,
  type PageHeaderAction,
  type FormAction,
} from '@shreehari/ui';
import { formatDate, formatCurrency } from '@shreehari/utils';

export const CustomerWalletPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [page, setPage] = useState(1);

  const { data: customer } = useCustomer(customerId || '');
  const {
    data: wallet,
    loading: walletLoading,
    refetch: refetchWallet,
  } = useCustomerWallet(customerId || '');
  const {
    data: transactionData,
    loading: transactionsLoading,
    refetch: refetchTransactions,
  } = useWalletTransactions(customerId || '', page, 20);
  const { creditWallet, loading: crediting } = useCreditWallet();
  const { debitWallet, loading: debiting } = useDebitWallet();

  // Modal states
  const [creditModalOpened, setCreditModalOpened] = useState(false);
  const [debitModalOpened, setDebitModalOpened] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  console.log('transactionData', transactionData);
  const transactions = transactionData?.data || [];
  console.log('Transactions:', transactions);
  const isLoading = walletLoading || transactionsLoading;

  const handleCreditWallet = () => {
    setAmount(0);
    setDescription('');
    setCreditModalOpened(true);
  };

  const handleDebitWallet = () => {
    setAmount(0);
    setDescription('');
    setDebitModalOpened(true);
  };

  const handleCreditSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!customerId || amount <= 0 || !description.trim()) return;

    try {
      await creditWallet(customerId, amount, description);
      notifications.show({
        title: 'Success',
        message: `₹${amount} credited to wallet successfully`,
        color: 'green',
      });
      refetchWallet();
      refetchTransactions();
      setCreditModalOpened(false);
      setAmount(0);
      setDescription('');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to credit wallet',
        color: 'red',
      });
    }
  };

  const handleDebitSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerId || amount <= 0 || !description.trim()) return;

    try {
      await debitWallet(customerId, amount, description);
      notifications.show({
        title: 'Success',
        message: `₹${amount} debited from wallet successfully`,
        color: 'green',
      });
      refetchWallet();
      refetchTransactions();
      setDebitModalOpened(false);
      setAmount(0);
      setDescription('');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to debit wallet',
        color: 'red',
      });
    }
  };

  // Header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Credit Money',
      variant: 'brand',
      leftSection: <IconPlus size={16} />,
      onClick: handleCreditWallet,
    },
    {
      label: 'Debit Money',
      variant: 'outline',
      color: 'red',
      leftSection: <IconMinus size={16} />,
      onClick: handleDebitWallet,
    },
  ];

  // Transaction table columns
  const columns: Column<WalletTransactionDto>[] = [
    {
      key: 'type',
      title: 'Type',
      render: (value) => (
        <Group gap="xs">
          {value === 'credit' ? (
            <IconArrowUp size={16} color="green" />
          ) : (
            <IconArrowDown size={16} color="red" />
          )}
          <Badge variant="light" color={value === 'credit' ? 'green' : 'red'}>
            {value === 'credit' ? 'Credit' : 'Debit'}
          </Badge>
        </Group>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value, record) => (
        <Text fw={500} c={record.type === 'credit' ? 'green' : 'red'}>
          {record.type === 'credit' ? '+' : '-'}
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      render: (value) => (
        <Text size="sm" lineClamp={2}>
          {value}
        </Text>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date & Time',
      render: (value) => <Text size="sm">{formatDate(value)}</Text>,
    },
  ];

  // Form actions for modals
  const creditFormActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: () => setCreditModalOpened(false),
      disabled: crediting,
    },
    {
      label: 'Credit Amount',
      variant: 'brand',
      type: 'submit',
      loading: crediting,
      onClick: () => {},
    },
  ];

  const debitFormActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: () => setDebitModalOpened(false),
      disabled: debiting,
    },
    {
      label: 'Debit Amount',
      variant: 'brand',
      color: 'red',
      type: 'submit',
      loading: debiting,
      onClick: () => {},
    },
  ];

  if (!customer) {
    return <div>Loading customer...</div>;
  }

  return (
    <Stack gap="md">
      <PageHeader
        title={`${customer.name}'s Wallet`}
        subtitle="Manage customer wallet balance and view transaction history"
        actions={headerActions}
      />

      {/* Customer Info Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="lg" fw={500} mb="xs">
              {customer.name}
            </Text>
            <Group gap="sm">
              <Text size="sm" c="dimmed">
                {customer.email}
              </Text>
              <Text size="sm" c="dimmed">
                •
              </Text>
              <Text size="sm" c="dimmed">
                {customer.mobileNumber}
              </Text>
            </Group>
            <Text size="sm" c="dimmed" mt="xs">
              {customer.society?.name} • Building {customer.building?.name} •
              Flat {customer.flatNumber}
            </Text>
          </div>

          <Card shadow="xs" padding="md" radius="md" withBorder bg="blue.0">
            <Group gap="sm">
              <IconWallet size={24} color="blue" />
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Wallet Balance
                </Text>
                <Text
                  size="xl"
                  fw={700}
                  c={(wallet?.balance ?? 0) >= 0 ? 'green' : 'red'}
                >
                  {formatCurrency(wallet?.balance || 0)}
                </Text>
              </div>
            </Group>
          </Card>
        </Group>
      </Card>

      {/* Transaction History */}
      <DataTable
        data={transactions}
        columns={columns}
        loading={isLoading}
        emptyMessage="No transactions found"
      />

      {/* Credit Modal */}
      <Modal
        opened={creditModalOpened}
        onClose={() => setCreditModalOpened(false)}
        title="Credit Customer Wallet"
        size="md"
      >
        <Form
          onSubmit={handleCreditSubmit}
          actions={creditFormActions}
          loading={crediting}
        >
          <Stack gap="md">
            <FormField>
              <NumberInput
                label="Credit Amount"
                placeholder="Enter amount to credit"
                required
                min={0.01}
                decimalScale={2}
                fixedDecimalScale
                prefix="₹"
                value={amount}
                onChange={(value) => setAmount(Number(value) || 0)}
              />
            </FormField>

            <FormField>
              <Textarea
                label="Description"
                placeholder="Enter reason for crediting..."
                required
                minRows={2}
                maxRows={4}
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
            </FormField>
          </Stack>
        </Form>
      </Modal>

      {/* Debit Modal */}
      <Modal
        opened={debitModalOpened}
        onClose={() => setDebitModalOpened(false)}
        title="Debit Customer Wallet"
        size="md"
      >
        <Form
          onSubmit={handleDebitSubmit}
          actions={debitFormActions}
          loading={debiting}
        >
          <Stack gap="md">
            <div>
              <Text size="sm" c="orange" fw={500} mb="xs">
                Current Balance: {formatCurrency(wallet?.balance || 0)}
              </Text>
              {wallet && wallet.balance < amount && (
                <Text size="sm" c="red">
                  Insufficient balance for this transaction
                </Text>
              )}
            </div>

            <FormField>
              <NumberInput
                label="Debit Amount"
                placeholder="Enter amount to debit"
                required
                min={0.01}
                max={wallet?.balance || 0}
                decimalScale={2}
                fixedDecimalScale
                prefix="₹"
                value={amount}
                onChange={(value) => setAmount(Number(value) || 0)}
              />
            </FormField>

            <FormField>
              <Textarea
                label="Description"
                placeholder="Enter reason for debiting..."
                required
                minRows={2}
                maxRows={4}
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
            </FormField>
          </Stack>
        </Form>
      </Modal>
    </Stack>
  );
};
