'use client';

import React from 'react';
import { Box, Stack, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconClock } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../../theme';
import { Text, Image } from '../ui';

export interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  quantity: string; // e.g., "500 g"
  deliveryTime?: string; // e.g., "20 MINS"
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
  deliveryTime = '20 MINS',
  onClick,
  onAddToCart,
}: ProductCardProps) {
  // Calculate original price if discount exists
  const originalPrice = discount ? Math.round(price / (1 - discount / 100)) : null;

  return (
    <Box
      style={{
        backgroundColor: colors.surface,
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        boxShadow: shadow.sm,
        padding: spacing.xs,
        cursor: 'pointer',
      }}
    >
      {/* Product Image Container */}
      <Box
        style={{
          width: '100%',
          aspectRatio: '1',
          position: 'relative',
          marginBottom: spacing.xs,
          borderRadius: radius.md,
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, rgba(236, 244, 242, 0.9) 0%, rgba(255, 255, 255, 1) 100%)',
        }}
        onClick={() => onClick?.(id)}
      >
        {discount && (
          <Box
            style={{
              position: 'absolute',
              top: spacing.xs,
              left: spacing.xs,
              zIndex: 9,
              backgroundColor: `${colors.secondary}`,
              color: colors.text.inverse,
              borderRadius: radius.full,
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: typography.fontWeight.bold,
              letterSpacing: '0.01em',
            }}
          >
            {discount}% OFF
          </Box>
        )}

        <Image
          src={image}
          alt={name}
          width="100%"
          height="100%"
          fit="contain"
          radius="md"
          withPlaceholder
        />

        {/* Add Button (Top Right) */}
        <Box
          style={{
            position: 'absolute',
            right: spacing.xs,
            bottom: spacing.xs,
            zIndex: 10,
          }}
        >
          <ActionIcon
            size={44}
            radius="xl"
            variant="filled"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(id);
            }}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.text.inverse,
              boxShadow: '0 12px 22px rgba(31, 122, 99, 0.35)',
            }}
            aria-label={`Add ${name} to cart`}
          >
            <IconPlus size={20} strokeWidth={2.5} />
          </ActionIcon>
        </Box>
      </Box>

      {/* Product Details */}
      <Stack gap={4} style={{ flexGrow: 1 }} onClick={() => onClick?.(id)}>
        {/* Delivery Time */}
        <Group gap={4} align="center">
          <IconClock size={11} color={colors.text.secondary} />
          <Text
            size="xs"
            variant="secondary"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {deliveryTime}
          </Text>
        </Group>

        {/* Product Name */}
        <Text
          size="sm"
          fw={typography.fontWeight.semibold}
          variant="primary"
          style={{
            lineHeight: 1.3,
            minHeight: '2.6em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '13px',
            letterSpacing: '-0.01em',
          }}
        >
          {name}
        </Text>

        {/* Quantity */}
        <Text
          size="xs"
          variant="secondary"
          style={{ fontSize: '11px', marginTop: 2, fontWeight: 600 }}
        >
          {quantity}
        </Text>

        {/* Price Section */}
        <Group gap={6} align="center" mt="auto">
          {/* Current Price */}
          <Text
            size="sm"
            fw={typography.fontWeight.bold}
            style={{ color: colors.text.primary, fontSize: '15px' }}
          >
            ₹{price}
          </Text>

          {/* Original Price */}
          {originalPrice && (
            <Text
              size="xs"
              style={{
                textDecoration: 'line-through',
                color: colors.text.secondary,
                fontSize: '11px',
              }}
            >
              ₹{originalPrice}
            </Text>
          )}
        </Group>
      </Stack>
    </Box>
  );
}
