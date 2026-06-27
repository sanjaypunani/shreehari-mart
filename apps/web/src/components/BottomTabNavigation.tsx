'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  IconHome2,
  IconLeaf,
  IconSearch,
  IconReceipt,
  IconUser,
} from '@tabler/icons-react';
import { colors, typography } from '../theme';
import { Text } from './ui';
import { triggerHaptic } from '../utils';

type TabKey = 'home' | 'shop' | 'search' | 'orders' | 'account';

interface BottomTabItem {
  key: TabKey;
  label: string;
  href: string;
  icon: React.ComponentType<{
    size?: string | number;
    color?: string;
    stroke?: string | number;
  }>;
}

const getActiveTab = (pathname: string, _section: string | null): TabKey => {
  if (pathname.startsWith('/orders')) return 'orders';
  if (pathname.startsWith('/account')) return 'account';
  if (pathname.startsWith('/category/')) return 'shop';
  if (pathname.startsWith('/search')) return 'search';
  return 'home';
};

interface BottomTabNavigationContentProps {
  /** Controls visibility for scroll auto-hide. Default true. */
  visible?: boolean;
}

function BottomTabNavigationContent({
  visible = true,
}: BottomTabNavigationContentProps) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const activeTab = getActiveTab(pathname, searchParams.get('section'));
  const categoryHref = pathname.startsWith('/category/')
    ? pathname
    : '/category/all';

  const tabs: BottomTabItem[] = [
    { key: 'home', label: 'Home', href: '/', icon: IconHome2 },
    { key: 'shop', label: 'Shop', href: categoryHref, icon: IconLeaf },
    { key: 'search', label: 'Search', href: '/search', icon: IconSearch },
    { key: 'orders', label: 'Orders', href: '/orders', icon: IconReceipt },
    { key: 'account', label: 'Profile', href: '/account', icon: IconUser },
  ];

  // Liquid-glass capsule. Heavy backdrop blur + low-opacity tint, white
  // hairline highlight on top, soft outer shadow for the floating feel.
  return (
    <Box
      hiddenFrom="sm"
      style={{
        position: 'fixed',
        left: 14,
        right: 14,
        bottom: 'calc(6px + var(--safe-area-bottom))',
        zIndex: 90,
        background: 'rgba(255, 253, 247, 0.55)',
        backdropFilter: 'blur(22px) saturate(180%)',
        WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        borderRadius: 30,
        padding: '8px 10px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: [
          '0 14px 40px rgba(28, 42, 33, 0.18)',
          '0 2px 8px rgba(28, 42, 33, 0.08)',
          'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
          'inset 0 -1px 0 rgba(28, 42, 33, 0.05)',
        ].join(', '),
        // Scroll auto-hide
        transform: visible
          ? 'translateY(0)'
          : 'translateY(calc(100% + 30px))',
        transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
      }}
    >
      <Group
        grow
        wrap="nowrap"
        gap={2}
        align="stretch"
        style={{ minHeight: 48 }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const color = isActive ? colors.primary : colors.text.secondary;
          const Icon = tab.icon;

          return (
            <UnstyledButton
              key={tab.key}
              component={Link}
              href={tab.href}
              onClick={() => triggerHaptic('selection')}
              aria-current={isActive ? 'page' : undefined}
              style={{
                minWidth: 'var(--touch-target-size)',
                borderRadius: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive
                  ? 'rgba(45, 74, 43, 0.14)'
                  : 'transparent',
                boxShadow: isActive
                  ? 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(28,42,33,0.06)'
                  : 'none',
                color,
                transition:
                  'background 220ms cubic-bezier(.2,.8,.2,1), transform 120ms ease',
                padding: '6px 4px',
              }}
              onPointerDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  'scale(0.94)';
              }}
              onPointerUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
              onPointerLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              <Stack gap={2} align="center" justify="center">
                <Icon
                  size={20}
                  color={color}
                  stroke={isActive ? 2.2 : 1.8}
                />
                <Text
                  size="10px"
                  fw={
                    isActive
                      ? typography.fontWeight.semibold
                      : typography.fontWeight.medium
                  }
                  style={{ color, lineHeight: 1 }}
                >
                  {tab.label}
                </Text>
              </Stack>
            </UnstyledButton>
          );
        })}
      </Group>
    </Box>
  );
}

export interface BottomTabNavigationProps {
  visible?: boolean;
}

export function BottomTabNavigation({ visible = true }: BottomTabNavigationProps) {
  return (
    <React.Suspense fallback={null}>
      <BottomTabNavigationContent visible={visible} />
    </React.Suspense>
  );
}
