'use client';

import React from 'react';
import { ActionIcon, Box, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { colors, radius, shadow, spacing, typography } from '../../theme';
import { Text } from '../ui';

export interface StickyPageHeaderProps {
  title: React.ReactNode;
  onBack: () => void;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
  compactScrollOffset?: number;
}

export function StickyPageHeader({
  title,
  onBack,
  rightSlot,
  children,
  compactScrollOffset = 28,
}: StickyPageHeaderProps) {
  const [isCompact, setIsCompact] = React.useState(false);
  const hasExtraContent = React.Children.count(children) > 0;

  React.useEffect(() => {
    if (!hasExtraContent) {
      setIsCompact(false);
      return;
    }

    const onScroll = () => {
      setIsCompact(window.scrollY > compactScrollOffset);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasExtraContent, compactScrollOffset]);

  return (
    <Box
      component="header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 130,
        backgroundColor: 'rgba(245, 248, 252, 0.94)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.border}`,
        boxShadow: shadow.sm,
      }}
    >
      <Box
        px={spacing.md}
        pt={'calc(var(--safe-area-top) + 8px)'}
        pb={spacing.sm}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            onClick={onBack}
            aria-label="Go back"
            style={{
              width: 'var(--touch-target-size)',
              minWidth: 'var(--touch-target-size)',
              height: 'var(--touch-target-size)',
              borderRadius: radius.full,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              color: colors.text.primary,
            }}
          >
            <IconArrowLeft size={22} />
          </ActionIcon>

          <Text
            size="md"
            fw={typography.fontWeight.bold}
            style={{
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </Text>

          <Box
            style={{
              width: 'var(--touch-target-size)',
              minWidth: 'var(--touch-target-size)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {rightSlot || <Box w={'var(--touch-target-size)'} />}
          </Box>
        </Group>

        {hasExtraContent && (
          <Box
            style={{
              overflow: 'hidden',
              maxHeight: isCompact ? 0 : 180,
              opacity: isCompact ? 0 : 1,
              transform: isCompact ? 'translateY(-8px)' : 'translateY(0)',
              transition:
                'max-height 220ms ease, opacity 200ms ease, transform 220ms ease',
            }}
          >
            <Box pt={spacing.sm}>{children}</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
