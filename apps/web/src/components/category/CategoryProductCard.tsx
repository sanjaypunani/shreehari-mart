'use client';

import React from 'react';
import { IconClock, IconPlus } from '@tabler/icons-react';
import { colors } from '../../theme';
import { Image } from '../ui';

export interface CategoryProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  quantity: string;
  deliveryTime?: string;
  inCartQty?: number;
  onClick?: (id: string) => void;
  onAdd?: (id: string) => void;
}

export function CategoryProductCard({
  id,
  name,
  image,
  price,
  discount,
  quantity,
  deliveryTime,
  inCartQty = 0,
  onClick,
  onAdd,
}: CategoryProductCardProps) {
  const originalPrice =
    discount && discount > 0
      ? Math.round(price / (1 - discount / 100))
      : null;

  return (
    <div
      onClick={() => onClick?.(id)}
      style={{
        background: colors.background,
        borderRadius: 10,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          background: colors.surfaceAlt,
        }}
      >
        <Image
          src={image}
          alt={name}
          width="100%"
          height="100%"
          fit="cover"
          radius={0}
          withPlaceholder
        />

        {/* Add button (top-right) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.(id);
          }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 26,
            height: 26,
            borderRadius: 7,
            background: '#fff',
            border: `1px solid ${colors.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {inCartQty > 0 ? (
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: colors.primary,
              }}
            >
              {inCartQty}
            </div>
          ) : (
            <IconPlus size={14} color={colors.primary} stroke={2.5} />
          )}
        </div>

        {/* Delivery time tag (bottom-left) */}
        {deliveryTime && (
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              left: 6,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(0,0,0,0.55)',
              color: '#fff',
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: 0.2,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <IconClock size={8} color="#fff" />
            <span>{deliveryTime.toUpperCase()}</span>
          </div>
        )}
      </div>

      <div
        style={{
          padding: '8px 8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.25,
            color: colors.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 30,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: colors.text.secondary,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {quantity}
        </div>
        {discount && discount > 0 ? (
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: colors.primary,
              marginTop: 2,
            }}
          >
            {discount}% OFF
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            marginTop: 2,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: colors.text.primary,
            }}
          >
            ₹{Math.round(price)}
          </span>
          {originalPrice && (
            <span
              style={{
                fontSize: 11,
                color: colors.text.faint,
                textDecoration: 'line-through',
              }}
            >
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
