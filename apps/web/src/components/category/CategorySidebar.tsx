'use client';

import React from 'react';
import { Box, Stack, UnstyledButton } from '@mantine/core';
import { IconApps } from '@tabler/icons-react';
import { colors } from '../../theme';
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
        width: 88,
        flexShrink: 0,
        overflow: 'auto',
        background: colors.surfaceAlt,
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      <Stack gap={0}>
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          return (
            <UnstyledButton
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              style={{
                width: '100%',
                padding: '14px 6px 12px',
                background: isSelected ? colors.background : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                position: 'relative',
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {/* Active indicator bar */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 10,
                    bottom: 10,
                    width: 3,
                    borderRadius: '0 2px 2px 0',
                    background: colors.primary,
                  }}
                />
              )}

              {/* Category thumbnail */}
              <Box
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: isSelected
                    ? `2px solid ${colors.primary}`
                    : `1px solid ${colors.border}`,
                  background: colors.background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width="100%"
                    height="100%"
                    fit="cover"
                    withPlaceholder
                  />
                ) : (
                  <IconApps
                    size={26}
                    color={isSelected ? colors.primary : colors.text.secondary}
                    stroke={1.6}
                  />
                )}
              </Box>

              {/* Category name */}
              <Text
                size="xs"
                style={{
                  fontSize: 10.5,
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? colors.primary : colors.text.primary,
                  lineHeight: 1.2,
                  textAlign: 'center',
                }}
              >
                {category.name}
              </Text>
            </UnstyledButton>
          );
        })}
      </Stack>
    </Box>
  );
}
