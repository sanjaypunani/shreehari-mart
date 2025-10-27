'use client';

import React from 'react';
import { Box, Stack, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconClock } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../../theme';
import { Text, Image, Badge, Button } from '../ui';

export interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: string; // e.g., "1 Bunch x 2"
  deliveryTime?: string; // e.g., "7 MINS"
  onClick?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  discount,
  quantity,
  deliveryTime = '7 MINS',
  onClick,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Box
      style={{
        backgroundColor: colors.background,
        transition: 'all 0.2s ease',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}
    >
      {/* Product Image Container with Border */}
      <Box
        style={{
          width: '100%',
          aspectRatio: '1',
          backgroundColor: colors.surface,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          cursor: 'pointer',
        }}
        onClick={() => onClick?.(id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = shadow.md;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Discount Badge - Hidden for now */}
        {false && (
          <Box
            style={{
              position: 'absolute',
              top: spacing.xs,
              left: spacing.xs,
              zIndex: 10,
            }}
          >
            <Badge
              variant="success"
              size="sm"
              style={{
                fontWeight: typography.fontWeight.bold,
                fontSize: '11px',
                padding: '4px 8px',
              }}
            >
              {discount}% OFF
            </Badge>
          </Box>
        )}

        {/* Add Button */}
        <Box
          style={{
            position: 'absolute',
            top: -12,
            right: -12,
            zIndex: 10,
          }}
        >
          <ActionIcon
            size={28}
            radius="50%"
            variant="filled"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(id);
            }}
            style={{
              backgroundColor: 'white',
              border: `2px solid ${colors.primary}`,
              boxShadow: shadow.sm,
              borderRadius: '50%',
            }}
          >
            <IconPlus size={16} color={colors.primary} strokeWidth={2.5} />
          </ActionIcon>
        </Box>

        {/* Product Image */}
        <Image
          src={image}
          alt={name}
          width="100%"
          height="100%"
          fit="cover"
          radius={0}
          withPlaceholder
        />
      </Box>

      {/* Product Details */}
      <Stack gap={0} p={0} pt={spacing.sm} style={{ flexGrow: 1 }}>
        {/* Product Name */}
        <Text
          size="sm"
          fw={typography.fontWeight.semibold}
          variant="primary"
          style={{
            lineHeight: typography.lineHeight.tight,
            minHeight: '2.4em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </Text>

        {/* Quantity Selector */}
        <Text
          size="sm"
          variant="primary"
          style={{
            fontWeight: typography.fontWeight.medium,
          }}
        >
          {quantity}
        </Text>

        {/* Price Only - No strikethrough price */}
        <Text
          size="lg"
          fw={typography.fontWeight.bold}
          variant="primary"
          style={{
            color: colors.text.primary,
          }}
        >
          ₹{price}
        </Text>
      </Stack>
    </Box>
  );
}
