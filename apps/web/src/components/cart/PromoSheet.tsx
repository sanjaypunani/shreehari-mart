'use client';

import React from 'react';
import { IconX } from '@tabler/icons-react';
import { colors } from '../../theme';

interface Offer {
  code: string;
  title: string;
  sub: string;
  expires: string;
  hot?: boolean;
}

const OFFERS: Offer[] = [
  {
    code: 'FRESH50',
    title: '50% off up to ₹150',
    sub: 'On orders above ₹399',
    expires: 'Expires in 3 days',
    hot: true,
  },
  {
    code: 'HARVEST20',
    title: 'Flat ₹80 off',
    sub: 'No minimum order',
    expires: 'Expires in 7 days',
  },
  {
    code: 'WEEKEND15',
    title: '15% off',
    sub: 'Up to ₹100 · Sat & Sun only',
    expires: 'Expires in 2 days',
  },
  {
    code: 'ORGANIC10',
    title: '10% off organic range',
    sub: 'Only on greens & herbs',
    expires: 'Expires soon',
  },
];

interface PromoSheetProps {
  open: boolean;
  applied: string | null;
  onApply: (code: string) => void;
  onClose: () => void;
}

export function PromoSheet({
  open,
  applied,
  onApply,
  onClose,
}: PromoSheetProps) {
  const [code, setCode] = React.useState('');

  React.useEffect(() => {
    if (!open) setCode('');
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '82%',
          background: colors.background,
          borderRadius: '24px 24px 0 0',
          paddingTop: 12,
          paddingBottom: 'var(--safe-area-bottom)',
          color: colors.text.primary,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: colors.borderStrong,
            borderRadius: 2,
            margin: '0 auto 14px',
          }}
        />

        <div
          style={{
            padding: '0 20px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily:
                  "var(--font-heading), 'Instrument Serif', Georgia, serif",
                fontSize: 24,
                letterSpacing: -0.4,
              }}
            >
              Apply coupon
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              background: colors.surface,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconX size={14} color={colors.text.primary} />
          </button>
        </div>

        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              style={{
                flex: 1,
                height: 50,
                padding: '0 14px',
                borderRadius: 14,
                border: `1.5px solid ${code ? colors.primary : colors.border}`,
                background: colors.surface,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 0.6,
                color: colors.text.primary,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              disabled={!code}
              onClick={() => onApply(code)}
              style={{
                padding: '0 18px',
                borderRadius: 14,
                background: code ? colors.primary : colors.surfaceAlt,
                color: code ? colors.text.inverse : colors.text.faint,
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: code ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                letterSpacing: 0.3,
              }}
            >
              APPLY
            </button>
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.text.secondary,
            padding: '10px 22px 8px',
          }}
        >
          Available offers
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '0 20px 30px',
          }}
        >
          {OFFERS.map((o) => {
            const isApplied = applied === o.code;
            return (
              <div
                key={o.code}
                style={{
                  padding: 14,
                  borderRadius: 16,
                  marginBottom: 10,
                  background: colors.surface,
                  border: `1.5px solid ${
                    isApplied ? colors.primary : colors.border
                  }`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {o.hot && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: colors.secondary,
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    HOT
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: colors.secondarySoft,
                      color: colors.secondary,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 1,
                      fontFamily:
                        "var(--font-heading), 'Instrument Serif', Georgia, serif",
                      border: `1px dashed ${colors.secondary}`,
                    }}
                  >
                    {o.code}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{o.title}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: colors.text.secondary,
                    marginTop: 3,
                  }}
                >
                  {o.sub}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: `1px dashed ${colors.border}`,
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: colors.text.secondary }}
                  >
                    ⏱ {o.expires}
                  </span>
                  <button
                    onClick={() => onApply(o.code)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 12,
                      background: isApplied ? colors.primary : 'transparent',
                      color: isApplied ? colors.text.inverse : colors.primary,
                      border: `1.5px solid ${colors.primary}`,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      letterSpacing: 0.4,
                    }}
                  >
                    {isApplied ? 'APPLIED ✓' : 'APPLY'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
