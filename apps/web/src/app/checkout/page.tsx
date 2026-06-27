'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconChevronLeft,
  IconMapPin,
  IconCheck,
  IconTag,
  IconChevronRight,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../theme';
import {
  useAppStore,
  useAuth,
  useCartStore,
  useDefaultAddress,
} from '../../store';
import { cartItemsToOrderItems } from '../../utils';
import { useCreateOrder } from '../../hooks/use-api';
import { authApi } from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';

const SLOTS = [
  { t: 'Tomorrow', r: '6am – 9am', tag: 'Sunrise' },
  { t: 'Tomorrow', r: '8am – 12pm', tag: 'Standard' },
  { t: 'Tomorrow', r: '4pm – 7pm', tag: 'Evening' },
];

const PAYMENTS = [
  { id: 'wallet', t: 'Wallet', s: 'Pay from Cropzo wallet', icon: '👛' },
  {
    id: 'monthly',
    t: 'Monthly Bill',
    s: 'Settle at the end of the month',
    icon: '🧾',
  },
  { id: 'cod', t: 'Cash on delivery', s: 'Pay when it arrives', icon: '💵' },
];

type PaymentId = 'wallet' | 'monthly' | 'cod';

const getLocalDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CheckoutPage() {
  const router = useRouter();
  const auth = useAuth();
  const updateUser = useAppStore((state) => state.updateUser);
  const { items, clearCart } = useCartStore();
  const defaultAddress = useDefaultAddress();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateOrder();
  const [isResolvingCustomerId, setIsResolvingCustomerId] =
    React.useState(false);
  const isPlacingOrder = isResolvingCustomerId || isCreatingOrder;

  const [slot, setSlot] = React.useState(1);
  const [pay, setPay] = React.useState<PaymentId>('wallet');

  const availableItems = items.filter((item) => item.isAvailable);
  const itemCount = availableItems.length;
  const subtotal = availableItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = subtotal > 199 ? 0 : 29;
  const total = subtotal + delivery;

  // Redirect away if cart is empty
  React.useEffect(() => {
    if (availableItems.length === 0) {
      router.replace('/cart');
    }
  }, [availableItems.length, router]);

  // Require auth
  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      router.replace('/login?returnUrl=%2Fcheckout');
    }
  }, [auth.isAuthenticated, router]);

  const resolveCustomerId = async () => {
    if (auth.user?.customerId) {
      return auth.user.customerId;
    }
    const profile = await authApi.me();
    const customerId =
      profile.data?.user?.customerId || profile.data?.customer?.id || null;
    if (customerId) {
      updateUser({
        customerId,
        name: profile.data.user?.name || auth.user?.name,
        email: profile.data.user?.email ?? auth.user?.email ?? null,
      });
    }
    return customerId;
  };

  const handlePay = async () => {
    if (availableItems.length === 0) return;
    if (isPlacingOrder) return;

    try {
      setIsResolvingCustomerId(true);
      const customerId = await resolveCustomerId();
      if (!customerId) {
        notifications.show({
          color: 'red',
          title: 'Profile incomplete',
          message:
            'Please complete your account details before placing the order.',
        });
        router.push('/account');
        return;
      }

      const response = await createOrder({
        customerId,
        items: cartItemsToOrderItems(availableItems),
        deliveryDate: getLocalDateString(),
        paymentMode: pay,
      });

      const createdOrderId = response?.data?.id
        ? String(response.data.id)
        : '';

      clearCart();
      const successUrl = `/order-success?items=${encodeURIComponent(
        String(itemCount)
      )}&amount=${encodeURIComponent(String(Math.round(total)))}${
        createdOrderId
          ? `&orderId=${encodeURIComponent(createdOrderId)}`
          : ''
      }`;
      router.replace(successUrl);
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Failed to place order',
        message: getErrorMessage(error),
      });
    } finally {
      setIsResolvingCustomerId(false);
    }
  };

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        color: colors.text.primary,
      }}
    >
      <Header onBack={() => router.back()} title="Checkout" />

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 20px 20px' }}>
        {/* Address */}
        <Card>
          <SectionLabel>Delivery address</SectionLabel>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconMapPin size={16} color={colors.text.inverse} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {defaultAddress ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {defaultAddress.label} · {defaultAddress.area}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.text.secondary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {defaultAddress.flat}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    No address yet
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.text.secondary,
                    }}
                  >
                    Tap change to add an address
                  </div>
                </>
              )}
            </div>
            <span
              onClick={() =>
                router.push(
                  defaultAddress
                    ? '/account/addresses?select=1&returnUrl=%2Fcheckout'
                    : '/account/addresses/new'
                )
              }
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: colors.primary,
                cursor: 'pointer',
              }}
            >
              {defaultAddress ? 'Change' : 'Add'}
            </span>
          </div>
        </Card>

        {/* Slot picker */}
        <SectionLabel style={{ margin: '24px 2px 10px' }}>
          Choose a slot
        </SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
          }}
        >
          {SLOTS.map((s, i) => {
            const active = slot === i;
            return (
              <div
                key={i}
                onClick={() => setSlot(i)}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: active ? colors.primary : colors.surface,
                  color: active ? colors.text.inverse : colors.text.primary,
                  border: `1.5px solid ${active ? colors.primary : colors.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    opacity: 0.75,
                  }}
                >
                  {s.tag}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    marginTop: 6,
                  }}
                >
                  {s.t}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.85,
                    marginTop: 2,
                  }}
                >
                  {s.r}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '24px 2px 10px',
          }}
        >
          <SectionLabel>Payment</SectionLabel>
          <span
            onClick={() => router.push('/account/payment-methods')}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: colors.primary,
              cursor: 'pointer',
            }}
          >
            Manage →
          </span>
        </div>
        <div
          style={{
            background: colors.surface,
            borderRadius: 18,
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
          }}
        >
          {PAYMENTS.map((m, i) => (
            <div
              key={m.id}
              onClick={() => setPay(m.id as PaymentId)}
              style={{
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                borderBottom:
                  i < PAYMENTS.length - 1
                    ? `1px solid ${colors.border}`
                    : 'none',
                background:
                  pay === m.id ? colors.secondarySoft : 'transparent',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: colors.surfaceAlt,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                }}
              >
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{m.t}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.text.secondary,
                  }}
                >
                  {m.s}
                </div>
              </div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  border: `2px solid ${
                    pay === m.id ? colors.primary : colors.borderStrong
                  }`,
                  background: pay === m.id ? colors.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pay === m.id && (
                  <IconCheck
                    size={12}
                    color={colors.text.inverse}
                    strokeWidth={3}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Promo */}
        <div
          style={{
            margin: '20px 0 0',
            padding: 14,
            borderRadius: 16,
            background: colors.surface,
            border: `1px dashed ${colors.borderStrong}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: colors.secondarySoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconTag size={17} color={colors.secondary} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Apply coupon</div>
            <div
              style={{
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 2,
              }}
            >
              Promo codes coming soon
            </div>
          </div>
          <IconChevronRight size={15} color={colors.text.faint} />
        </div>

        {/* Bill */}
        <Card style={{ marginTop: 18 }}>
          <SectionLabel>Bill details</SectionLabel>
          <div style={{ marginTop: 10 }}>
            <Row
              label={`Item total · ${itemCount} item${itemCount === 1 ? '' : 's'}`}
              value={`₹${Math.round(subtotal)}`}
            />
            <Row
              label="Delivery fee"
              value={delivery === 0 ? 'FREE' : `₹${delivery}`}
              valueColor={delivery === 0 ? colors.primary : undefined}
            />
            <Row label="Handling fee" value="FREE" valueColor={colors.primary} />
            <div
              style={{
                height: 1,
                background: colors.border,
                margin: '10px 0',
              }}
            />
            <Row label="To pay" value={`₹${Math.round(total)}`} bold />
          </div>
        </Card>
      </div>

      {/* Pay button */}
      <div
        style={{
          padding: '14px 20px',
          paddingBottom: 'calc(14px + var(--safe-area-bottom))',
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <button
          onClick={handlePay}
          disabled={isPlacingOrder || itemCount === 0}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 27,
            background:
              isPlacingOrder || itemCount === 0
                ? colors.text.faint
                : colors.primary,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor:
              isPlacingOrder || itemCount === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            letterSpacing: 0.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 22px',
          }}
        >
          <span>{isPlacingOrder ? 'Placing order…' : `Pay ₹${Math.round(total)}`}</span>
          <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>
            via{' '}
            {pay === 'wallet'
              ? 'Wallet'
              : pay === 'monthly'
                ? 'Monthly'
                : 'COD'}{' '}
            →
          </span>
        </button>
      </div>
    </Box>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        paddingTop: 'calc(var(--safe-area-top) + 12px)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <button
        onClick={onBack}
        aria-label="Go back"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <IconChevronLeft size={18} color={colors.text.primary} />
      </button>
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      <div style={{ width: 40 }} />
    </div>
  );
}

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 18,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: colors.text.secondary,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 0',
        fontSize: bold ? 16 : 13,
        fontWeight: bold ? 700 : 500,
      }}
    >
      <span
        style={{
          color: bold ? colors.text.primary : colors.text.secondary,
        }}
      >
        {label}
      </span>
      <span style={{ color: valueColor || colors.text.primary }}>{value}</span>
    </div>
  );
}
