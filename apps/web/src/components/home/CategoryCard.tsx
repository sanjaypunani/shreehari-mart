'use client';

import React from 'react';
import { Box, UnstyledButton } from '@mantine/core';
import { colors, spacing, radius, shadow, typography } from '../../theme';
import { Text, Image } from '../ui';

export interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  onClick?: (id: string) => void;
}

export function CategoryCard({ id, name, image, onClick }: CategoryCardProps) {
  return (
    <UnstyledButton
      onClick={() => onClick?.(id)}
      style={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Box
        style={{
          backgroundColor: colors.background,
          borderRadius: radius.sm,
          padding: spacing.xs,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = shadow.md;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Category Image */}
        <Box
          style={{
            width: '100%',
            aspectRatio: '1',
            backgroundColor: colors.surface,
            borderRadius: radius.sm,
            overflow: 'hidden',
            marginBottom: spacing.xs,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={image}
            alt={name}
            width="100%"
            height="100%"
            fit="cover"
            radius="sm"
            withPlaceholder
          />
        </Box>

        {/* Category Name */}
        <Text
          size="xs"
          fw={typography.fontWeight.medium}
          variant="primary"
          style={{
            lineHeight: typography.lineHeight.normal,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '2.4em', // Ensures consistent height for 2 lines
            hyphens: 'auto',
          }}
        >
          {name}
        </Text>
      </Box>
    </UnstyledButton>
  );
}
