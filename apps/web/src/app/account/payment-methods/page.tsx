'use client';

import React from 'react';
import { Box } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconCheck,
  IconWallet,
  IconBuildingBank,
  IconCash,
  IconTrash,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../../theme';

const UPI_IDS = [
  { id: 'okhdfc', label: 'juno@okhdfcbank', primary: true },
  { id: 'okicici', label: 'juno@okicici', primary: false },
];

const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay', emoji: '🟢' },
  { id: 'phonepe', label: 'PhonePe', emoji: '🟣' },
  { id: 'paytm', label: 'Paytm', emoji: '🔵' },
  { id: 'bhim', label: 'BHIM', emoji: '🟠' },
];

const CARDS = [
  {
    id: 'visa',
    brand: 'Visa',
    last4: '4821',
    name: 'Juno Greene',
    exp: '08/27',
    gradient: 'linear-gradient(135deg, #2D4A2B 0%, #4A6E48 100%)',
  },
  {
    id: 'mc',
    brand: 'Mastercard',
    last4: '7104',
    name: 'Juno Greene',
    exp: '03/26',
    gradient: 'linear-gradient(135deg, #C85A2C 0%, #E07A4F 100%)',
  },
];

const WALLETS = [
  { id: 'amazon', label: 'Amazon Pay', balance: '₹245.80' },
  { id: 'mobikwik', label: 'MobiKwik', balance: 'Link wallet' },
];

const NETBANKING = [
  { id: 'hdfc', label: 'HDFC Bank' },
  { id: 'icici', label: 'ICICI Bank' },
  { id: 'sbi', label: 'State Bank of India' },
];

export default function PaymentMethodsPage() {
  const router = useRouter();

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        color: colors.text.primary,
        paddingBottom: 'calc(40px + var(--safe-area-bottom))',
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
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <button
          onClick={() => router.back()}
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
          Payment methods
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* UPI IDs */}
        <SectionLabel>UPI ID</SectionLabel>
        <Group>
          {UPI_IDS.map((u, i) => (
            <Item
              key={u.id}
              first={i === 0}
              last={i === UPI_IDS.length - 1}
              icon={
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
                  🏦
                </div>
              }
              title={u.label}
              subtitle={u.primary ? 'Primary · Instant' : 'Backup'}
              right={
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconTrash size={14} color={colors.text.faint} />
                </button>
              }
            />
          ))}
          <AddRow label="Add new UPI ID" />
        </Group>

        {/* UPI apps */}
        <SectionLabel style={{ marginTop: 24 }}>Pay using UPI app</SectionLabel>
        <div
          style={{
            marginTop: 8,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}
        >
          {UPI_APPS.map((a) => (
            <button
              key={a.id}
              style={{
                padding: 14,
                borderRadius: 16,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div style={{ fontSize: 22 }}>{a.emoji}</div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {a.label}
              </div>
            </button>
          ))}
        </div>

        {/* Cards */}
        <SectionLabel style={{ marginTop: 24 }}>Saved cards</SectionLabel>
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {CARDS.map((c) => (
            <div
              key={c.id}
              style={{
                flexShrink: 0,
                width: 280,
                height: 170,
                borderRadius: 18,
                background: c.gradient,
                color: '#fff',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    opacity: 0.8,
                  }}
                >
                  {c.brand}
                </div>
                <div
                  style={{
                    width: 36,
                    height: 26,
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.2)',
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 18,
                    letterSpacing: 2,
                  }}
                >
                  •••• •••• •••• {c.last4}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  fontSize: 11,
                }}
              >
                <div>
                  <div style={{ opacity: 0.7, marginBottom: 2 }}>NAME</div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ opacity: 0.7, marginBottom: 2 }}>EXP</div>
                  <div style={{ fontWeight: 600 }}>{c.exp}</div>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: -30,
                  bottom: -30,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  background: 'rgba(255,255,255,0.08)',
                }}
              />
            </div>
          ))}
          <button
            onClick={() => router.push('/account/payment-methods/add')}
            style={{
              flexShrink: 0,
              width: 160,
              height: 170,
              borderRadius: 18,
              background: colors.surface,
              border: `1px dashed ${colors.borderStrong}`,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: colors.primary,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: colors.secondarySoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconPlus size={18} color={colors.primary} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Add new card</div>
          </button>
        </div>

        {/* Wallets */}
        <SectionLabel style={{ marginTop: 24 }}>Wallets</SectionLabel>
        <Group>
          {WALLETS.map((w, i) => (
            <Item
              key={w.id}
              first={i === 0}
              last={i === WALLETS.length - 1}
              icon={
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: colors.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconWallet size={17} color={colors.text.primary} />
                </div>
              }
              title={w.label}
              subtitle={w.balance}
            />
          ))}
        </Group>

        {/* Net banking */}
        <SectionLabel style={{ marginTop: 24 }}>Net banking</SectionLabel>
        <Group>
          {NETBANKING.map((b, i) => (
            <Item
              key={b.id}
              first={i === 0}
              last={i === NETBANKING.length - 1}
              icon={
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: colors.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconBuildingBank size={17} color={colors.text.primary} />
                </div>
              }
              title={b.label}
            />
          ))}
        </Group>

        {/* Cash on delivery */}
        <SectionLabel style={{ marginTop: 24 }}>Other</SectionLabel>
        <Group>
          <Item
            first
            last
            icon={
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: colors.surfaceAlt,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconCash size={17} color={colors.text.primary} />
              </div>
            }
            title="Cash on delivery"
            subtitle="+₹20 handling fee · Available"
            right={
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconCheck
                  size={12}
                  color={colors.text.inverse}
                  strokeWidth={3}
                />
              </div>
            }
          />
        </Group>

        {/* Razorpay badge */}
        <div
          style={{
            marginTop: 24,
            fontSize: 11,
            color: colors.text.faint,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <IconCheck size={12} color={colors.primary} strokeWidth={2.5} />
          Secured by{' '}
          <b style={{ color: colors.text.primary }}>
            <span style={{ color: '#3395FF' }}>Razor</span>pay
          </b>{' '}
          · 256-bit SSL encryption
        </div>
      </div>
    </Box>
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

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 8,
        background: colors.surface,
        borderRadius: 18,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function Item({
  icon,
  title,
  subtitle,
  right,
  first,
  last,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: last ? 'none' : `1px solid ${colors.border}`,
      }}
    >
      {icon}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: 11,
              color: colors.text.secondary,
              marginTop: 2,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {right || <IconChevronRight size={14} color={colors.text.faint} />}
    </div>
  );
}

function AddRow({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: colors.secondarySoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconPlus size={17} color={colors.primary} />
      </div>
      <div
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 600,
          color: colors.primary,
        }}
      >
        {label}
      </div>
      <IconChevronRight size={14} color={colors.text.faint} />
    </div>
  );
}
