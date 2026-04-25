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
  columns = { base: 4, xs: 4, sm: 5, md: 6, lg: 8 },
}: CategoryGridProps) {
  return (
    <Box
      style={{
        backgroundColor: 'transparent',
        paddingInline: spacing.xs,
      }}
    >
      {/* Section Title */}
      {title && (
        <Text
          size="md"
          fw={typography.fontWeight.semibold}
          variant="primary"
          style={{
            marginBottom: spacing.xs,
            fontSize: '17px',
            letterSpacing: '-0.01em',
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
