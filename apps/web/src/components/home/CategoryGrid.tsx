'use client';

import React from 'react';
import { Box, SimpleGrid } from '@mantine/core';
import { colors, spacing, typography } from '../../theme';
import { Text } from '../ui';
import { CategoryCard, CategoryCardProps } from './CategoryCard';

export interface CategoryGridProps {
  title?: string;
  categories: Omit<CategoryCardProps, 'onClick'>[];
  onCategoryClick?: (categoryId: string) => void;
  columns?: {
    base?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export function CategoryGrid({
  title = 'Grocery & Kitchen',
  categories,
  onCategoryClick,
  columns = { base: 4, xs: 4, sm: 6, md: 8, lg: 10 },
}: CategoryGridProps) {
  return (
    <Box
      style={{
        backgroundColor: colors.background,
        padding: spacing.md,
      }}
    >
      {/* Section Title */}
      {title && (
        <Text
          size="md"
          fw={typography.fontWeight.semibold}
          variant="primary"
          style={{
            marginBottom: spacing.sm,
            fontSize: '16px',
          }}
        >
          {title}
        </Text>
      )}

      {/* Category Grid */}
      <SimpleGrid cols={columns} spacing={spacing.xs}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image={category.image}
            onClick={onCategoryClick}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
