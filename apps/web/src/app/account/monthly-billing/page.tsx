'use client';

import React from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Select,
  Stack,
} from '@mantine/core';
import { IconCalendarStats } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors, radius, spacing, typography } from '../../../theme';
import { Text } from '../../../components/ui';
import { StickyPageHeader } from '../../../components/navigation/StickyPageHeader';
import { authApi, monthlyBillingApi } from '../../../lib/api/services';
import { getErrorMessage } from '../../../lib/api-client';
import { useAuth } from '../../../store/app-store';

interface MonthlyOrder {
  id: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentMode: 'wallet' | 'monthly' | 'cod';
  totalAmount: number;
  createdAt: string;
  deliveryDate?: string;
}

interface MonthlyBillRecord {
  id: string;
  billNumber: string;
  billingPeriod: {
    month: string;
    year: number;
  };
  orderCount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate?: string;
  orders?: MonthlyOrder[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const billStatusColorMap: Record<MonthlyBillRecord['status'], string> = {
  draft: 'gray',
  sent: 'blue',
  paid: 'green',
  overdue: 'red',
};

const orderStatusColorMap: Record<MonthlyOrder['status'], string> = {
  delivered: 'green',
  confirmed: 'blue',
  pending: 'orange',
  cancelled: 'red',
};

export default function MonthlyBillingPage() {
  const router = useRouter();
  const auth = useAuth();

  const [bills, setBills] = React.useState<MonthlyBillRecord[]>([]);
  const [selectedBillId, setSelectedBillId] = React.useState<string | null>(null);
  const [selectedBillDetails, setSelectedBillDetails] =
    React.useState<MonthlyBillRecord | null>(null);
  const [isMonthlyEnabled, setIsMonthlyEnabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [loadingDetails, setLoadingDetails] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace('/account');
      return;
    }

    let cancelled = false;

    const loadBills = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const profileResponse = await authApi.me();

        if (cancelled) {
          return;
        }

        const customer = profileResponse.data.customer;

        if (!customer?.id) {
          router.replace('/account/signup');
          return;
        }

        setIsMonthlyEnabled(!!customer.isMonthlyPayment);

        if (!customer.isMonthlyPayment) {
          setBills([]);
          setSelectedBillId(null);
          setSelectedBillDetails(null);
          return;
        }

        const billsResponse = await monthlyBillingApi.getAll({
          customerId: customer.id,
          page: 1,
          limit: 24,
        });

        if (cancelled) {
          return;
        }

        const resolvedBills = Array.isArray(billsResponse.data?.data)
          ? billsResponse.data.data
          : [];

        const mappedBills = resolvedBills as MonthlyBillRecord[];
        setBills(mappedBills);

        if (mappedBills.length > 0) {
          setSelectedBillId(mappedBills[0].id);
        } else {
          setSelectedBillId(null);
          setSelectedBillDetails(null);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBills();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, router]);

  React.useEffect(() => {
    if (!selectedBillId) {
      return;
    }

    let cancelled = false;

    const loadBillDetails = async () => {
      try {
        setLoadingDetails(true);

        const detailsResponse = await monthlyBillingApi.getById(selectedBillId);

        if (cancelled) {
          return;
        }

        setSelectedBillDetails(detailsResponse.data as MonthlyBillRecord);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    };

    loadBillDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedBillId]);

  const selectedBill =
    selectedBillDetails || bills.find((bill) => bill.id === selectedBillId) || null;
  const currentBill = selectedBill || bills[0] || null;
  const billOrders = currentBill?.orders || [];

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: '100vh', backgroundColor: '#f2f5f7' }}
    >
      <StickyPageHeader title="Monthly Billing" onBack={() => router.back()} />

      <Stack p={spacing.md} gap={spacing.md}>
        {errorMessage && <Alert color="red">{errorMessage}</Alert>}

        {!isMonthlyEnabled ? (
          <Card
            withBorder
            p={spacing.md}
            style={{
              borderRadius: radius.lg,
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <Text size="sm" variant="secondary">
              Monthly billing is not enabled for this account.
            </Text>
          </Card>
        ) : loading ? (
          <Group justify="center" py={spacing.lg}>
            <Loader size="sm" color={colors.primary} />
          </Group>
        ) : bills.length === 0 ? (
          <Card
            withBorder
            p={spacing.md}
            style={{
              borderRadius: radius.lg,
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <Text size="sm" variant="secondary">
              No monthly bills found.
            </Text>
          </Card>
        ) : (
          <>
            <Card
              p={spacing.lg}
              style={{
                borderRadius: radius.lg,
                background:
                  'linear-gradient(145deg, rgba(243,154,37,1) 0%, rgba(229,111,37,1) 100%)',
                color: colors.text.inverse,
              }}
            >
              <Group justify="space-between" align="center">
                <Stack gap={2}>
                  <Text size="sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {currentBill?.billNumber || 'Monthly Bill'}
                  </Text>
                  <Text
                    size="2rem"
                    fw={typography.fontWeight.bold}
                    style={{ color: colors.text.inverse, lineHeight: 1 }}
                  >
                    {formatCurrency(Number(currentBill?.totalAmount || 0))}
                  </Text>
                </Stack>
                <IconCalendarStats size={32} color={colors.text.inverse} />
              </Group>

              <Group mt={spacing.sm} justify="space-between">
                <Badge
                  variant="filled"
                  color={currentBill ? billStatusColorMap[currentBill.status] : 'gray'}
                >
                  {currentBill?.status.toUpperCase() || 'DRAFT'}
                </Badge>
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  Due {formatDate(currentBill?.dueDate)}
                </Text>
              </Group>

              <Button
                mt={spacing.md}
                fullWidth
                disabled
                style={{
                  borderRadius: radius.md,
                  backgroundColor: colors.text.inverse,
                  color: '#d06024',
                  fontWeight: typography.fontWeight.bold,
                }}
              >
                Pay Bill Now (Coming Soon)
              </Button>
            </Card>

            <Card
              withBorder
              p={spacing.md}
              shadow="sm"
              style={{
                borderRadius: radius.lg,
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              <Stack gap={spacing.md}>
                <Select
                  label="Select Billing Cycle"
                  data={bills.map((bill) => ({
                    value: bill.id,
                    label: `${bill.billNumber} • ${bill.billingPeriod.month}`,
                  }))}
                  value={selectedBillId || bills[0]?.id || null}
                  onChange={setSelectedBillId}
                />

                <Group justify="space-between">
                  <Text size="sm" fw={typography.fontWeight.bold}>
                    Orders in Bill
                  </Text>
                  <Text size="xs" variant="secondary">
                    {currentBill?.orderCount || billOrders.length} orders
                  </Text>
                </Group>

                {loadingDetails ? (
                  <Group justify="center" py={spacing.md}>
                    <Loader size="sm" color={colors.primary} />
                  </Group>
                ) : billOrders.length === 0 ? (
                  <Text size="sm" variant="secondary">
                    No orders found in this bill.
                  </Text>
                ) : (
                  <Stack gap={0}>
                    {billOrders.map((order, index) => (
                      <Box key={order.id}>
                        <Group py={spacing.sm} justify="space-between" align="flex-start">
                          <Stack gap={2}>
                            <Text size="sm" fw={typography.fontWeight.semibold}>
                              Order {order.id.slice(0, 8).toUpperCase()}
                            </Text>
                            <Text size="xs" variant="secondary">
                              {formatDate(order.deliveryDate || order.createdAt)} • {order.paymentMode.toUpperCase()}
                            </Text>
                          </Stack>
                          <Stack gap={4} align="flex-end">
                            <Badge variant="light" color={orderStatusColorMap[order.status]}>
                              {order.status.toUpperCase()}
                            </Badge>
                            <Text size="sm" fw={typography.fontWeight.bold}>
                              {formatCurrency(Number(order.totalAmount || 0))}
                            </Text>
                          </Stack>
                        </Group>
                        {index !== billOrders.length - 1 && (
                          <Divider color={colors.border} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
}
