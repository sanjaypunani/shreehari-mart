'use client';

import React from 'react';
import { Box, Group } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { colors, typography } from '../../theme';
import { Text, Image } from '../ui';
import { useCartStore } from '../../store';

export interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  quantity: string;
  deliveryTime?: string;
  tag?: string;
  onClick?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  image,
  price,
  discount,
  quantity,
  deliveryTime,
  tag,
  onClick,
  onAddToCart,
}: ProductCardProps) {
  const originalPrice = discount
    ? Math.round(price / (1 - discount / 100))
    : null;

  const inCartQty = useCartStore((s) =>
    s.items.reduce((sum, i) => (i.id === id ? sum + i.quantity : sum), 0)
  );
  const isInCart = inCartQty > 0;

  return (
    <Box
      style={{
        background: colors.surface,
        borderRadius: 18,
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Image */}
      <Box
        style={{
          position: 'relative',
          aspectRatio: '1 / 0.9',
        }}
        onClick={() => onClick?.(id)}
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

        {/* Tag badge (top-left) */}
        {tag && (
          <Box
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              padding: '3px 8px',
              borderRadius: 6,
              background: colors.surface,
              color: colors.text.primary,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase' as const,
            }}
          >
            {tag}
          </Box>
        )}

        {/* Discount badge (top-right) */}
        {discount && discount > 0 && (
          <Box
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              padding: '3px 7px',
              borderRadius: 6,
              background: colors.secondary,
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            -{discount}%
          </Box>
        )}
      </Box>

      {/* Details */}
      <Box
        style={{ padding: 12, display: 'flex', flexDirection: 'column', flex: 1 }}
        onClick={() => onClick?.(id)}
      >
        <Text
          size="13px"
          fw={typography.fontWeight.semibold}
          style={{
            lineHeight: 1.25,
            letterSpacing: -0.1,
            color: colors.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em',
          }}
        >
          {name}
        </Text>
        <Text
          size="11px"
          style={{ color: colors.text.secondary, marginTop: 2 }}
        >
          {quantity}
        </Text>

        <Box style={{ flex: 1 }} />

        {/* Price + ADD button row */}
        <Group
          justify="space-between"
          align="center"
          mt={10}
          wrap="nowrap"
        >
          <div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: -0.2,
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
                  marginLeft: 5,
                }}
              >
                ₹{Math.round(originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(id);
            }}
            aria-label={isInCart ? `In cart: ${inCartQty}` : 'Add to cart'}
            style={{
              padding: '6px 14px',
              borderRadius: 14,
              background: isInCart ? colors.primary : 'transparent',
              color: isInCart ? colors.text.inverse : colors.primary,
              border: `1.5px solid ${colors.primary}`,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: 0.3,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {isInCart ? (
              <>
                <IconCheck size={13} stroke={3} />
                {inCartQty}
              </>
            ) : (
              'ADD'
            )}
          </button>
        </Group>
      </Box>
    </Box>
  );
}
