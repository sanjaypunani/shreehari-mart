'use client';

import React from 'react';
import { colors } from '../../theme';

export type PaymentId = 'wallet' | 'monthly' | 'cod';

interface PaymentOption {
  id: PaymentId;
  t: string;
  s: string;
  icon: string;
  tag?: string;
}

interface PaymentGroup {
  t: string;
  items: PaymentOption[];
}

const GROUPS: PaymentGroup[] = [
  {
    t: 'Pay on Delivery',
    items: [
      {
        id: 'cod',
        t: 'Cash on Delivery',
        s: 'Pay cash when it arrives',
        icon: '💵',
      },
    ],
  },
  {
    t: 'Cropzo Account',
    items: [
      {
        id: 'wallet',
        t: 'Wallet',
        s: 'Pay from Cropzo wallet',
        icon: '👛',
        tag: 'Linked',
      },
      {
        id: 'monthly',
        t: 'Monthly Bill',
        s: 'Settle at the end of the month',
        icon: '🧾',
      },
    ],
  },
];

export const PAYMENT_LABELS: Record<
  PaymentId,
  { t: string; s: string; icon: string }
> = {
  wallet: { t: 'Wallet', s: 'Pay from Cropzo wallet', icon: '👛' },
  monthly: {
    t: 'Monthly Bill',
    s: 'Settle at month end',
    icon: '🧾',
  },
  cod: { t: 'Cash on Delivery', s: 'Pay on arrival', icon: '💵' },
};

interface PaymentPickerSheetProps {
  open: boolean;
  selected: PaymentId;
  onSelect: (id: PaymentId) => void;
  onClose: () => void;
}

export function PaymentPickerSheet({
  open,
  selected,
  onSelect,
  onClose,
}: PaymentPickerSheetProps) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1001,
          background: colors.surface,
          borderRadius: '20px 20px 0 0',
          maxHeight: '78%',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'var(--safe-area-bottom)',
        }}
      >
        <div
          style={{
            padding: '12px 16px 8px',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              background: colors.borderStrong,
              borderRadius: 2,
              margin: '0 auto 10px',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                Choose payment method
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: colors.text.secondary,
                  marginTop: 2,
                }}
              >
                All transactions are secure
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 22,
                color: colors.text.secondary,
                padding: 4,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '8px 16px 24px',
          }}
        >
          {GROUPS.map((g) => (
            <div key={g.t} style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: colors.text.secondary,
                  fontWeight: 700,
                  padding: '4px 4px 8px',
                }}
              >
                {g.t}
              </div>
              <div
                style={{
                  background: colors.background,
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  overflow: 'hidden',
                }}
              >
                {g.items.map((it, i) => {
                  const active = selected === it.id;
                  return (
                    <div
                      key={it.id}
                      onClick={() => onSelect(it.id)}
                      style={{
                        padding: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        borderBottom:
                          i < g.items.length - 1
                            ? `1px solid ${colors.border}`
                            : 'none',
                        background: active
                          ? colors.secondarySoft
                          : 'transparent',
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: colors.surface,
                          border: `1px solid ${colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 17,
                        }}
                      >
                        {it.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: colors.text.primary,
                            }}
                          >
                            {it.t}
                          </span>
                          {it.tag && (
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: colors.secondarySoft,
                                color: colors.secondary,
                                letterSpacing: 0.4,
                              }}
                            >
                              {it.tag.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: colors.text.secondary,
                            marginTop: 2,
                          }}
                        >
                          {it.s}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          border: `2px solid ${
                            active ? colors.primary : colors.borderStrong
                          }`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: active
                            ? colors.primary
                            : 'transparent',
                        }}
                      >
                        {active && (
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              background: colors.text.inverse,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
