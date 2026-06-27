'use client';

import React from 'react';
import { Box, Group } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { colors, spacing, typography } from '../../theme';

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
        backgroundColor: colors.background,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Box
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button
          onClick={onBack}
          aria-label="Go back"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconChevronLeft size={18} color={colors.text.primary} />
        </button>

        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 600,
            color: colors.text.primary,
          }}
        >
          {title}
        </div>

        <div
          style={{
            width: 40,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {rightSlot || <div style={{ width: 40 }} />}
        </div>
      </Box>

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
          <Box pt={spacing.sm} px={spacing.md}>
            {children}
          </Box>
        </Box>
      )}
    </Box>
  );
}
