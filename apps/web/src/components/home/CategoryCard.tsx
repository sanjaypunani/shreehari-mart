'use client';

import React from 'react';
import { Box, UnstyledButton } from '@mantine/core';
import { colors, spacing, radius, typography } from '../../theme';
import { Text, Image } from '../ui';

export interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  itemCount?: number;
  onClick?: (id: string) => void;
}

export function CategoryCard({ id, name, image, itemCount, onClick }: CategoryCardProps) {
  return (
    <UnstyledButton
      onClick={() => onClick?.(id)}
      style={{
        flexShrink: 0,
        width: 96,
        cursor: 'pointer',
        textAlign: 'center',
      }}
    >
      <Box
        style={{
          width: 96,
          height: 96,
          borderRadius: 22,
          overflow: 'hidden',
          background: colors.surfaceAlt,
          marginBottom: 8,
          border: `1px solid ${colors.border}`,
        }}
      >
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
      <Text
        size="12px"
        fw={typography.fontWeight.semibold}
        style={{
          lineHeight: 1.2,
          color: colors.text.primary,
        }}
      >
        {name}
      </Text>
      {itemCount !== undefined && (
        <Text
          size="10px"
          style={{
            color: colors.text.secondary,
            marginTop: 2,
          }}
        >
          {itemCount} items
        </Text>
      )}
    </UnstyledButton>
  );
}
