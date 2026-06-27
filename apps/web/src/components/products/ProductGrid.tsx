'use client';

import React from 'react';
import { Box, SimpleGrid, Stack } from '@mantine/core';
import { colors, spacing, typography } from '../../theme';
import { Text } from '../ui';
import { ProductCard, ProductCardProps } from './ProductCard';

export interface ProductGridProps {
  title?: string;
  subtitle?: string;
  action?: string;
  onActionClick?: () => void;
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
  title,
  subtitle,
  action,
  onActionClick,
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
    <Box>
      {/* Section Header - Cropzo style */}
      {title && (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '0 20px',
            marginBottom: 14,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-heading), 'Instrument Serif', Georgia, serif",
                fontSize: 24,
                fontWeight: 400,
                letterSpacing: -0.3,
                color: colors.text.primary,
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 11,
                  color: colors.text.secondary,
                  marginTop: 6,
                  letterSpacing: '1px',
                  textTransform: 'uppercase' as const,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          {action && (
            <div
              onClick={onActionClick}
              style={{
                fontSize: 13,
                color: colors.primary,
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {action}
            </div>
          )}
        </Box>
      )}

      {/* Product Grid */}
      <Box px={20}>
        <SimpleGrid
          cols={columns}
          spacing={12}
          style={{ width: '100%' }}
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
      </Box>

      {/* Empty State */}
      {products.length === 0 && (
        <Box
          style={{
            padding: spacing.xl,
            textAlign: 'center',
            backgroundColor: colors.surface,
            borderRadius: 18,
            margin: '0 20px',
          }}
        >
          <Text size="md" style={{ color: colors.text.secondary }}>
            No products available
          </Text>
        </Box>
      )}
    </Box>
  );
}
