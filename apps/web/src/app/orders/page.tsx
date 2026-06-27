'use client';

import React from 'react';
import { Box, Skeleton, Stack, Alert } from '@mantine/core';
import { IconAlertCircle, IconReceipt } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../theme';
import { ConfirmDialog } from '../../components/ui/Modal';
import { authApi, ordersApi } from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';
import { useAuth, useAppStore } from '../../store/app-store';
import { useReorder } from '../../hooks/use-api';

type OrderStatus =
  | 'pending'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

interface OrderItem {
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

interface Order {
  id: string;
  status: OrderStatus;
  paymentMode: 'wallet' | 'monthly' | 'cod';
  totalAmount: number;
  createdAt: string;
  deliveryDate?: string;
  items?: OrderItem[];
}

const formatCurrency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString('en-IN')}`;

const formatDate = (value?: string) => {
  if (!value) return '-';
  const d = new Date(value);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return `Today · ${d.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  }
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
};

const normalizeStatus = (value: string): OrderStatus => {
  if (value === 'delivered') return 'delivered';
  if (value === 'cancelled') return 'cancelled';
  if (value === 'out_for_delivery' || value === 'confirmed')
    return 'out_for_delivery';
  return 'pending';
};

const statusLabel: Record<OrderStatus, string> = {
  pending: 'Preparing',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusColor: Record<OrderStatus, string> = {
  pending: colors.secondary,
  out_for_delivery: '#2563eb',
  delivered: colors.primary,
  cancelled: '#dc2626',
};

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

  const [orders, setOrders] = React.useState<Order[]>([]);
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

        const profileResponse = await authApi.me();
        if (cancelled) return;

        if (
          profileResponse.data.requiresSignup ||
          !profileResponse.data.customer
        ) {
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
          limit: 30,
        });

        if (cancelled) return;

        const rawResponse = response as any;
        const resolvedOrders = Array.isArray(rawResponse?.data?.data)
          ? rawResponse.data.data
          : Array.isArray(rawResponse?.data)
            ? rawResponse.data
            : [];

        setOrders(
          resolvedOrders.map((order: any) => ({
            ...order,
            status: normalizeStatus(String(order?.status || 'pending')),
          })) as Order[]
        );
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, router, updateUser]);

  const totalSaved = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
  );

  return (
    <Box
      style={{
        minHeight: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        color: colors.text.primary,
        paddingBottom: 'calc(110px + var(--safe-area-bottom))',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: colors.background,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: -0.2,
          }}
        >
          Orders
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '10px 20px 0' }}>
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 34,
            letterSpacing: -0.6,
            lineHeight: 1.05,
          }}
        >
          Your <span style={{ fontStyle: 'italic' }}>harvest</span> history
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.text.secondary,
            marginTop: 6,
          }}
        >
          {loadingOrders
            ? 'Loading…'
            : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} · ${formatCurrency(totalSaved)} ordered`}
        </div>
      </div>

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

      <div style={{ padding: '20px 20px 30px' }}>
        {/* Loading */}
        {loadingOrders && (
          <Stack gap={12}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height={120} radius={20} />
            ))}
          </Stack>
        )}

        {/* Error */}
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

        {/* Not authenticated */}
        {!loadingOrders && !auth.isAuthenticated && (
          <EmptyState
            title="Sign in to see your orders"
            subtitle="Track deliveries and reorder favourites in one tap."
            cta="Login / Signup"
            onClick={() =>
              router.push('/login?returnUrl=%2Forders')
            }
          />
        )}

        {/* Empty */}
        {!loadingOrders && !error && auth.isAuthenticated && orders.length === 0 && (
          <EmptyState
            title="No orders yet"
            subtitle="Once you place your first order it'll show up here."
            cta="Start shopping"
            onClick={() => router.push('/')}
          />
        )}

        {/* Order list */}
        {!loadingOrders &&
          !error &&
          orders.map((order) => {
            const isActive =
              order.status === 'pending' ||
              order.status === 'out_for_delivery';

            const itemNames =
              order.items
                ?.map((item) => item.productName)
                .filter(Boolean)
                .join(' · ') || '';

            return (
              <div
                key={order.id}
                style={{
                  padding: 14,
                  borderRadius: 20,
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  {/* Image placeholder */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      background: colors.surfaceAlt,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconReceipt size={22} color={colors.text.faint} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: isActive
                            ? colors.secondarySoft
                            : colors.surfaceAlt,
                          color: statusColor[order.status],
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 0.4,
                        }}
                      >
                        {statusLabel[order.status]}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: colors.text.secondary,
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    {itemNames && (
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginTop: 6,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {itemNames}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 11,
                        color: colors.text.faint,
                        marginTop: 2,
                      }}
                    >
                      #{order.id.slice(0, 8).toUpperCase()} ·{' '}
                      {formatCurrency(Number(order.totalAmount || 0))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: `1px dashed ${colors.border}`,
                    display: 'flex',
                    gap: 8,
                  }}
                >
                  {isActive ? (
                    <>
                      <button
                        onClick={() =>
                          router.push(`/orders/${order.id}`)
                        }
                        style={primaryActionStyle}
                      >
                        Track
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/orders/${order.id}`)
                        }
                        style={secondaryActionStyle}
                      >
                        Modify
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReorder(order)}
                        disabled={
                          !order.items?.length ||
                          reorderingOrderId === order.id
                        }
                        style={{
                          ...mutedActionStyle,
                          cursor: order.items?.length ? 'pointer' : 'not-allowed',
                          opacity: order.items?.length ? 1 : 0.5,
                        }}
                      >
                        {reorderingOrderId === order.id
                          ? 'Reordering…'
                          : 'Reorder'}
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/orders/${order.id}`)
                        }
                        style={secondaryActionStyle}
                      >
                        Receipt
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </Box>
  );
}

const primaryActionStyle: React.CSSProperties = {
  flex: 1,
  height: 36,
  borderRadius: 18,
  background: colors.primary,
  color: colors.text.inverse,
  border: 'none',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const secondaryActionStyle: React.CSSProperties = {
  flex: 1,
  height: 36,
  borderRadius: 18,
  background: 'transparent',
  color: colors.text.primary,
  border: `1px solid ${colors.borderStrong}`,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const mutedActionStyle: React.CSSProperties = {
  flex: 1,
  height: 36,
  borderRadius: 18,
  background: colors.surfaceAlt,
  color: colors.text.primary,
  border: 'none',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

function EmptyState({
  title,
  subtitle,
  cta,
  onClick,
}: {
  title: string;
  subtitle: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        padding: 32,
        borderRadius: 20,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          background: colors.surfaceAlt,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
        }}
      >
        <IconReceipt size={28} color={colors.text.faint} />
      </div>
      <div
        style={{
          fontFamily:
            "var(--font-heading), 'Instrument Serif', Georgia, serif",
          fontSize: 22,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 12,
          color: colors.text.secondary,
          marginTop: 6,
          lineHeight: 1.5,
          maxWidth: 280,
          margin: '6px auto 0',
        }}
      >
        {subtitle}
      </div>
      <button
        onClick={onClick}
        style={{
          marginTop: 18,
          height: 44,
          padding: '0 24px',
          borderRadius: 22,
          background: colors.primary,
          color: colors.text.inverse,
          border: 'none',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {cta}
      </button>
    </div>
  );
}
