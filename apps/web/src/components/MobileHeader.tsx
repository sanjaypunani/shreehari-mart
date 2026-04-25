'use client';

import React from 'react';
import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { IconMapPin, IconChevronDown, IconUser } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../theme';
import { Text, SearchInput, IconButton } from './ui';
import { ProductSearchDialog } from './search';

export function MobileHeader() {
  const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [compactMode, setCompactMode] = React.useState(false);
  const compactModeRef = React.useRef(false);
  const tickingRef = React.useRef(false);
  const rafIdRef = React.useRef<number | null>(null);
  const snapTimerRef = React.useRef<number | null>(null);
  const snappingRef = React.useRef(false);

  React.useEffect(() => {
    const collapseAt = 72;
    const expandAt = 28;
    const snapMin = 16;
    const snapMax = 90;
    const collapsedScrollTarget = 92;
    const snapDelayMs = 140;

    const updateCompactState = (scrollY: number) => {
      // Hysteresis avoids flicker around a single threshold.
      const nextCompact = compactModeRef.current
        ? scrollY > expandAt
        : scrollY > collapseAt;

      if (nextCompact !== compactModeRef.current) {
        compactModeRef.current = nextCompact;
        setCompactMode(nextCompact);
      }
    };

    const maybeSnapState = () => {
      if (snappingRef.current) {
        return;
      }

      const y = window.scrollY || window.pageYOffset || 0;

      // Only snap in the transition zone to avoid fighting natural scrolling.
      if (y <= snapMin || y >= snapMax) {
        return;
      }

      const target =
        Math.abs(y - 0) <= Math.abs(y - collapsedScrollTarget)
          ? 0
          : collapsedScrollTarget;

      if (Math.abs(target - y) < 8) {
        return;
      }

      snappingRef.current = true;
      window.scrollTo({ top: target, behavior: 'smooth' });

      window.setTimeout(() => {
        snappingRef.current = false;
        updateCompactState(window.scrollY || window.pageYOffset || 0);
      }, 280);
    };

    const onScroll = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      rafIdRef.current = window.requestAnimationFrame(() => {
        updateCompactState(window.scrollY || window.pageYOffset || 0);
        tickingRef.current = false;
      });

      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
      }
      snapTimerRef.current = window.setTimeout(maybeSnapState, snapDelayMs);
    };

    updateCompactState(window.scrollY || window.pageYOffset || 0);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
      }
    };
  }, []);

  return (
    <Box
      component="header"
      style={{
        backgroundColor: 'rgba(245, 248, 252, 0.9)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        boxShadow: shadow.sm,
        paddingTop: 'var(--safe-area-top)',
        transition: 'padding 220ms ease',
        willChange: 'padding',
      }}
    >
      <Stack gap={spacing.xs} px={spacing.md} py={compactMode ? spacing.xs : spacing.sm}>
        {/* Top Section - Location and Profile */}
        <Box
          style={{
            overflow: 'hidden',
            maxHeight: compactMode ? 0 : 110,
            opacity: compactMode ? 0 : 1,
            transform: compactMode ? 'translateY(-10px)' : 'translateY(0)',
            transition:
              'max-height 240ms ease, opacity 220ms ease, transform 240ms ease',
            pointerEvents: compactMode ? 'none' : 'auto',
            willChange: 'max-height, opacity, transform',
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            {/* Location Selector */}
            <UnstyledButton
              style={{
                flex: 1,
                minHeight: 'var(--touch-target-size)',
                borderRadius: radius.lg,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                padding: `${spacing.sm} ${spacing.md}`,
                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
              }}
              onClick={() => {}}
            >
              <Group gap={spacing.sm} wrap="nowrap">
                <Box
                  style={{
                    background:
                      'linear-gradient(145deg, rgba(31, 122, 99, 0.18), rgba(31, 122, 99, 0.08))',
                    borderRadius: radius.full,
                    padding: spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '42px',
                    height: '42px',
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <IconMapPin size={19} color={colors.primary} stroke={2.2} />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Group gap={4} wrap="nowrap">
                    <Text
                      size="sm"
                      fw={typography.fontWeight.semibold}
                      style={{
                        color: colors.text.primary,
                        lineHeight: typography.lineHeight.tight,
                      }}
                    >
                      Deliver to home
                    </Text>
                    <IconChevronDown
                      size={15}
                      color={colors.text.secondary}
                      stroke={2}
                    />
                  </Group>
                  <Text
                    variant="secondary"
                    size="xs"
                    style={{
                      lineHeight: typography.lineHeight.tight,
                      marginTop: '2px',
                    }}
                  >
                    Tap to set address
                  </Text>
                </Box>
              </Group>
            </UnstyledButton>

            {/* Profile Icon */}
            <IconButton
              component={Link}
              href="/account"
              aria-label="Open account"
              variant="ghost"
              size="lg"
              radius="full"
              style={{
                width: 'var(--touch-target-size)',
                minWidth: 'var(--touch-target-size)',
                height: 'var(--touch-target-size)',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
              }}
            >
              <IconUser size={20} color={colors.primary} stroke={2} />
            </IconButton>
          </Group>
        </Box>

        {/* Search Section */}
        <Box pb={compactMode ? 2 : spacing.xs}>
          <UnstyledButton
            style={{ width: '100%', display: 'block', borderRadius: radius.lg }}
            onClick={openSearch}
            aria-label="Search products"
          >
            <SearchInput
              placeholder='Search for "Tomato" or "Milk"'
              size="md"
              readOnly
              style={{ pointerEvents: 'none' }}
              styles={{
                input: {
                  minHeight: '46px',
                  borderRadius: radius.lg,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
                },
              }}
            />
          </UnstyledButton>
        </Box>
      </Stack>

      <ProductSearchDialog opened={searchOpened} onClose={closeSearch} />
    </Box>
  );
}
