'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  IconGridDots,
  IconHome2,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import { colors, shadow, typography } from '../theme';
import { Text } from './ui';
import { useCategories } from '../hooks/use-api';

type TabKey = 'home' | 'shop' | 'orders' | 'account';

interface BottomTabItem {
  key: TabKey;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: string | number; color?: string; stroke?: string | number }>;
}

const getActiveTab = (pathname: string, section: string | null): TabKey => {
  if (pathname.startsWith('/orders')) {
    return 'orders';
  }

  if (pathname.startsWith('/account')) {
    if (section === 'orders') {
      return 'orders';
    }

    return 'account';
  }

  if (pathname.startsWith('/category/')) {
    return 'shop';
  }

  return 'home';
};

function BottomTabNavigationContent() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const activeTab = getActiveTab(pathname, searchParams.get('section'));
  const { data: categoriesResponse } = useCategories();
  const firstCategoryId = categoriesResponse?.data?.[0]?.id;
  const categoryHref = pathname.startsWith('/category/')
    ? pathname
    : firstCategoryId
      ? `/category/${firstCategoryId}`
      : '/';

  const tabs: BottomTabItem[] = [
    { key: 'home', label: 'Home', href: '/', icon: IconHome2 },
    { key: 'shop', label: 'Shop', href: categoryHref, icon: IconGridDots },
    { key: 'orders', label: 'Orders', href: '/account?section=orders', icon: IconShoppingBag },
    { key: 'account', label: 'Account', href: '/account', icon: IconUser },
  ];

  return (
    <Box
      hiddenFrom="sm"
      style={{
        position: 'fixed',
        left: 'max(10px, var(--safe-area-left))',
        right: 'max(10px, var(--safe-area-right))',
        bottom: 0,
        zIndex: 1100,
        height: 'var(--mobile-bottom-tabs-total-height)',
        paddingBottom: 'var(--mobile-bottom-tabs-bottom-padding)',
        paddingLeft: 10,
        paddingRight: 10,
        borderTop: `1px solid ${colors.border}`,
        borderLeft: `1px solid ${colors.border}`,
        borderRight: `1px solid ${colors.border}`,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 -10px 26px rgba(15, 23, 42, 0.12), ${shadow.sm}`,
      }}
    >
      <Group
        grow
        wrap="nowrap"
        gap={4}
        align="stretch"
        style={{ minHeight: 'var(--mobile-bottom-tabs-height)' }}
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
              style={{
                minHeight: 'var(--mobile-bottom-tabs-height)',
                minWidth: 'var(--touch-target-size)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive
                  ? 'linear-gradient(145deg, rgba(31, 122, 99, 0.2), rgba(31, 122, 99, 0.08))'
                  : 'transparent',
                color,
                transition: 'all 180ms ease',
              }}
            >
              <Stack gap={2} align="center" justify="center">
                <Icon size={20} color={color} stroke={isActive ? 2.4 : 2} />
                <Text
                  size="11px"
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

export function BottomTabNavigation() {
  return (
    <React.Suspense fallback={null}>
      <BottomTabNavigationContent />
    </React.Suspense>
  );
}
