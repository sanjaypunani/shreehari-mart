'use client';

import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import { IconCreditCard, IconWallet } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors, radius, spacing, typography } from '../../../theme';
import { Text } from '../../../components/ui';
import { StickyPageHeader } from '../../../components/navigation/StickyPageHeader';
import { authApi, customersApi } from '../../../lib/api/services';
import { getErrorMessage } from '../../../lib/api-client';
import { useAuth } from '../../../store/app-store';

interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

export default function WalletPage() {
  const router = useRouter();
  const auth = useAuth();

  const [walletBalance, setWalletBalance] = React.useState(0);
  const [transactions, setTransactions] = React.useState<WalletTransaction[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace('/account');
      return;
    }

    let cancelled = false;

    const loadWalletData = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        let customerId = auth.user?.customerId;

        if (!customerId) {
          const profileResponse = await authApi.me();
          customerId = profileResponse.data.customer?.id || null;
        }

        if (!customerId) {
          router.replace('/account/signup');
          return;
        }

        const [walletResponse, transactionsResponse] = await Promise.all([
          customersApi.getWallet(customerId),
          customersApi.getWalletTransactions(customerId, { page: 1, limit: 30 }),
        ]);

        if (cancelled) {
          return;
        }

        const walletData = walletResponse.data;
        const transactionData = Array.isArray(transactionsResponse.data?.data)
          ? transactionsResponse.data.data
          : [];

        setWalletBalance(Number(walletData?.balance || 0));
        setTransactions(transactionData as WalletTransaction[]);
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

    loadWalletData();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, auth.user?.customerId, router]);

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: '100vh', backgroundColor: '#f2f5f7' }}
    >
      <StickyPageHeader title="Wallet" onBack={() => router.back()} />

      <Stack p={spacing.md} gap={spacing.md}>
        {errorMessage && <Alert color="red">{errorMessage}</Alert>}

        <Card
          p={spacing.lg}
          style={{
            borderRadius: radius.lg,
            background:
              'linear-gradient(135deg, rgba(36,124,98,1) 0%, rgba(30,154,113,1) 100%)',
          }}
        >
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Available Wallet Balance
              </Text>
              <Text
                size="2rem"
                fw={typography.fontWeight.bold}
                style={{ color: colors.text.inverse, lineHeight: 1 }}
              >
                {loading ? '...' : formatCurrency(walletBalance)}
              </Text>
            </Stack>
            <ThemeIcon
              size={44}
              radius="xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <IconWallet size={24} color={colors.text.inverse} />
            </ThemeIcon>
          </Group>

          <Button
            fullWidth
            mt={spacing.md}
            leftSection={<IconCreditCard size={18} />}
            disabled
            style={{
              height: 44,
              borderRadius: radius.md,
              backgroundColor: colors.text.inverse,
              color: colors.primary,
              fontWeight: typography.fontWeight.bold,
            }}
          >
            Add Balance (Coming Soon)
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
          <Text size="sm" fw={typography.fontWeight.bold} mb={spacing.sm}>
            Wallet Transactions
          </Text>

          {loading ? (
            <Group justify="center" py={spacing.lg}>
              <Loader size="sm" color={colors.primary} />
            </Group>
          ) : transactions.length === 0 ? (
            <Text size="sm" variant="secondary">
              No recent wallet transactions.
            </Text>
          ) : (
            <Stack gap={0}>
              {transactions.map((transaction, index) => (
                <Box key={transaction.id}>
                  <Group py={spacing.sm} justify="space-between" align="center">
                    <Stack gap={1}>
                      <Text size="sm" fw={typography.fontWeight.semibold}>
                        {transaction.description}
                      </Text>
                      <Text size="xs" variant="secondary">
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </Stack>
                    <Text
                      size="sm"
                      fw={typography.fontWeight.bold}
                      style={{
                        color:
                          transaction.type === 'credit'
                            ? colors.success
                            : colors.error,
                      }}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(Number(transaction.amount || 0))}
                    </Text>
                  </Group>
                  {index !== transactions.length - 1 && (
                    <Divider color={colors.border} />
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Card>
      </Stack>
    </Box>
  );
}
