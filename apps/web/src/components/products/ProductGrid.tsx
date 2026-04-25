'use client';

import React from 'react';
import { Box, SimpleGrid, Stack } from '@mantine/core';
import { colors, spacing, typography } from '../../theme';
import { Text } from '../ui';
import { ProductCard, ProductCardProps } from './ProductCard';

export interface ProductGridProps {
  title?: string;
  products: ProductCardProps[];
  columns?: {
    base?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  onProductClick?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export function ProductGrid({
  title = 'Fresh Veggies',
  products,
  columns = {
    base: 2,
    xs: 2,
    sm: 3,
    md: 3,
    lg: 4,
  },
  onProductClick,
  onAddToCart,
}: ProductGridProps) {
  return (
    <Box
      style={{
        backgroundColor: 'transparent',
        paddingInline: spacing.xs,
      }}
    >
      <Stack gap={spacing.sm}>
        {/* Section Title */}
        {title && (
          <Text
            size="lg"
            fw={typography.fontWeight.bold}
            variant="primary"
            style={{
              fontSize: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Text>
        )}

        {/* Product Grid */}
        <SimpleGrid
          cols={columns}
          spacing={spacing.xs}
          style={{
            width: '100%',
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </SimpleGrid>

        {/* Empty State */}
        {products.length === 0 && (
          <Box
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              backgroundColor: colors.surface,
              borderRadius: 12,
            }}
          >
            <Text size="md" variant="secondary">
              No products available
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
