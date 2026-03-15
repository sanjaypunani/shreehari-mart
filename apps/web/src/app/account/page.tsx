'use client';

import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Menu,
  SimpleGrid,
  Skeleton,
  Stack,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconCalendarStats,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconLogout,
  IconShoppingBag,
  IconTruckDelivery,
  IconWallet,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, radius, shadow, spacing, typography } from '../../theme';
import { Text } from '../../components/ui';
import { LoginBottomSheet } from '../../components/auth/LoginBottomSheet';
import {
  authApi,
  AuthProfilePayload,
  ordersApi,
  productsApi,
} from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';
import { useAuth, useAppStore } from '../../store/app-store';
import { useCartStore } from '../../store/cart-store';
import { toApiAssetUrl } from '../../config/api';

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

const standardCardShadow = '0 4px 12px rgba(0,0,0,0.06)';

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

const mixHex = (source: string, target: string, weight: number) => {
  const sourceRgb = hexToRgb(source);
  const targetRgb = hexToRgb(target);

  if (!sourceRgb || !targetRgb) {
    return source;
  }

  const mix = (start: number, end: number) =>
    Math.round(start + (end - start) * weight)
      .toString(16)
      .padStart(2, '0');

  return `#${mix(sourceRgb.r, targetRgb.r)}${mix(sourceRgb.g, targetRgb.g)}${mix(sourceRgb.b, targetRgb.b)}`;
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

const isActiveOrder = (status: AccountOrderStatus) =>
  status === 'pending' || status === 'out_for_delivery';

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const logout = useAppStore((state) => state.logout);
  const updateUser = useAppStore((state) => state.updateUser);
  const addItem = useCartStore((state) => state.addItem);
  const [loginOpen, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);

  const [profile, setProfile] = React.useState<AuthProfilePayload | null>(null);
  const [orders, setOrders] = React.useState<AccountOrder[]>([]);
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [loadingOrders, setLoadingOrders] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [reorderingOrderId, setReorderingOrderId] = React.useState<
    string | null
  >(null);

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

  const isMonthlyEnabled = !!profile?.customer?.isMonthlyPayment;
  const activeOrder = orders.find((order) => isActiveOrder(order.status)) || null;

  const handleTrackOrder = () => {
    if (!activeOrder) {
      return;
    }

    document
      .getElementById(`order-${activeOrder.id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleReorder = async (order: AccountOrder) => {
    if (!order.items?.length || reorderingOrderId) {
      return;
    }

    try {
      setReorderingOrderId(order.id);

      const productResponses = await Promise.allSettled(
        order.items.map((item) => productsApi.getById(item.productId))
      );

      const productMap = new Map<string, any>();
      productResponses.forEach((response, index) => {
        if (response.status !== 'fulfilled') {
          return;
        }

        const item = order.items?.[index];
        if (!item) {
          return;
        }

        const resolvedProduct = (response.value as any)?.data || response.value;
        productMap.set(item.productId, resolvedProduct);
      });

      order.items.forEach((item) => {
        const product = productMap.get(item.productId);
        const baseUnit = (product?.unit || item.unit) as 'gm' | 'kg' | 'pc';
        const orderedQuantity =
          Number(item.orderedQuantity) > 0
            ? Number(item.orderedQuantity)
            : Number(product?.quantity || item.baseQuantity || 1);
        const baseQuantity =
          Number(product?.quantity || item.baseQuantity || orderedQuantity) || 1;
        const basePrice = Number(
          product?.price ||
            item.pricePerBaseUnit ||
            item.price ||
            item.finalPrice ||
            0
        );

        addItem({
          id: item.productId,
          name: item.productName || product?.name || 'Product',
          image: toApiAssetUrl(product?.imageUrl),
          price: basePrice,
          quantity: 1,
          orderedQuantity,
          unit: item.unit,
          productQuantity: `${orderedQuantity} ${item.unit}`,
          baseQuantity,
          basePrice,
          baseUnit,
          isAvailable: product?.isAvailable !== false,
          selectedVariant: `${orderedQuantity}${item.unit}`,
        });
      });

      notifications.show({
        color: 'green',
        title: 'Added to cart',
        message: 'Items from this order were added to your cart.',
      });

      router.push('/cart');
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Unable to reorder',
        message: getErrorMessage(error),
      });
    } finally {
      setReorderingOrderId(null);
    }
  };

  if (!auth.isAuthenticated) {
    const guestPrimaryDark = mixHex(colors.primary, '#000000', 0.25);

    return (
      <Box
        pb={`calc(80px + var(--safe-area-bottom))`}
        style={{ minHeight: '100vh', backgroundColor: colors.surface }}
      >
        <LoginBottomSheet
          opened={loginOpen}
          onClose={closeLogin}
          returnUrl="/account"
        />

        <Box
          px={spacing.md}
          pb={spacing.md}
          style={{
            background: `radial-gradient(circle at 92% 2%, ${withOpacity(colors.secondary, 0.34)} 0%, transparent 34%), linear-gradient(160deg, ${colors.primary} 0%, ${guestPrimaryDark} 100%)`,
            borderBottomLeftRadius: radius.lg,
            borderBottomRightRadius: radius.lg,
            boxShadow: shadow.md,
            paddingTop: 'calc(var(--safe-area-top) + 12px)',
          }}
        >
          <Group justify="space-between" mb={spacing.md}>
            <ActionIcon
              variant="subtle"
              onClick={() => router.back()}
              style={{ color: colors.text.inverse }}
            >
              <IconArrowLeft size={22} />
            </ActionIcon>
            <Text
              size="lg"
              fw={typography.fontWeight.bold}
              style={{ color: colors.text.inverse }}
            >
              My Profile
            </Text>
            <Box w={34} />
          </Group>

          <Text
            size="lg"
            fw={typography.fontWeight.bold}
            style={{ color: colors.text.inverse }}
          >
            Login to view your orders
          </Text>
        </Box>

        <Stack p={spacing.md} gap={spacing.md}>
          <Button
            fullWidth
            size="lg"
            radius="md"
            onClick={openLogin}
            style={{
              height: 48,
              backgroundColor: colors.primary,
              color: colors.text.inverse,
              fontWeight: typography.fontWeight.bold,
            }}
          >
            Login / Signup
          </Button>
        </Stack>
      </Box>
    );
  }

  const headerPrimaryDark = mixHex(colors.primary, '#000000', 0.32);

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: '100vh', backgroundColor: colors.surface }}
    >
      <LoginBottomSheet
        opened={loginOpen}
        onClose={closeLogin}
        returnUrl="/account"
      />

      <Box
        px={spacing.md}
        pb={spacing.md}
        style={{
          background: `radial-gradient(circle at 90% 8%, ${withOpacity(colors.secondary, 0.38)} 0%, transparent 30%), linear-gradient(152deg, ${colors.primary} 0%, ${headerPrimaryDark} 100%)`,
          borderBottomLeftRadius: radius.lg,
          borderBottomRightRadius: radius.lg,
          boxShadow: shadow.md,
          paddingTop: 'calc(var(--safe-area-top) + 10px)',
        }}
      >
        <Group justify="space-between" mb={spacing.md}>
          <ActionIcon
            variant="subtle"
            onClick={() => router.back()}
            style={{ color: colors.text.inverse }}
          >
            <IconArrowLeft size={22} />
          </ActionIcon>

          <Menu shadow="md" width={200} position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon
                variant="light"
                style={{
                  backgroundColor: withOpacity(colors.text.inverse, 0.2),
                  color: colors.text.inverse,
                }}
              >
                <IconDotsVertical size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={() => router.push('/account/edit')}
              >
                Edit Profile
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Stack gap={4}>
          {loadingProfile ? (
            <>
              <Skeleton height={26} width="48%" radius="sm" />
              <Skeleton height={16} width="36%" radius="sm" />
            </>
          ) : (
            <>
              <Text
                size="xl"
                fw={typography.fontWeight.bold}
                style={{ color: colors.text.inverse }}
              >
                {customerName}
              </Text>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {customerPhone}
              </Text>
            </>
          )}
        </Stack>
      </Box>

      <Stack px={spacing.md} mt={`calc(${spacing.lg} * -1)`} gap={spacing.md}>
        <Card
          withBorder
          p={spacing.md}
          style={{
            borderRadius: radius.lg,
            borderColor: withOpacity(colors.primary, 0.14),
            background: `linear-gradient(145deg, ${withOpacity(colors.primary, 0.04)} 0%, ${withOpacity(colors.secondary, 0.14)} 100%)`,
            boxShadow: standardCardShadow,
          }}
        >
          <SimpleGrid cols={2} spacing={spacing.sm}>
            <QuickActionTile
              icon={<IconShoppingBag size={22} />}
              label="My Orders"
              priority="primary"
              onClick={scrollToOrders}
            />
            <QuickActionTile
              icon={<IconWallet size={22} />}
              label="Wallet Balance"
              priority="primary"
              onClick={() => router.push('/account/wallet')}
            />
            <QuickActionTile
              icon={<IconEdit size={22} />}
              label="Edit Profile"
              onClick={() => router.push('/account/edit')}
            />
            <QuickActionTile
              icon={<IconCalendarStats size={22} />}
              label="Monthly Bill"
              disabled={!isMonthlyEnabled}
              onClick={() => router.push('/account/monthly-billing')}
            />
          </SimpleGrid>
        </Card>

        {activeOrder && (
          <Card
            withBorder
            p={spacing.md}
            style={{
              borderRadius: radius.lg,
              borderColor: withOpacity('#2563eb', 0.2),
              backgroundColor: colors.background,
              boxShadow: standardCardShadow,
            }}
          >
            <Group justify="space-between" align="center" gap={spacing.sm}>
              <Stack gap={2}>
                <Text size="sm" fw={typography.fontWeight.bold}>
                  Active order #{activeOrder.id.slice(0, 8).toUpperCase()}
                </Text>
                <Text size="xs" variant="secondary">
                  {statusLabelMap[activeOrder.status]}
                </Text>
              </Stack>
              <Button
                size="sm"
                leftSection={<IconTruckDelivery size={16} />}
                onClick={handleTrackOrder}
                style={{
                  minHeight: 44,
                  borderRadius: radius.md,
                  backgroundColor: '#2563eb',
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Track Order
              </Button>
            </Group>
          </Card>
        )}

        <InfoSection
          id="past-orders-section"
          title="Past Orders"
          icon={<IconShoppingBag size={18} />}
          actionLabel={`${orders.length} orders`}
        >
          {loadingProfile || loadingOrders ? (
            <Stack gap={spacing.sm}>
              {[0, 1, 2].map((item) => (
                <Card
                  key={item}
                  p={spacing.md}
                  style={{
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background,
                  }}
                >
                  <Stack gap={spacing.sm}>
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
                Start shopping fresh vegetables
              </Text>
              <Button
                size="sm"
                onClick={() => router.push('/category/1')}
                style={{
                  minHeight: 44,
                  borderRadius: radius.md,
                  backgroundColor: colors.primary,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Browse Vegetables
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
                          onClick={() => handleReorder(order)}
                          loading={reorderingOrderId === order.id}
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
          )}
        </InfoSection>
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
  onClick,
  disabled,
  priority = 'secondary',
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  priority?: 'primary' | 'secondary';
}) {
  const isPrimary = priority === 'primary';
  const iconBackground = disabled
    ? withOpacity(colors.border, 0.5)
    : isPrimary
      ? withOpacity(colors.primary, 0.18)
      : withOpacity(colors.primary, 0.1);
  const tileBorder = disabled
    ? colors.border
    : isPrimary
      ? withOpacity(colors.primary, 0.38)
      : withOpacity(colors.primary, 0.2);

  return (
    <UnstyledButton
      onClick={onClick}
      disabled={disabled}
      style={{
        border: `1px solid ${tileBorder}`,
        borderRadius: radius.md,
        minHeight: 92,
        width: '100%',
        padding: spacing.sm,
        backgroundColor: colors.background,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Stack align="center" justify="center" gap={8}>
        <ThemeIcon
          size={38}
          radius="xl"
          style={{
            backgroundColor: iconBackground,
            color: disabled ? colors.text.secondary : colors.primary,
            border: `1px solid ${withOpacity(colors.secondary, 0.5)}`,
          }}
        >
          {icon}
        </ThemeIcon>
        <Text
          size="xs"
          fw={
            isPrimary
              ? typography.fontWeight.bold
              : typography.fontWeight.semibold
          }
          style={{ textAlign: 'center', lineHeight: 1.2 }}
        >
          {label}
        </Text>
      </Stack>
    </UnstyledButton>
  );
}

function InfoSection({
  id,
  title,
  icon,
  actionLabel,
  children,
}: {
  id?: string;
  title: string;
  icon: React.ReactNode;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      id={id}
      withBorder
      p={spacing.md}
      style={{
        borderRadius: radius.lg,
        borderColor: withOpacity(colors.primary, 0.12),
        backgroundColor: colors.background,
        boxShadow: standardCardShadow,
      }}
    >
      <Group justify="space-between" mb={spacing.sm}>
        <Group gap={spacing.xs}>
          <ThemeIcon
            size={30}
            radius="xl"
            style={{
              backgroundColor: withOpacity(colors.primary, 0.14),
              color: colors.primary,
            }}
          >
            {icon}
          </ThemeIcon>
          <Text size="sm" fw={typography.fontWeight.bold}>
            {title}
          </Text>
        </Group>
        <Group gap={2}>
          <Text size="xs" variant="secondary">
            {actionLabel}
          </Text>
          <IconChevronRight size={16} color={colors.text.secondary} />
        </Group>
      </Group>
      <Divider color={colors.border} mb={spacing.sm} />
      {children}
    </Card>
  );
}
