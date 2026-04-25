'use client';

import React from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import {
  IconCalendarStats,
  IconChevronRight,
  IconEdit,
  IconLogout,
  IconShoppingBag,
  IconWallet,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, radius, spacing, typography } from '../../theme';
import { Text } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/Modal';
import { LoginBottomSheet } from '../../components/auth/LoginBottomSheet';
import { authApi, AuthProfilePayload, ordersApi } from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';
import { useAuth, useAppStore } from '../../store/app-store';
import { useReorder } from '../../hooks/use-api';

type AccountOrderStatus =
  | 'pending'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

interface AccountOrder {
  id: string;
  status: AccountOrderStatus;
  paymentMode: 'wallet' | 'monthly' | 'cod';
  totalAmount: number;
  createdAt: string;
  deliveryDate?: string;
  items?: Array<{
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
  }>;
}

const standardCardShadow = '0 8px 20px rgba(15, 23, 42, 0.08)';

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
    background: withOpacity(colors.warning, 0.2),
    border: withOpacity('#b88900', 0.36),
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

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const logout = useAppStore((state) => state.logout);
  const updateUser = useAppStore((state) => state.updateUser);
  const [loginOpen, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);

  const {
    handleReorder,
    handleConfirmReorder,
    reorderingOrderId,
    confirmOpen,
    closeConfirm,
  } = useReorder(true);

  const [profile, setProfile] = React.useState<AuthProfilePayload | null>(null);
  const [orders, setOrders] = React.useState<AccountOrder[]>([]);
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [loadingOrders, setLoadingOrders] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      setProfile(null);
      setOrders([]);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setErrorMessage(null);

        const response = await authApi.me();

        if (cancelled) {
          return;
        }

        if (response.data.requiresSignup || !response.data.customer) {
          router.replace('/account/signup');
          return;
        }

        setProfile(response.data);

        updateUser({
          name: response.data.user.name,
          email: response.data.user.email,
          customerId: response.data.user.customerId,
          mobileNumber: response.data.user.mobileNumber,
        });
      } catch (error) {
        if (!cancelled) {
          const statusCode = (error as any)?.response?.status;
          if (statusCode === 401) {
            logout();
            return;
          }
          setErrorMessage(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, router, updateUser, logout]);

  React.useEffect(() => {
    if (!profile?.customer?.id) {
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoadingOrders(true);

        const response = await ordersApi.getAll({
          customerId: profile.customer!.id,
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
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error));
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
  }, [profile?.customer?.id]);

  const scrollToOrders = React.useCallback(() => {
    document
      .getElementById('past-orders-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  React.useEffect(() => {
    const section = searchParams.get('section');
    if (section !== 'orders') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      scrollToOrders();
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [searchParams, scrollToOrders, loadingOrders]);

  const customerName =
    profile?.customer?.name || auth.user?.name || 'Guest Customer';
  const customerPhone = profile?.customer?.mobileNumber
    ? `+91 ${profile.customer.mobileNumber}`
    : auth.user?.mobileNumber
      ? `+91 ${auth.user.mobileNumber}`
      : '+91 00000 00000';

  const initials = customerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const isMonthlyEnabled = !!profile?.customer?.isMonthlyPayment;

  if (!auth.isAuthenticated) {
    return (
      <Box
        pb={`calc(88px + var(--safe-area-bottom))`}
        style={{ minHeight: 'var(--app-viewport-height)' }}
      >
        <LoginBottomSheet
          opened={loginOpen}
          onClose={closeLogin}
          returnUrl="/account"
        />

        <Stack px={spacing.xs} py={spacing.sm} gap={spacing.sm}>
          <Card
            p={spacing.md}
            style={{
              borderRadius: 24,
              background:
                'linear-gradient(145deg, rgba(31,122,99,0.92) 0%, rgba(24,97,79,1) 100%)',
              color: colors.text.inverse,
              boxShadow: '0 16px 28px rgba(31, 122, 99, 0.28)',
            }}
          >
            <Group justify="center" mb={spacing.md}>
              <Text size="sm" fw={typography.fontWeight.semibold}>
                Account
              </Text>
            </Group>

            <Stack gap={4}>
              <Text
                style={{
                  fontSize: '24px',
                  lineHeight: 1.1,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.inverse,
                  letterSpacing: '-0.02em',
                }}
              >
                Login to manage your orders faster
              </Text>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Track deliveries, reorder in one tap, and manage billing details.
              </Text>
            </Stack>
          </Card>

          <Card
            p={spacing.md}
            style={{
              borderRadius: 20,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              boxShadow: standardCardShadow,
            }}
          >
            <Button
              fullWidth
              size="md"
              radius="xl"
              onClick={openLogin}
              style={{
                minHeight: 'var(--touch-target-size)',
                backgroundColor: colors.primary,
                color: colors.text.inverse,
                fontWeight: typography.fontWeight.bold,
              }}
            >
              Login / Signup
            </Button>
          </Card>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: 'var(--app-viewport-height)' }}
    >
      <LoginBottomSheet
        opened={loginOpen}
        onClose={closeLogin}
        returnUrl="/account"
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={closeConfirm}
        onConfirm={handleConfirmReorder}
        title="Replace your cart?"
        message="Your cart has existing items. Do you want to replace them with this order?"
        confirmText="Replace Cart"
        cancelText="Cancel"
        variant="warning"
        loading={!!reorderingOrderId}
      />

      <Stack px={spacing.xs} py={spacing.sm} gap={spacing.sm}>
        <Card
          p={spacing.md}
          style={{
            borderRadius: 24,
            border: `1px solid ${withOpacity(colors.primary, 0.22)}`,
            background:
              'linear-gradient(152deg, rgba(31,122,99,0.97) 0%, rgba(23,96,78,1) 100%)',
            boxShadow: '0 16px 28px rgba(31, 122, 99, 0.28)',
          }}
        >
          <Group justify="space-between" align="center" mb={spacing.md}>
            <Text
              size="sm"
              fw={typography.fontWeight.semibold}
              style={{ color: 'rgba(255,255,255,0.92)' }}
            >
              Account
            </Text>

            <Button
              variant="subtle"
              leftSection={<IconLogout size={16} />}
              onClick={logout}
              style={{
                minHeight: 'var(--touch-target-size)',
                color: colors.text.inverse,
                backgroundColor: 'rgba(255,255,255,0.14)',
                borderRadius: radius.full,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Logout
            </Button>
          </Group>

          {loadingProfile ? (
            <Stack gap={spacing.sm}>
              <Skeleton height={56} radius="xl" />
              <Skeleton height={14} width="50%" radius="sm" />
            </Stack>
          ) : (
            <Group justify="space-between" align="center" wrap="nowrap">
              <Group gap={spacing.sm} wrap="nowrap">
                <Avatar
                  radius="xl"
                  size={56}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    color: colors.text.inverse,
                    border: '1px solid rgba(255,255,255,0.28)',
                    fontWeight: typography.fontWeight.bold,
                  }}
                >
                  {initials || 'U'}
                </Avatar>
                <Stack gap={0}>
                  <Text
                    style={{
                      fontSize: '22px',
                      lineHeight: 1.12,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.text.inverse,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {customerName}
                  </Text>
                  <Text size="sm" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    {customerPhone}
                  </Text>
                  <Badge
                    radius="xl"
                    size="sm"
                    styles={{
                      root: {
                        marginTop: 6,
                        backgroundColor: 'rgba(255,255,255,0.16)',
                        color: colors.text.inverse,
                        border: '1px solid rgba(255,255,255,0.24)',
                      },
                    }}
                  >
                    {isMonthlyEnabled ? 'Monthly billing enabled' : 'Pay per order'}
                  </Badge>
                </Stack>
              </Group>

              <ActionIcon
                onClick={() => router.push('/account/edit')}
                aria-label="Edit profile"
                style={{
                  width: 'var(--touch-target-size)',
                  height: 'var(--touch-target-size)',
                  borderRadius: radius.full,
                  backgroundColor: 'rgba(255,255,255,0.17)',
                  color: colors.text.inverse,
                  border: '1px solid rgba(255,255,255,0.3)',
                  flexShrink: 0,
                }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Group>
          )}
        </Card>

        <SimpleGrid cols={2} spacing={spacing.sm}>
          <QuickActionTile
            icon={<IconShoppingBag size={20} />}
            label="My Orders"
            description="Track and reorder quickly"
            onClick={scrollToOrders}
          />
          <QuickActionTile
            icon={<IconWallet size={20} />}
            label="Wallet"
            description="Balance and transactions"
            onClick={() => router.push('/account/wallet')}
          />
          <QuickActionTile
            icon={<IconEdit size={20} />}
            label="Edit Profile"
            description="Update contact details"
            onClick={() => router.push('/account/edit')}
          />
          <QuickActionTile
            icon={<IconCalendarStats size={20} />}
            label="Monthly Bill"
            description={isMonthlyEnabled ? 'View current cycle' : 'Not enabled'}
            disabled={!isMonthlyEnabled}
            onClick={() => router.push('/account/monthly-billing')}
          />
        </SimpleGrid>

        <Card
          id="past-orders-section"
          p={spacing.md}
          style={{
            borderRadius: 22,
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.surface,
            boxShadow: standardCardShadow,
          }}
        >
          <Group justify="space-between" mb={spacing.sm}>
            <Stack gap={0}>
              <Text size="sm" fw={typography.fontWeight.bold}>
                Order history
              </Text>
              <Text size="xs" variant="secondary">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </Text>
            </Stack>
            <ThemeIcon
              size={34}
              radius="xl"
              style={{
                backgroundColor: withOpacity(colors.primary, 0.12),
                color: colors.primary,
              }}
            >
              <IconShoppingBag size={18} />
            </ThemeIcon>
          </Group>

          {loadingProfile || loadingOrders ? (
            <Stack gap={spacing.sm}>
              {[0, 1, 2].map((item) => (
                <Card
                  key={item}
                  p={spacing.sm}
                  style={{
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background,
                  }}
                >
                  <Stack gap={spacing.xs}>
                    <Skeleton height={16} radius="sm" width="55%" />
                    <Skeleton height={12} radius="sm" width="40%" />
                    <Skeleton height={14} radius="sm" width="70%" />
                    <Skeleton height={44} radius="md" />
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : errorMessage ? (
            <Text size="sm" c="red">
              {errorMessage}
            </Text>
          ) : orders.length === 0 ? (
            <Stack align="center" gap={spacing.sm} py={spacing.lg}>
              <Text size="md" fw={typography.fontWeight.bold}>
                No orders yet
              </Text>
              <Text size="sm" variant="secondary" ta="center">
                Start shopping to see your order timeline here.
              </Text>
              <Button
                size="sm"
                onClick={() => router.push('/')}
                style={{
                  minHeight: 'var(--touch-target-size)',
                  borderRadius: radius.full,
                  backgroundColor: colors.primary,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Start Shopping
              </Button>
            </Stack>
          ) : (
            <Stack gap={spacing.sm}>
              {orders.map((order) => {
                const itemsCount =
                  order.items?.reduce((sum, item) => {
                    const quantity = Number(item.quantity || 1);
                    return sum + (Number.isFinite(quantity) ? quantity : 1);
                  }, 0) || 0;

                const statusTone = statusToneMap[order.status];
                const statusLabel = statusLabelMap[order.status];

                return (
                  <Card
                    id={`order-${order.id}`}
                    key={order.id}
                    p={spacing.sm}
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.background,
                    }}
                  >
                    <Stack gap={spacing.xs}>
                      <Group justify="space-between" align="flex-start" gap={spacing.xs}>
                        <Stack gap={2}>
                          <Text size="sm" fw={typography.fontWeight.semibold}>
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </Text>
                          <Text size="xs" variant="secondary">
                            Placed {formatDate(order.createdAt, { day: 'numeric', month: 'short' })}
                          </Text>
                        </Stack>
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

                      <Group justify="space-between" align="center">
                        <Text size="sm" variant="secondary">
                          {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                        </Text>
                        <Text size="sm" fw={typography.fontWeight.bold}>
                          {formatCurrency(Number(order.totalAmount || 0))}
                        </Text>
                      </Group>

                      <Group grow mt={2}>
                        <Button
                          variant="default"
                          rightSection={<IconChevronRight size={16} />}
                          onClick={() => router.push(`/account/orders/${order.id}`)}
                          style={{
                            minHeight: 'var(--touch-target-size)',
                            borderRadius: radius.full,
                            borderColor: withOpacity(colors.primary, 0.3),
                            color: colors.primary,
                            fontWeight: typography.fontWeight.semibold,
                          }}
                        >
                          Details
                        </Button>

                        <Button
                          aria-label="Reorder items from this order"
                          onClick={() => handleReorder(order)}
                          loading={reorderingOrderId === order.id}
                          disabled={!order.items?.length}
                          style={{
                            minHeight: 'var(--touch-target-size)',
                            borderRadius: radius.full,
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
          )}
        </Card>
      </Stack>
    </Box>
  );
}

export default function AccountPage() {
  return (
    <React.Suspense
      fallback={
        <Box p={spacing.md}>
          <Text>Loading account...</Text>
        </Box>
      }
    >
      <AccountPageContent />
    </React.Suspense>
  );
}

function QuickActionTile({
  icon,
  label,
  description,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <UnstyledButton
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        minHeight: 96,
        padding: spacing.sm,
        borderRadius: 18,
        border: `1px solid ${disabled ? colors.border : withOpacity(colors.primary, 0.2)}`,
        backgroundColor: colors.surface,
        boxShadow: disabled ? 'none' : standardCardShadow,
        opacity: disabled ? 0.52 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap={spacing.sm} wrap="nowrap">
          <ThemeIcon
            size={40}
            radius="xl"
            style={{
              backgroundColor: withOpacity(colors.primary, 0.12),
              color: colors.primary,
            }}
          >
            {icon}
          </ThemeIcon>
          <Stack gap={1} align="flex-start">
            <Text size="sm" fw={typography.fontWeight.bold}>
              {label}
            </Text>
            <Text size="xs" variant="secondary" ta="left" style={{ lineHeight: 1.2 }}>
              {description}
            </Text>
          </Stack>
        </Group>
        <IconChevronRight size={16} color={colors.text.secondary} />
      </Group>
    </UnstyledButton>
  );
}
