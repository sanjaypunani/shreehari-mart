'use client';

import React from 'react';
import { Box } from '@mantine/core';
import {
  IconChevronLeft,
  IconHeart,
  IconShoppingCart,
  IconLeaf,
  IconTruck,
  IconMapPin,
  IconChevronRight,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../../theme';

const VARIANTS = [
  { id: '250g', label: '250 g', price: 60 },
  { id: '500g', label: '500 g', price: 120 },
  { id: '1kg', label: '1 kg', price: 240 },
  { id: '2kg', label: '2 kg', price: 480 },
];

const FEATURES = [
  { Icon: IconLeaf, label: 'Organic' },
  { Icon: IconTruck, label: 'Next-day' },
  { Icon: IconMapPin, label: '18 mi away' },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const [selectedVar, setSelectedVar] = React.useState(VARIANTS[1].id);
  const [qty, setQty] = React.useState(0);

  const currentVar = VARIANTS.find((v) => v.id === selectedVar) || VARIANTS[0];
  const currentPrice = currentVar.price;
  const oldPrice = Math.round(currentPrice * 1.25);

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        display: 'flex',
        flexDirection: 'column',
        color: colors.text.primary,
        position: 'relative',
      }}
    >
      {/* Hero image */}
      <div
        style={{
          position: 'relative',
          height: 380,
          background: colors.surfaceAlt,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 'calc(var(--safe-area-top) + 12px)',
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.9)',
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconChevronLeft size={18} color={colors.text.primary} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: 'rgba(255,255,255,0.9)',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IconHeart size={17} color={colors.text.primary} />
            </button>
            <button
              onClick={() => router.push('/cart')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: 'rgba(255,255,255,0.9)',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IconShoppingCart size={17} color={colors.text.primary} />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          background: colors.background,
          borderRadius: '28px 28px 0 0',
          marginTop: -28,
          padding: '24px 22px 140px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 6,
            background: colors.secondarySoft,
            color: colors.secondary,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Organic
        </div>
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 34,
            lineHeight: 1.1,
            letterSpacing: -0.5,
          }}
        >
          Heirloom Tomatoes
        </div>
        <div
          style={{
            fontSize: 13,
            color: colors.text.secondary,
            marginTop: 6,
          }}
        >
          ₹240 / kg · Vine-ripened, sun-warm
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            marginTop: 16,
          }}
        >
          <span
            style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}
          >
            ₹{currentPrice}
          </span>
          <span
            style={{
              fontSize: 15,
              color: colors.text.faint,
              textDecoration: 'line-through',
            }}
          >
            ₹{oldPrice}
          </span>
          <span style={{ fontSize: 13, color: colors.text.secondary }}>
            / {currentVar.label}
          </span>
        </div>

        {/* Variant picker */}
        <SectionLabel style={{ marginTop: 22 }}>Choose weight</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: 8,
            marginTop: 10,
          }}
        >
          {VARIANTS.map((v) => {
            const active = selectedVar === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVar(v.id)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 14,
                  background: active ? colors.primary : colors.surface,
                  border: `1.5px solid ${active ? colors.primary : colors.border}`,
                  color: active ? colors.text.inverse : colors.text.primary,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600 }}>{v.label}</div>
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.85,
                    marginTop: 2,
                  }}
                >
                  ₹{v.price}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {FEATURES.map((f) => (
            <div
              key={f.label}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 14,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
              }}
            >
              <f.Icon size={18} color={colors.primary} />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  marginTop: 6,
                }}
              >
                {f.label}
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <SectionLabel style={{ marginTop: 24 }}>About</SectionLabel>
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: colors.text.primary,
            marginTop: 8,
          }}
        >
          Hand-picked by the Keene family at Hollow Creek Farm. These heirloom
          tomatoes are grown without pesticides using regenerative practices.
          Best within 5 days of delivery.
        </div>

        {/* Farmer card */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 18,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              background: colors.surfaceAlt,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Hollow Creek Farm
            </div>
            <div
              style={{
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 2,
              }}
            >
              Family-run · 58 years · Asheville, NC
            </div>
          </div>
          <IconChevronRight size={16} color={colors.text.faint} />
        </div>
      </div>

      {/* Sticky add bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 20px',
          paddingBottom: 'calc(14px + var(--safe-area-bottom))',
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {qty > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              background: colors.background,
              border: `1px solid ${colors.border}`,
              borderRadius: 25,
              height: 50,
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setQty(Math.max(0, qty - 1))}
              style={{
                width: 44,
                height: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: colors.text.primary,
                fontSize: 18,
                fontFamily: 'inherit',
              }}
            >
              −
            </button>
            <div
              style={{
                minWidth: 30,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {qty}
            </div>
            <button
              onClick={() => setQty(qty + 1)}
              style={{
                width: 44,
                height: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: colors.text.primary,
                fontSize: 18,
                fontFamily: 'inherit',
              }}
            >
              +
            </button>
          </div>
        )}
        <button
          onClick={() => {
            if (qty === 0) setQty(1);
            else router.push('/cart');
          }}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 25,
            background: colors.primary,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: 0.3,
          }}
        >
          {qty > 0
            ? `GO TO CART · ₹${qty * currentPrice}`
            : `ADD · ₹${currentPrice}`}
        </button>
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
