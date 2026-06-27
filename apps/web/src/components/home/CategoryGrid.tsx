'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { colors, spacing, typography } from '../../theme';
import { CategoryCard, CategoryCardProps } from './CategoryCard';

export interface CategoryGridProps {
  title?: string;
  subtitle?: string;
  categories: Omit<CategoryCardProps, 'onClick'>[];
  onCategoryClick?: (categoryId: string) => void;
}

export function CategoryGrid({
  title = 'Shop by category',
  subtitle = 'Fresh \u00b7 seasonal \u00b7 local',
  categories,
  onCategoryClick,
}: CategoryGridProps) {
  return (
    <Box>
      {/* Section Header */}
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
        </Box>
      )}

      {/* Horizontal scroll rail */}
      <Box
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          padding: '0 20px',
        }}
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            image={category.image}
            onClick={onCategoryClick}
          />
        ))}
      </Box>
    </Box>
  );
}
