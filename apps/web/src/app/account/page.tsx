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
  Loader,
  Menu,
  SimpleGrid,
  Stack,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendarStats,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconLogout,
  IconShoppingBag,
  IconWallet,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { colors, radius, shadow, spacing, typography } from '../../theme';
import { Text } from '../../components/ui';
import { LoginBottomSheet } from '../../components/auth/LoginBottomSheet';
import {
  authApi,
  AuthProfilePayload,
  ordersApi,
} from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';
import { useAuth, useAppStore } from '../../store/app-store';

interface AccountOrder {
  id: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentMode: 'wallet' | 'monthly' | 'cod';
  totalAmount: number;
  createdAt: string;
  deliveryDate?: string;
  items?: Array<{
    id: string;
    productName: string;
    orderedQuantity: number;
    unit: 'gm' | 'kg' | 'pc';
  }>;
}

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

const formatStatus = (status: AccountOrder['status']) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const statusColorMap: Record<AccountOrder['status'], string> = {
  delivered: 'green',
  confirmed: 'blue',
  pending: 'orange',
  cancelled: 'red',
};

export default function AccountPage() {
  const router = useRouter();
  const auth = useAuth();
  const logout = useAppStore((state) => state.logout);
  const updateUser = useAppStore((state) => state.updateUser);
  const [loginOpen, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);

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
  }, [auth.isAuthenticated, router, updateUser]);

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

        setOrders(resolvedOrders as AccountOrder[]);
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

  const customerName = profile?.customer?.name || auth.user?.name || 'Guest Customer';
  const customerPhone = profile?.customer?.mobileNumber
    ? `+91 ${profile.customer.mobileNumber}`
    : auth.user?.mobileNumber
      ? `+91 ${auth.user.mobileNumber}`
      : '+91 00000 00000';
  const customerEmail = profile?.customer?.email || auth.user?.email || 'customer@example.com';

  const isMonthlyEnabled = !!profile?.customer?.isMonthlyPayment;

  if (!auth.isAuthenticated) {
    return (
      <Box
        pb={`calc(80px + var(--safe-area-bottom))`}
        style={{ minHeight: '100vh', backgroundColor: '#f2f5f7' }}
      >
        <LoginBottomSheet
          opened={loginOpen}
          onClose={closeLogin}
          returnUrl="/account"
        />

        <Box
          px={spacing.md}
          pb={spacing.xl}
          style={{
            background:
              'linear-gradient(160deg, rgba(36,124,98,1) 0%, rgba(16,79,62,1) 100%)',
            borderBottomLeftRadius: radius.xl,
            borderBottomRightRadius: radius.xl,
            paddingTop: 'calc(var(--safe-area-top) + 12px)',
          }}
        >
          <Group justify="space-between" mb={spacing.lg}>
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

          <Stack gap={spacing.sm} pb={spacing.md}>
            <Text
              size="xl"
              fw={typography.fontWeight.bold}
              style={{ color: colors.text.inverse }}
            >
              Manage your account in one place
            </Text>
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Login to access profile details, wallet, order history and monthly
              billing.
            </Text>
          </Stack>
        </Box>

        <Stack p={spacing.md} gap={spacing.md}>
          <Button
            fullWidth
            size="lg"
            radius="md"
            onClick={openLogin}
            style={{ height: 48, backgroundColor: colors.primary }}
          >
            Login / Signup
          </Button>

          <Card
            withBorder
            p={spacing.md}
            style={{
              borderRadius: radius.lg,
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <SimpleGrid cols={2} spacing={spacing.sm}>
              <QuickActionTile
                icon={<IconWallet size={20} />}
                label="Wallet"
                onClick={openLogin}
              />
              <QuickActionTile
                icon={<IconCalendarStats size={20} />}
                label="Monthly Bill"
                onClick={openLogin}
              />
            </SimpleGrid>
          </Card>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      pb={`calc(90px + var(--safe-area-bottom))`}
      style={{ minHeight: '100vh', backgroundColor: '#f2f5f7' }}
    >
      <LoginBottomSheet
        opened={loginOpen}
        onClose={closeLogin}
        returnUrl="/account"
      />

      <Box
        px={spacing.md}
        pb={spacing.xl}
        style={{
          background:
            'linear-gradient(145deg, rgba(208,82,59,1) 0%, rgba(157,47,97,1) 100%)',
          borderBottomLeftRadius: radius.xl,
          borderBottomRightRadius: radius.xl,
          boxShadow: shadow.md,
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
        }}
      >
        <Group justify="space-between" mb={spacing.lg}>
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
                  backgroundColor: 'rgba(255,255,255,0.2)',
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

        <Stack gap={2}>
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
          <Text size="sm" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {customerEmail}
          </Text>
        </Stack>
      </Box>

      <Stack px={spacing.md} mt={`calc(${spacing.xl} * -1)`} gap={spacing.md}>
        <Card
          withBorder
          shadow="sm"
          p={spacing.md}
          style={{
            borderRadius: radius.lg,
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <SimpleGrid cols={4} spacing={spacing.sm}>
            <QuickActionTile
              icon={<IconEdit size={20} />}
              label="Edit"
              onClick={() => router.push('/account/edit')}
            />
            <QuickActionTile
              icon={<IconWallet size={20} />}
              label="Wallet"
              onClick={() => router.push('/account/wallet')}
            />
            <QuickActionTile
              icon={<IconCalendarStats size={20} />}
              label="Monthly Bill"
              disabled={!isMonthlyEnabled}
              onClick={() => router.push('/account/monthly-billing')}
            />
            <QuickActionTile
              icon={<IconShoppingBag size={20} />}
              label="Orders"
              onClick={() =>
                document
                  .getElementById('past-orders-section')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            />
          </SimpleGrid>
        </Card>

        <InfoSection
          id="past-orders-section"
          title="Past Orders"
          icon={<IconShoppingBag size={18} />}
          actionLabel={`${orders.length} orders`}
        >
          {loadingProfile || loadingOrders ? (
            <Group justify="center" py={spacing.lg}>
              <Loader size="sm" color={colors.primary} />
            </Group>
          ) : errorMessage ? (
            <Text size="sm" c="red">
              {errorMessage}
            </Text>
          ) : orders.length === 0 ? (
            <Text size="sm" variant="secondary">
              No orders found.
            </Text>
          ) : (
            <Stack gap={spacing.sm}>
              {orders.map((order) => {
                const itemSummary =
                  order.items?.length
                    ? order.items
                        .slice(0, 3)
                        .map(
                          (item) =>
                            `${item.productName} (${item.orderedQuantity}${item.unit})`
                        )
                        .join(', ')
                    : 'No items available';

                return (
                  <Card
                    key={order.id}
                    p={spacing.md}
                    style={{
                      borderRadius: radius.md,
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.background,
                    }}
                  >
                    <Group justify="space-between" mb={6} align="flex-start">
                      <Stack gap={2}>
                        <Text size="sm" fw={typography.fontWeight.semibold}>
                          Order {order.id.slice(0, 8).toUpperCase()}
                        </Text>
                        <Text size="xs" variant="secondary">
                          Payment: {order.paymentMode.toUpperCase()}
                        </Text>
                      </Stack>
                      <Badge variant="light" color={statusColorMap[order.status]}>
                        {formatStatus(order.status)}
                      </Badge>
                    </Group>

                    <Text size="xs" variant="secondary" mb={spacing.xs}>
                      {itemSummary}
                    </Text>

                    <Group justify="space-between">
                      <Text size="xs" variant="secondary">
                        Ordered {formatDate(order.createdAt)}
                        {order.deliveryDate
                          ? ` • Delivery ${formatDate(order.deliveryDate, {
                              day: '2-digit',
                              month: 'short',
                            })}`
                          : ''}
                      </Text>
                      <Text size="sm" fw={typography.fontWeight.bold}>
                        {formatCurrency(Number(order.totalAmount || 0))}
                      </Text>
                    </Group>
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

function QuickActionTile({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <UnstyledButton
      onClick={onClick}
      disabled={disabled}
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        minHeight: 92,
        width: '100%',
        padding: spacing.sm,
        backgroundColor: colors.background,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Stack align="center" gap={6}>
        <ThemeIcon
          size={34}
          radius="xl"
          style={{ backgroundColor: `${colors.primary}14`, color: colors.primary }}
        >
          {icon}
        </ThemeIcon>
        <Text
          size="xs"
          fw={typography.fontWeight.semibold}
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
      shadow="sm"
      style={{
        borderRadius: radius.lg,
        borderColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      <Group justify="space-between" mb={spacing.sm}>
        <Group gap={spacing.xs}>
          <ThemeIcon
            size={30}
            radius="xl"
            style={{ backgroundColor: `${colors.primary}14`, color: colors.primary }}
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
