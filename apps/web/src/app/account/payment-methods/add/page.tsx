'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { IconChevronLeft, IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../../../theme';

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const detectBrand = (number: string) => {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6/.test(n)) return 'RuPay';
  return 'Card';
};

export default function AddCardPage() {
  const router = useRouter();
  const [number, setNumber] = React.useState('');
  const [name, setName] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [save, setSave] = React.useState(true);

  const brand = detectBrand(number);
  const last4 = number.replace(/\s/g, '').slice(-4) || '••••';
  const previewName = name.toUpperCase() || 'YOUR NAME';
  const previewExpiry = expiry || 'MM/YY';

  const isValid =
    number.replace(/\s/g, '').length >= 12 &&
    name.length >= 2 &&
    expiry.length === 5 &&
    cvv.length >= 3;

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
          Add card
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        {/* Live preview */}
        <div
          style={{
            height: 200,
            borderRadius: 22,
            background:
              'linear-gradient(135deg, #2D4A2B 0%, #4A6E48 60%, #C85A2C 130%)',
            color: '#fff',
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 32px rgba(28,42,33,0.2)',
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
                opacity: 0.85,
                fontWeight: 700,
              }}
            >
              {brand}
            </div>
            <div
              style={{
                width: 40,
                height: 28,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.22)',
              }}
            />
          </div>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 19,
              letterSpacing: 2.5,
              fontWeight: 500,
            }}
          >
            {number ? formatCardNumber(number) : '•••• •••• •••• ••••'}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              fontSize: 11,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  opacity: 0.7,
                  marginBottom: 2,
                  letterSpacing: 1,
                }}
              >
                NAME
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {previewName}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  opacity: 0.7,
                  marginBottom: 2,
                  letterSpacing: 1,
                }}
              >
                EXP
              </div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                {previewExpiry}
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              right: -50,
              bottom: -50,
              width: 160,
              height: 160,
              borderRadius: 80,
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -20,
              top: -40,
              width: 100,
              height: 100,
              borderRadius: 50,
              background: 'rgba(255,255,255,0.06)',
            }}
          />
        </div>

        {/* Form */}
        <div style={{ marginTop: 24 }}>
          <FormField
            label="Card number"
            placeholder="1234 5678 9012 3456"
            value={formatCardNumber(number)}
            onChange={(e) => setNumber(e.target.value)}
            inputMode="numeric"
          />
          <FormField
            label="Cardholder name"
            placeholder="Juno Greene"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <FormField
                label="Expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                inputMode="numeric"
              />
            </div>
            <div style={{ flex: 1 }}>
              <FormField
                label="CVV"
                placeholder="•••"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                inputMode="numeric"
                type="password"
              />
            </div>
          </div>
        </div>

        {/* Save toggle */}
        <div
          onClick={() => setSave(!save)}
          style={{
            marginTop: 12,
            padding: '14px 16px',
            borderRadius: 14,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              border: `2px solid ${save ? colors.primary : colors.borderStrong}`,
              background: save ? colors.primary : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {save && (
              <IconCheck size={12} color={colors.text.inverse} strokeWidth={3} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Save card for future orders
            </div>
            <div
              style={{
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 2,
              }}
            >
              Saved securely with Razorpay
            </div>
          </div>
        </div>

        {/* Razorpay badge */}
        <div
          style={{
            marginTop: 18,
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
          · 256-bit SSL
        </div>
      </div>

      {/* Save button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 20px',
          paddingBottom: 'calc(14px + var(--safe-area-bottom))',
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <button
          disabled={!isValid}
          onClick={() => router.back()}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 27,
            background: isValid ? colors.primary : colors.text.faint,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor: isValid ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            letterSpacing: 0.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 22px',
          }}
        >
          <span>Save card</span>
          <span>•••• {last4} →</span>
        </button>
      </div>
    </Box>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
  type,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: 'numeric' | 'text' | 'email' | 'tel';
  type?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          color: colors.text.secondary,
          fontWeight: 500,
          marginBottom: 4,
          paddingLeft: 4,
        }}
      >
        {label}
      </div>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        type={type}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          fontSize: 14,
          fontFamily: 'inherit',
          color: colors.text.primary,
          outline: 'none',
        }}
      />
    </div>
  );
}
