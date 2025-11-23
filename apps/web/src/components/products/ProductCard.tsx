'use client';

import React from 'react';
import { Box, Stack, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconClock } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../../theme';
import { Text, Image, Badge } from '../ui';

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
        backgroundColor: 'white',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}
    >
      {/* Product Image Container */}
      <Box
        style={{
          width: '100%',
          aspectRatio: '1',
          position: 'relative',
          marginBottom: spacing.xs,
        }}
        onClick={() => onClick?.(id)}
      >
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
            top: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <ActionIcon
            size={32}
            radius="md"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(id);
            }}
            style={{
              backgroundColor: 'white',
              borderColor: '#247c62', // Green border
              color: '#247c62',
              borderWidth: '1px',
            }}
          >
            <IconPlus size={18} strokeWidth={2.5} />
          </ActionIcon>
        </Box>
      </Box>

      {/* Product Details */}
      <Stack gap={4} style={{ flexGrow: 1 }}>
        {/* Delivery Time */}
        <Group gap={4} align="center">
           <IconClock size={10} color={colors.text.secondary} />
           <Text size="xs" variant="secondary" style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
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
          }}
        >
          {name}
        </Text>
        
        {/* Description (Optional - hardcoded for now based on image) */}
        <Text size="xs" variant="secondary" style={{ fontSize: '10px', lineHeight: 1.2, color: '#888' }}>
            Fresh, aromatic, detox, garnish for soups & curries
        </Text>

        {/* Quantity */}
        <Text size="xs" variant="secondary" style={{ fontSize: '11px', marginTop: 4 }}>
            {quantity}
        </Text>

        {/* Price Section */}
        <Group gap={6} align="center" mt="auto">
           {/* Discount Percentage */}
           {discount && (
               <Text size="xs" style={{ color: '#ff6b00', fontWeight: 700, fontSize: '11px' }}>
                   {discount}% OFF
               </Text>
           )}
           
           {/* Current Price */}
           <Text size="sm" fw={typography.fontWeight.bold} style={{ color: colors.text.primary }}>
               ₹{price}
           </Text>

           {/* Original Price */}
           {originalPrice && (
               <Text size="xs" style={{ textDecoration: 'line-through', color: colors.text.secondary, fontSize: '11px' }}>
                   ₹{originalPrice}
               </Text>
           )}
        </Group>
      </Stack>
    </Box>
  );
}
