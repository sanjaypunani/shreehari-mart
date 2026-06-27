'use client';

import React, { useEffect, useState } from 'react';
import { Image } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { colors } from '../../theme';
import { useCartStore } from '../../store';
import { calculateItemPrice } from '../../utils';

const ANIMATION_MS = 300;

const WEIGHT_VARIANTS = [
  { value: '250gm', label: '250 gm', quantity: 250, unit: 'gm' as const },
  { value: '500gm', label: '500 gm', quantity: 500, unit: 'gm' as const },
  { value: '1kg', label: '1 kg', quantity: 1, unit: 'kg' as const },
  { value: '2kg', label: '2 kg', quantity: 2, unit: 'kg' as const },
];

const PIECE_VARIANTS = [
  { value: '1pc', label: '1 pc', quantity: 1, unit: 'pc' as const },
  { value: '2pc', label: '2 pc', quantity: 2, unit: 'pc' as const },
  { value: '3pc', label: '3 pc', quantity: 3, unit: 'pc' as const },
  { value: '4pc', label: '4 pc', quantity: 4, unit: 'pc' as const },
  { value: '5pc', label: '5 pc', quantity: 5, unit: 'pc' as const },
];

export interface VariantSheetProduct {
  id: string;
  name: string;
  image: string;
  price: number; // base price from API
  baseQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
  discount?: number;
  quantity?: string; // base label like "250gm"
}

interface VariantSheetProps {
  product: VariantSheetProduct | null;
  onClose: () => void;
}

export function VariantSheet({
  product: incomingProduct,
  onClose,
}: VariantSheetProps) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const incrementLine = useCartStore((s) => s.incrementLine);
  const decrementLine = useCartStore((s) => s.decrementLine);

  const [currentProduct, setCurrentProduct] =
    useState<VariantSheetProduct | null>(incomingProduct);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (incomingProduct) {
      setCurrentProduct(incomingProduct);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    if (currentProduct) {
      setIsVisible(false);
      const t = setTimeout(() => setCurrentProduct(null), ANIMATION_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [incomingProduct]);

  if (!currentProduct) return null;
  const product = currentProduct;

  const variants =
    product.unit === 'pc' ? PIECE_VARIANTS : WEIGHT_VARIANTS;

  const lineQty = (variantValue: string) =>
    items.find(
      (i) => i.id === product.id && i.selectedVariant === variantValue
    )?.quantity ?? 0;

  const handleAdd = (v: (typeof variants)[number]) => {
    const price = calculateItemPrice(
      v.quantity,
      v.unit,
      product.price,
      product.baseQuantity,
      product.unit
    );
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price,
      orderedQuantity: v.quantity,
      unit: v.unit,
      productQuantity: v.label,
      baseQuantity: product.baseQuantity,
      basePrice: product.price,
      baseUnit: product.unit,
      isAvailable: true,
      selectedVariant: v.value,
    });
  };

  const baseLabel =
    product.unit === 'pc'
      ? 'piece'
      : product.unit === 'kg'
        ? 'kg'
        : 'kg'; // gm-priced products are still presented per-kg in subhead

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 1000,
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${ANIMATION_MS}ms ease`,
          willChange: 'opacity',
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1001,
          background: colors.surface,
          borderRadius: '24px 24px 0 0',
          padding: '12px 20px 14px',
          paddingBottom: 'calc(14px + var(--safe-area-bottom))',
          color: colors.text.primary,
          maxHeight: '82%',
          display: 'flex',
          flexDirection: 'column',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${ANIMATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
          willChange: 'transform',
          boxShadow: '0 -16px 40px rgba(28, 42, 33, 0.18)',
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

        {/* Header */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            w={56}
            h={56}
            radius={12}
            fit="cover"
            style={{ flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily:
                  "var(--font-heading), 'Instrument Serif', Georgia, serif",
                fontSize: 22,
                lineHeight: 1.1,
                letterSpacing: -0.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 3,
              }}
            >
              ₹{Math.round(product.price)} per {product.baseQuantity}
              {product.unit}
              {product.discount && product.discount > 0 ? (
                <span
                  style={{
                    marginLeft: 8,
                    color: colors.primary,
                    fontWeight: 700,
                  }}
                >
                  {product.discount}% OFF
                </span>
              ) : null}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              background: colors.surfaceAlt,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconX size={16} color={colors.text.primary} />
          </button>
        </div>

        <div
          style={{
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.text.secondary,
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          Choose {product.unit === 'pc' ? 'quantity' : 'weight'}
        </div>

        {/* Variant rows */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingRight: 2,
          }}
        >
          {variants.map((v) => {
            const qty = lineQty(v.value);
            const price = calculateItemPrice(
              v.quantity,
              v.unit,
              product.price,
              product.baseQuantity,
              product.unit
            );
            return (
              <div
                key={v.value}
                style={{
                  padding: 14,
                  borderRadius: 16,
                  border: `1.5px solid ${
                    qty > 0 ? colors.primary : colors.border
                  }`,
                  background:
                    qty > 0 ? colors.secondarySoft : colors.background,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>
                    {v.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.text.secondary,
                      marginTop: 2,
                    }}
                  >
                    ₹{Math.round(price)}
                  </div>
                </div>

                {qty > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: colors.primary,
                      borderRadius: 10,
                      height: 36,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => decrementLine(product.id, v.value)}
                      style={{
                        width: 36,
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.text.inverse,
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: 'inherit',
                      }}
                    >
                      −
                    </button>
                    <div
                      style={{
                        minWidth: 24,
                        textAlign: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                        color: colors.text.inverse,
                      }}
                    >
                      {qty}
                    </div>
                    <button
                      onClick={() => incrementLine(product.id, v.value)}
                      style={{
                        width: 36,
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.text.inverse,
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: 'inherit',
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(v)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 10,
                      background: 'transparent',
                      color: colors.primary,
                      border: `1.5px solid ${colors.primary}`,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      height: 36,
                    }}
                  >
                    ADD
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: '100%',
            height: 50,
            borderRadius: 25,
            background: colors.primary,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Done
        </button>
      </div>
    </>
  );
}
