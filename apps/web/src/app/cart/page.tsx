'use client';

import React from 'react';
import { Box, Image } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconChevronLeft,
  IconShoppingCart,
  IconPlus,
  IconClock,
  IconTag,
  IconChevronRight,
  IconChevronUp,
  IconTruck,
  IconMapPin,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import {
  useAppStore,
  useAuth,
  useCartStore,
  useDefaultAddress,
} from '../../store';
import { colors } from '../../theme';
import { cartItemsToOrderItems } from '../../utils';
import { useCreateOrder } from '../../hooks/use-api';
import { authApi } from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';
import {
  PAYMENT_LABELS,
  PaymentId,
  PaymentPickerSheet,
  PromoSheet,
} from '../../components/cart';

const SLOTS = [
  { t: 'Tomorrow', r: '6am – 9am', tag: 'Sunrise' },
  { t: 'Tomorrow', r: '8am – 12pm', tag: 'Standard' },
  { t: 'Tomorrow', r: '4pm – 7pm', tag: 'Evening' },
];

const getLocalDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const computePromoDiscount = (subtotal: number, applied: string | null) => {
  if (!applied) return 0;
  return Math.min(Math.round(subtotal * 0.15), 150);
};

function BillRow({
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
        color: colors.text.primary,
      }}
    >
      <span
        style={{ color: bold ? colors.text.primary : colors.text.secondary }}
      >
        {label}
      </span>
      <span style={{ color: valueColor || colors.text.primary }}>{value}</span>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const auth = useAuth();
  const updateUser = useAppStore((state) => state.updateUser);
  const { items, incrementLine, decrementLine, removeItem, clearCart } =
    useCartStore();
  const defaultAddress = useDefaultAddress();
  const isAuthenticated = auth.isAuthenticated;

  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateOrder();
  const [isResolvingCustomerId, setIsResolvingCustomerId] =
    React.useState(false);
  const isPlacingOrder = isResolvingCustomerId || isCreatingOrder;

  const [slot, setSlot] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentId>('wallet');
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [payPickerOpen, setPayPickerOpen] = React.useState(false);
  const [promoSheetOpen, setPromoSheetOpen] = React.useState(false);

  const formatPrice = (price: number) => `₹${Math.round(price)}`;

  const availableItems = items.filter((item) => item.isAvailable);
  const unavailableItems = items.filter((item) => !item.isAvailable);

  const subtotal = availableItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 199 ? 0 : 29;
  const promoDiscount = computePromoDiscount(subtotal, appliedPromo);
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);
  const itemCount = availableItems.length;
  const payInfo = PAYMENT_LABELS[paymentMethod];

  const goToLogin = () => router.push('/login?returnUrl=%2Fcart');

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

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      goToLogin();
      return;
    }
    if (availableItems.length === 0) {
      notifications.show({
        color: 'red',
        title: 'No available items',
        message: 'Please add available products to place your order.',
      });
      return;
    }
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
        paymentMode: paymentMethod,
      });

      const createdOrderId = response?.data?.id
        ? String(response.data.id)
        : '';

      clearCart();
      setAppliedPromo(null);
      const successUrl = `/order-success?items=${encodeURIComponent(
        String(itemCount)
      )}&amount=${encodeURIComponent(String(Math.round(total)))}${
        createdOrderId
          ? `&orderId=${encodeURIComponent(createdOrderId)}`
          : ''
      }`;
      router.push(successUrl);
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

  const handleApplyPromo = (code: string) => {
    if (!code.trim()) return;
    setAppliedPromo(code.trim().toUpperCase());
    setPromoSheetOpen(false);
    notifications.show({
      color: 'green',
      title: 'Coupon applied',
      message: `${code.toUpperCase()} has been applied to your order.`,
    });
  };

  // Empty state
  if (items.length === 0) {
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
        <Header onBack={() => router.back()} subtitle="Your basket" />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 30,
            textAlign: 'center',
          }}
        >
          <IconShoppingCart size={40} color={colors.text.faint} />
          <div
            style={{
              fontFamily:
                "var(--font-heading), 'Instrument Serif', Georgia, serif",
              fontSize: 26,
              marginTop: 18,
            }}
          >
            Basket is empty
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.text.secondary,
              marginTop: 8,
            }}
          >
            Fill it up with something fresh.
          </div>
          <button
            onClick={() => router.push('/')}
            style={{
              marginTop: 24,
              height: 46,
              padding: '0 28px',
              borderRadius: 23,
              background: colors.primary,
              color: colors.text.inverse,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Start Shopping
          </button>
        </div>
      </Box>
    );
  }

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
      <Header
        onBack={() => router.back()}
        subtitle={
          defaultAddress
            ? `${defaultAddress.label} · ${defaultAddress.area}`
            : 'Add a delivery address'
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 16px' }}>
        {/* Saved banner when promo applied */}
        {appliedPromo && promoDiscount > 0 && (
          <div
            style={{
              margin: '0 0 10px',
              padding: '10px 12px',
              borderRadius: 10,
              background: colors.secondarySoft,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <IconTag size={14} color={colors.primary} />
            <div style={{ fontSize: 12, color: colors.text.primary }}>
              <b style={{ color: colors.primary }}>
                ₹{promoDiscount} saved!
              </b>{' '}
              with applied coupon
            </div>
          </div>
        )}

        {/* Unavailable Items */}
        {unavailableItems.length > 0 && (
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: '#fef2f2',
              border: `1px solid rgba(220,38,38,0.15)`,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <span
                style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}
              >
                Currently unavailable
              </span>
              <button
                onClick={() => {
                  unavailableItems.forEach((item) => removeItem(item.id));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Remove all
              </button>
            </div>
            {unavailableItems.map((item) => (
              <div
                key={`${item.id}::${item.selectedVariant}`}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: '#fff',
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  w={44}
                  h={44}
                  radius={10}
                  fit="cover"
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: colors.text.secondary,
                    }}
                  >
                    {item.productQuantity}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(220,38,38,0.1)',
                    color: '#dc2626',
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: 0.4,
                  }}
                >
                  Sold out
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Items list */}
        <div
          style={{
            background: colors.surface,
            borderRadius: 14,
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
          }}
        >
          {availableItems.map((item, idx) => (
            <div
              key={`${item.id}::${item.selectedVariant}`}
              style={{
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderBottom:
                  idx < availableItems.length - 1
                    ? `1px solid ${colors.border}`
                    : 'none',
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                w={48}
                h={48}
                radius={10}
                fit="cover"
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.text.secondary,
                    marginTop: 2,
                  }}
                >
                  {item.productQuantity}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  background: colors.background,
                  border: `1px solid ${colors.primary}`,
                  borderRadius: 8,
                  height: 30,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() =>
                    decrementLine(item.id, item.selectedVariant)
                  }
                  style={{
                    width: 26,
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    minWidth: 18,
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: colors.primary,
                  }}
                >
                  {item.quantity}
                </div>
                <button
                  onClick={() =>
                    incrementLine(item.id, item.selectedVariant)
                  }
                  style={{
                    width: 26,
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  +
                </button>
              </div>
              <div
                style={{
                  minWidth: 50,
                  textAlign: 'right',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Add more items */}
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: 12,
            background: 'transparent',
            border: `1px dashed ${colors.borderStrong}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: colors.primary,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginTop: 10,
          }}
        >
          <IconPlus size={14} color={colors.primary} />
          Add more items
        </button>

        {/* Free delivery progress */}
        {subtotal > 0 && subtotal < 199 && (
          <div
            style={{
              marginTop: 10,
              padding: '10px 12px',
              borderRadius: 10,
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <IconTruck size={16} color={colors.primary} />
            <div
              style={{ flex: 1, fontSize: 12, color: colors.text.primary }}
            >
              Add{' '}
              <b>₹{Math.round(199 - subtotal)}</b> more for{' '}
              <b style={{ color: colors.primary }}>FREE delivery</b>
            </div>
          </div>
        )}

        {/* Address card */}
        <div
          onClick={() =>
            router.push(
              defaultAddress
                ? '/account/addresses?select=1&returnUrl=%2Fcart'
                : '/account/addresses/new?returnUrl=%2Fcart'
            )
          }
          style={{
            marginTop: 14,
            padding: 14,
            background: colors.surface,
            borderRadius: 14,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
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
              flexShrink: 0,
            }}
          >
            <IconMapPin size={16} color={colors.text.inverse} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {defaultAddress ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  Deliver to · {defaultAddress.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.text.secondary,
                    marginTop: 2,
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
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  Add delivery address
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.text.secondary,
                    marginTop: 2,
                  }}
                >
                  Required to place this order
                </div>
              </>
            )}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: colors.primary,
            }}
          >
            {defaultAddress ? 'Change' : 'Add'}
          </span>
        </div>

        {/* Delivery slot */}
        <div
          style={{
            marginTop: 10,
            padding: 14,
            background: colors.surface,
            borderRadius: 14,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 10,
            }}
          >
            <IconClock size={14} color={colors.primary} />
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}
            >
              Choose Delivery Slot
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 6,
            }}
          >
            {SLOTS.map((s, i) => {
              const active = slot === i;
              return (
                <div
                  key={i}
                  onClick={() => setSlot(i)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: active ? colors.primary : colors.background,
                    color: active
                      ? colors.text.inverse
                      : colors.text.primary,
                    border: `1.5px solid ${
                      active ? colors.primary : colors.border
                    }`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: 0.6,
                      textTransform: 'uppercase',
                      opacity: 0.75,
                      fontWeight: 600,
                    }}
                  >
                    {s.tag}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      marginTop: 4,
                    }}
                  >
                    {s.t}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.85, marginTop: 1 }}>
                    {s.r}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Promo */}
        {appliedPromo ? (
          <div
            style={{
              marginTop: 10,
              padding: 12,
              background: colors.surface,
              borderRadius: 14,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: colors.secondarySoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconTag size={15} color={colors.secondary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>
                {appliedPromo} applied
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: colors.primary,
                  fontWeight: 600,
                }}
              >
                You saved ₹{promoDiscount}
              </div>
            </div>
            <button
              onClick={() => setAppliedPromo(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div
            onClick={() => setPromoSheetOpen(true)}
            style={{
              marginTop: 10,
              padding: 12,
              background: colors.surface,
              borderRadius: 14,
              border: `1px dashed ${colors.borderStrong}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: colors.secondarySoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconTag size={15} color={colors.secondary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Apply coupon</div>
              <div style={{ fontSize: 11, color: colors.text.secondary }}>
                Save up to ₹150 on this order
              </div>
            </div>
            <IconChevronRight size={14} color={colors.text.faint} />
          </div>
        )}

        {/* Bill details */}
        <div
          style={{
            marginTop: 10,
            padding: 14,
            background: colors.surface,
            borderRadius: 14,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: colors.text.secondary,
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            Bill details
          </div>
          <BillRow
            label={`Item total · ${itemCount} item${
              itemCount === 1 ? '' : 's'
            }`}
            value={formatPrice(subtotal)}
          />
          <BillRow
            label="Delivery fee"
            value={deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
            valueColor={deliveryFee === 0 ? colors.primary : undefined}
          />
          <BillRow
            label="Handling fee"
            value="FREE"
            valueColor={colors.primary}
          />
          {promoDiscount > 0 && (
            <BillRow
              label={`Coupon (${appliedPromo})`}
              value={`- ${formatPrice(promoDiscount)}`}
              valueColor={colors.secondary}
            />
          )}
          <div
            style={{
              height: 1,
              background: colors.border,
              margin: '8px 0',
            }}
          />
          <BillRow label="To pay" value={formatPrice(total)} bold />
        </div>

        {/* Cancellation policy */}
        <div
          style={{
            marginTop: 10,
            padding: 12,
            background: colors.surfaceAlt,
            borderRadius: 12,
            fontSize: 11,
            color: colors.text.secondary,
            lineHeight: 1.5,
          }}
        >
          <b style={{ color: colors.text.primary }}>Cancellation Policy:</b>{' '}
          Free cancellation if you change your mind before the order is
          packed. After that, partial refund applies.
        </div>
      </div>

      {/* Sticky place-order bar (two-section) */}
      <div
        style={{
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
          padding: '10px 12px',
          paddingBottom: 'calc(10px + var(--safe-area-bottom))',
          display: 'flex',
          alignItems: 'stretch',
          gap: 8,
        }}
      >
        <div
          onClick={() => setPayPickerOpen(true)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 12,
            cursor: 'pointer',
            background: colors.background,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 9.5,
              color: colors.text.secondary,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            <span>Pay using</span>
            <IconChevronUp size={9} color={colors.text.secondary} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 3,
            }}
          >
            <span style={{ fontSize: 14 }}>{payInfo.icon}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {payInfo.t}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: colors.text.secondary,
                  lineHeight: 1.2,
                  marginTop: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {payInfo.s}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || itemCount === 0}
          style={{
            flex: 1,
            minHeight: 56,
            borderRadius: 12,
            background:
              isPlacingOrder || itemCount === 0
                ? colors.text.faint
                : colors.primary,
            color: colors.text.inverse,
            border: 'none',
            cursor:
              isPlacingOrder || itemCount === 0
                ? 'not-allowed'
                : 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            gap: 1,
          }}
        >
          <span
            style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.2 }}
          >
            {isPlacingOrder
              ? 'Placing…'
              : isAuthenticated
                ? 'Place Order'
                : 'Sign in'}
          </span>
          <span style={{ fontSize: 11, opacity: 0.9, fontWeight: 600 }}>
            {formatPrice(total)} · {itemCount}{' '}
            {itemCount === 1 ? 'item' : 'items'}
          </span>
        </button>
      </div>

      <PaymentPickerSheet
        open={payPickerOpen}
        selected={paymentMethod}
        onSelect={(id) => {
          setPaymentMethod(id);
          setPayPickerOpen(false);
        }}
        onClose={() => setPayPickerOpen(false)}
      />
      <PromoSheet
        open={promoSheetOpen}
        applied={appliedPromo}
        onApply={handleApplyPromo}
        onClose={() => setPromoSheetOpen(false)}
      />
    </Box>
  );
}

function Header({
  onBack,
  subtitle,
}: {
  onBack: () => void;
  subtitle: string;
}) {
  return (
    <Box
      style={{
        padding: '12px 16px',
        paddingTop: 'calc(var(--safe-area-top) + 12px)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <button
        onClick={onBack}
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Your basket</div>
        <div
          style={{
            fontSize: 11,
            color: colors.text.secondary,
            marginTop: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {subtitle}
        </div>
      </div>
      <div style={{ width: 40 }} />
    </Box>
  );
}
