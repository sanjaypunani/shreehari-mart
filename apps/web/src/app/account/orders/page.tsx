'use client';

import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Skeleton,
  Stack,
} from '@mantine/core';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors, radius, spacing, typography } from '../../../theme';
import { Text } from '../../../components/ui';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { authApi, ordersApi } from '../../../lib/api/services';
import { getErrorMessage } from '../../../lib/api-client';
import { useAuth, useAppStore } from '../../../store/app-store';
import { useReorder } from '../../../hooks/use-api';

type AccountOrderStatus =
  | 'pending'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

interface AccountOrderItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
  baseQuantity?: number;
  pricePerBaseUnit?: number;
  finalPrice?: number;
  price?: number;
  quantity?: number;
}

interface AccountOrder {
  id: string;
  status: AccountOrderStatus;
  paymentMode: 'wallet' | 'monthly' | 'cod';
  totalAmount: number;
  createdAt: string;
  deliveryDate?: string;
  items?: AccountOrderItem[];
}

const hexToRgb = (hex: string) => {
  const trimmed = hex.replace('#', '').trim();
  const normalized =
    trimmed.length === 3
      ? trimmed
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : trimmed;

  if (normalized.length !== 6) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 16);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
};

const withOpacity = (hex: string, alpha: number) => {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return hex;
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!value) {
    return '-';
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value));
};

const normalizeStatus = (value: string): AccountOrderStatus => {
  if (value === 'delivered') {
    return 'delivered';
  }
  if (value === 'cancelled') {
    return 'cancelled';
  }
  if (value === 'out_for_delivery' || value === 'confirmed') {
    return 'out_for_delivery';
  }
  return 'pending';
};

const statusLabelMap: Record<AccountOrderStatus, string> = {
  pending: 'Pending',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusToneMap: Record<
  AccountOrderStatus,
  { text: string; background: string; border: string }
> = {
  pending: {
    text: '#9a6a00',
    background: withOpacity(colors.secondary, 0.36),
    border: withOpacity('#b88900', 0.45),
  },
  out_for_delivery: {
    text: '#1d4ed8',
    background: withOpacity('#2563eb', 0.16),
    border: withOpacity('#2563eb', 0.35),
  },
  delivered: {
    text: '#166534',
    background: withOpacity(colors.success, 0.16),
    border: withOpacity(colors.success, 0.35),
  },
  cancelled: {
    text: '#991b1b',
    background: withOpacity(colors.error, 0.14),
    border: withOpacity(colors.error, 0.3),
  },
};

const standardCardShadow = '0 4px 12px rgba(0,0,0,0.06)';

export default function OrdersPage() {
  const router = useRouter();
  const auth = useAuth();
  const updateUser = useAppStore((state) => state.updateUser);

  const {
    handleReorder,
    handleConfirmReorder,
    reorderingOrderId,
    confirmOpen,
    closeConfirm,
  } = useReorder(true);

  const [orders, setOrders] = React.useState<AccountOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      setLoadingOrders(false);
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        setError(null);

        // Fetch profile to get the customer ID (same pattern as account/page.tsx)
        const profileResponse = await authApi.me();

        if (cancelled) {
          return;
        }

        if (profileResponse.data.requiresSignup || !profileResponse.data.customer) {
          router.replace('/account/signup');
          return;
        }

        updateUser({
          name: profileResponse.data.user.name,
          email: profileResponse.data.user.email,
          customerId: profileResponse.data.user.customerId,
          mobileNumber: profileResponse.data.user.mobileNumber,
        });

        const customerId = profileResponse.data.customer.id;

        const response = await ordersApi.getAll({
          customerId,
          page: 1,
          limit: 20,
        });

        if (cancelled) {
          return;
        }

        const rawResponse = response as any;

        const resolvedOrders = Array.isArray(rawResponse?.data?.data)
          ? rawResponse.data.data
          : Array.isArray(rawResponse?.data)
            ? rawResponse.data
            : [];

        const normalizedOrders = resolvedOrders.map((order: any) => ({
          ...order,
          status: normalizeStatus(String(order?.status || 'pending')),
        }));

        setOrders(normalizedOrders as AccountOrder[]);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingOrders(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, router, updateUser]);

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: colors.surface,
        paddingBottom: 'calc(90px + env(safe-area-inset-bottom))',
      }}
    >
      {/* Header */}
      <Group
        justify="space-between"
        align="center"
        p={spacing.md}
        style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.background }}
      >
        <ActionIcon
          variant="subtle"
          onClick={() => router.back()}
          aria-label="Go back"
          style={{ color: colors.text.primary }}
        >
          <IconArrowLeft size={22} />
        </ActionIcon>
        <Text size="lg" fw={typography.fontWeight.bold}>
          My Orders
        </Text>
        <Box w={34} />
      </Group>

      <Stack p={spacing.md} gap={spacing.md}>
        {/* Loading skeleton */}
        {loadingOrders &&
          Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              p={spacing.md}
              style={{
                borderRadius: radius.md,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.background,
              }}
            >
              <Stack gap={spacing.sm}>
                <Skeleton height={16} width="55%" radius="sm" />
                <Skeleton height={12} width="40%" radius="sm" />
                <Skeleton height={14} width="70%" radius="sm" />
                <Skeleton height={44} radius="md" />
              </Stack>
            </Card>
          ))}

        {/* Error state */}
        {!loadingOrders && error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Failed to load orders"
            color="red"
            radius="md"
          >
            {error}
          </Alert>
        )}

        {/* Empty state */}
        {!loadingOrders && !error && orders.length === 0 && (
          <Stack align="center" gap={spacing.sm} py={spacing.xl}>
            <Text size="md" fw={typography.fontWeight.bold}>
              No orders yet
            </Text>
            <Text size="sm" variant="secondary" ta="center">
              Start shopping fresh vegetables
            </Text>
          </Stack>
        )}

        {/* Order cards */}
        {!loadingOrders &&
          !error &&
          orders.map((order) => {
            const itemsCount =
              order.items?.reduce((sum, item) => {
                const quantity = Number(item.quantity || 1);
                return sum + (Number.isFinite(quantity) ? quantity : 1);
              }, 0) || 0;

            const statusTone = statusToneMap[order.status];
            const statusLabel = statusLabelMap[order.status];

            return (
              <Card
                key={order.id}
                p={spacing.md}
                style={{
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.background,
                  boxShadow: standardCardShadow,
                }}
              >
                <Stack gap={spacing.sm}>
                  <Group justify="space-between" align="flex-start">
                    <Text size="sm" fw={typography.fontWeight.semibold}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </Text>
                    <Badge
                      size="sm"
                      radius="xl"
                      styles={{
                        root: {
                          backgroundColor: statusTone.background,
                          border: `1px solid ${statusTone.border}`,
                          color: statusTone.text,
                          fontWeight: typography.fontWeight.semibold,
                        },
                        label: { color: 'inherit' },
                      }}
                    >
                      {statusLabel}
                    </Badge>
                  </Group>

                  <Text size="xs" variant="secondary">
                    {statusLabel} •{' '}
                    {formatDate(order.createdAt, {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>

                  <Group justify="space-between" align="center">
                    <Text size="sm" variant="secondary">
                      {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                    </Text>
                    <Text size="sm" fw={typography.fontWeight.bold}>
                      {formatCurrency(Number(order.totalAmount || 0))}
                    </Text>
                  </Group>

                  <Group grow>
                    <Button
                      variant="default"
                      onClick={() => router.push(`/account/orders/${order.id}`)}
                      style={{
                        minHeight: 44,
                        borderRadius: radius.md,
                        borderColor: withOpacity(colors.primary, 0.3),
                        color: colors.primary,
                        fontWeight: typography.fontWeight.semibold,
                      }}
                    >
                      View Details
                    </Button>

                    <Button
                      aria-label="Reorder items from this order"
                      onClick={() => handleReorder(order)}
                      loading={reorderingOrderId === order.id}
                      disabled={!order.items?.length}
                      style={{
                        minHeight: 44,
                        borderRadius: radius.md,
                        backgroundColor: colors.primary,
                        fontWeight: typography.fontWeight.semibold,
                      }}
                    >
                      Reorder
                    </Button>
                  </Group>
                </Stack>
              </Card>
            );
          })}
      </Stack>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={closeConfirm}
        onConfirm={handleConfirmReorder}
        title="Replace your cart?"
        message="Your cart has existing items. Do you want to replace them with this order?"
        confirmText="Replace Cart"
        cancelText="Cancel"
        variant="warning"
        loading={false}
      />
    </Box>
  );
}
