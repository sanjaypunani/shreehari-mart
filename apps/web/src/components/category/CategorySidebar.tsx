'use client';

import React from 'react';
import { Box, Stack, UnstyledButton, ScrollArea } from '@mantine/core';
import { colors, spacing, radius, typography } from '../../theme';
import { Text, Image } from '../ui';

export interface CategorySidebarItem {
  id: string;
  name: string;
  image: string;
}

export interface CategorySidebarProps {
  categories: CategorySidebarItem[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <Box
      style={{
        width: '90px',
        height: 'calc(var(--app-viewport-height) - 70px)',
        backgroundColor: 'rgba(255, 255, 255, 0.78)',
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 70,
        backdropFilter: 'blur(8px)',
      }}
    >
      <ScrollArea style={{ height: '100%' }} scrollbarSize={4}>
        <Stack gap={0}>
          {categories.map((category) => {
            const isSelected = category.id === selectedCategoryId;
            return (
              <UnstyledButton
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                style={{
                  padding: `${spacing.sm} 4px`,
                  backgroundColor: isSelected ? 'rgba(31, 122, 99, 0.1)' : 'transparent',
                  borderLeft: isSelected
                    ? `4px solid ${colors.primary}`
                    : '4px solid transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* Category Image */}
                <Box
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: spacing.xs,
                    border: `1px solid ${isSelected ? colors.primary : colors.border}`,
                    backgroundColor: 'white',
                    padding: '4px',
                  }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width="100%"
                    height="100%"
                    fit="contain"
                    withPlaceholder
                  />
                </Box>

                {/* Category Name */}
                <Text
                  size="xs"
                  variant={isSelected ? 'primary' : 'secondary'}
                  style={{
                    fontSize: '9px',
                    textAlign: 'center',
                    lineHeight: 1.1,
                    fontWeight: isSelected
                      ? typography.fontWeight.bold
                      : typography.fontWeight.medium,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {category.name}
                </Text>
              </UnstyledButton>
            );
          })}
        </Stack>
      </ScrollArea>
    </Box>
  );
}
