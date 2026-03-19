'use client';

import React from 'react';
import { ActionIcon, Alert, Box, Button, Card, Divider, Group, Loader, Stack, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconReceiptRupee } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { colors, radius, spacing, typography } from '../../../../theme';
import { Text } from '../../../../components/ui';
import { ConfirmDialog } from '../../../../components/ui/Modal';
import { getErrorMessage } from '../../../../lib/api-client';
import { ordersApi } from '../../../../lib/api/services';
import { useAuth } from '../../../../store/app-store';
import { useReorder } from '../../../../hooks/use-api';

type AccountOrderStatus =
  | 'pending'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

type PaymentMode = 'wallet' | 'monthly' | 'cod';

interface AccountOrderItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
  finalPrice: number;
}

interface AccountOrder {
  id: string;
  customerId?: string;
  status: AccountOrderStatus;
  paymentMode: PaymentMode;
  totalAmount: number;
  discount: number;
  createdAt: string;
  deliveryDate?: string;
  items: AccountOrderItem[];
}

const statusLabelMap: Record<AccountOrderStatus, string> = {
  pending: 'Pending',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const paymentModeLabelMap: Record<PaymentMode, string> = {
  wallet: 'Wallet',
  monthly: 'Monthly Bill',
  cod: 'Cash on Delivery',
};

const statusColorMap: Record<AccountOrderStatus, string> = {
  pending: '#a16207',
  out_for_delivery: colors.primary,
  delivered: colors.success,
  cancelled: colors.error,
};

const standardCardShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';

const toNumber = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeStatus = (value: unknown): AccountOrderStatus => {
  const status = String(value || 'pending');

  if (status === 'delivered') {
    return 'delivered';
  }

  if (status === 'cancelled') {
    return 'cancelled';
  }

  if (status === 'out_for_delivery' || status === 'confirmed') {
    return 'out_for_delivery';
  }

  return 'pending';
};

const normalizePaymentMode = (value: unknown): PaymentMode => {
  const paymentMode = String(value || 'cod');

  if (paymentMode === 'wallet' || paymentMode === 'monthly' || paymentMode === 'cod') {
    return paymentMode;
  }

  return 'cod';
};

const normalizeUnit = (value: unknown): 'gm' | 'kg' | 'pc' => {
  const unit = String(value || 'pc');
  return unit === 'gm' || unit === 'kg' || unit === 'pc' ? unit : 'pc';
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDateTime = (value?: string) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const formatQuantity = (quantity: number, unit: 'gm' | 'kg' | 'pc') =>
  `${Number.isInteger(quantity) ? quantity : quantity.toFixed(2)} ${unit}`;

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

const normalizeOrder = (payload: Record<string, unknown>, fallbackId: string) => {
  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  const items: AccountOrderItem[] = rawItems.map((item, index) => {
    const resolvedItem =
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : ({} as Record<string, unknown>);

    return {
      id: String(resolvedItem.id || `${fallbackId}-${index}`),
      productId: String(resolvedItem.productId || ''),
      productName: String(resolvedItem.productName || 'Product'),
      orderedQuantity: toNumber(resolvedItem.orderedQuantity || resolvedItem.quantity || 1),
      unit: normalizeUnit(resolvedItem.unit),
      finalPrice: toNumber(
        resolvedItem.finalPrice || resolvedItem.total || resolvedItem.price || 0
      ),
    };
  });

  return {
    id: String(payload.id || fallbackId),
    customerId: typeof payload.customerId === 'string' ? payload.customerId : undefined,
    status: normalizeStatus(payload.status),
    paymentMode: normalizePaymentMode(payload.paymentMode),
    totalAmount: toNumber(payload.totalAmount),
    discount: toNumber(payload.discount),
    createdAt: String(payload.createdAt || new Date().toISOString()),
    deliveryDate: typeof payload.deliveryDate === 'string' ? payload.deliveryDate : undefined,
    items,
  } satisfies AccountOrder;
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const auth = useAuth();

  const rawOrderId = params?.id;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const { handleReorder, handleConfirmReorder, isReordering, confirmOpen, closeConfirm } = useReorder();

  const [order, setOrder] = React.useState<AccountOrder | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace('/account');
      return;
    }

    if (!orderId) {
      setErrorMessage('Order ID is missing.');
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const response = await ordersApi.getById(orderId);
        const rawResponse = response as any;
        const payload = (rawResponse?.data?.data ||
          rawResponse?.data ||
          rawResponse) as Record<string, unknown>;

        if (!payload || typeof payload !== 'object') {
          throw new Error('Invalid order response');
        }

        const resolvedOrder = normalizeOrder(payload, orderId);

        if (
          auth.user?.customerId &&
          resolvedOrder.customerId &&
          resolvedOrder.customerId !== auth.user.customerId
        ) {
          throw new Error('This order is not available for your account.');
        }

        if (!cancelled) {
          setOrder(resolvedOrder);
        }
      } catch (error) {
        if (!cancelled) {
          setOrder(null);
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, auth.user?.customerId, orderId, router]);

  const itemTotal = Number(order?.totalAmount || 0);
  const discount = Math.max(Number(order?.discount || 0), 0);
  const billTotal = Math.max(itemTotal - discount, 0);
  const totalItems =
    order?.items.reduce((sum, item) => sum + toNumber(item.orderedQuantity), 0) || 0;

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: '100vh', backgroundColor: '#f2f5f7' }}
    >
      <Box
        px={spacing.md}
        pb={spacing.lg}
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
        }}
      >
        <Group justify="space-between" align="center">
          <ActionIcon variant="subtle" onClick={() => router.back()}>
            <IconArrowLeft size={22} color={colors.text.primary} />
          </ActionIcon>
          <Text size="lg" fw={typography.fontWeight.bold}>
            Order Details
          </Text>
          <Box w={34} />
        </Group>
      </Box>

      <Stack p={spacing.md} gap={spacing.md}>
        {errorMessage && <Alert color="red">{errorMessage}</Alert>}

        {loading ? (
          <Group justify="center" py={spacing.lg}>
            <Loader size="sm" color={colors.primary} />
          </Group>
        ) : order ? (
          <>
            <Card
              withBorder
              p={spacing.md}
              style={{
                borderRadius: radius.lg,
                borderColor: withOpacity(colors.primary, 0.25),
                backgroundColor: colors.background,
                boxShadow: standardCardShadow,
              }}
            >
              <Group align="flex-start" gap={spacing.sm}>
                <ThemeIcon
                  radius="xl"
                  size={40}
                  style={{
                    backgroundColor: withOpacity(colors.secondary, 0.45),
                    color: colors.primary,
                  }}
                >
                  <IconReceiptRupee size={22} />
                </ThemeIcon>

                <Stack gap={2} style={{ flex: 1 }}>
                  <Text size="md" fw={typography.fontWeight.bold}>
                    Order #{order.id.slice(0, 12).toUpperCase()}
                  </Text>
                  <Text size="sm" variant="secondary">
                    {statusLabelMap[order.status]} • {formatDateTime(order.createdAt)}
                  </Text>
                  <Text
                    size="xs"
                    fw={typography.fontWeight.semibold}
                    style={{ color: statusColorMap[order.status] }}
                  >
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} •{' '}
                    {formatCurrency(billTotal)}
                  </Text>
                </Stack>
              </Group>
            </Card>

            <Card
              withBorder
              p={spacing.md}
              style={{
                borderRadius: radius.lg,
                borderColor: withOpacity(colors.primary, 0.18),
                backgroundColor: colors.background,
                boxShadow: standardCardShadow,
              }}
            >
              <Box
                px={spacing.sm}
                py={6}
                mb={spacing.sm}
                style={{
                  borderRadius: radius.sm,
                  backgroundColor: withOpacity(colors.secondary, 0.35),
                }}
              >
                <Text size="sm" fw={typography.fontWeight.bold}>
                  BILL DETAILS
                </Text>
              </Box>

              {order.items.length > 0 && (
                <>
                  <Stack gap={spacing.sm} mb={spacing.sm}>
                    {order.items.map((item) => (
                      <Group key={item.id} justify="space-between" align="flex-start">
                        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                          <Text size="sm" fw={typography.fontWeight.semibold}>
                            {item.productName}
                          </Text>
                          <Text size="xs" variant="secondary">
                            {formatQuantity(item.orderedQuantity, item.unit)}
                          </Text>
                        </Stack>

                        <Text size="sm" fw={typography.fontWeight.semibold}>
                          {formatCurrency(item.finalPrice)}
                        </Text>
                      </Group>
                    ))}
                  </Stack>

                  <Divider mb={spacing.sm} color={withOpacity(colors.border, 0.9)} />
                </>
              )}

              <Stack gap={spacing.xs}>
                <BillRow label="Item Total" value={formatCurrency(itemTotal)} />

                {discount > 0 && (
                  <BillRow
                    label="Discount Applied"
                    value={`- ${formatCurrency(discount)}`}
                    valueColor={colors.success}
                  />
                )}

                <Divider my={4} color={withOpacity(colors.border, 0.9)} />

                <Group justify="space-between" align="baseline">
                  <Text size="sm" fw={typography.fontWeight.semibold} variant="secondary">
                    Paid Via {paymentModeLabelMap[order.paymentMode]}
                  </Text>
                  <Group gap={spacing.xs} align="baseline">
                    <Text size="md" fw={typography.fontWeight.bold}>
                      Bill Total
                    </Text>
                    <Text
                      size="xl"
                      fw={typography.fontWeight.bold}
                      style={{ color: colors.primary, lineHeight: 1 }}
                    >
                      {formatCurrency(billTotal)}
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Card>
            {order && (
              <Button
                fullWidth
                size="md"
                onClick={() => handleReorder(order)}
                loading={isReordering}
                disabled={!order.items?.length}
                aria-label="Reorder items from this order"
                style={{
                  minHeight: 44,
                  borderRadius: radius.md,
                  backgroundColor: colors.primary,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Reorder
              </Button>
            )}
          </>
        ) : null}
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

function BillRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Group justify="space-between" align="center">
      <Text size="sm" variant="secondary">
        {label}
      </Text>
      <Text
        size="sm"
        fw={typography.fontWeight.semibold}
        style={{ color: valueColor || colors.text.primary }}
      >
        {value}
      </Text>
    </Group>
  );
}
