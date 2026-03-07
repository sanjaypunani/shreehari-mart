'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
import { usePathname } from 'next/navigation';
import {
  IconGridDots,
  IconHome2,
  IconUser,
  IconWallet,
} from '@tabler/icons-react';
import { colors, shadow, typography } from '../theme';
import { Text } from './ui';

type TabKey = 'home' | 'category' | 'wallet' | 'account';

interface BottomTabItem {
  key: TabKey;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: string | number; color?: string; stroke?: string | number }>;
}

const getActiveTab = (pathname: string): TabKey => {
  if (pathname.startsWith('/account/wallet')) {
    return 'wallet';
  }

  if (pathname.startsWith('/account')) {
    return 'account';
  }

  if (pathname.startsWith('/category/')) {
    return 'category';
  }

  return 'home';
};

export function BottomTabNavigation() {
  const pathname = usePathname() || '/';
  const activeTab = getActiveTab(pathname);
  const categoryHref = pathname.startsWith('/category/') ? pathname : '/category/1';

  const tabs: BottomTabItem[] = [
    { key: 'home', label: 'Home', href: '/', icon: IconHome2 },
    { key: 'category', label: 'Category', href: categoryHref, icon: IconGridDots },
    { key: 'wallet', label: 'Wallet', href: '/account/wallet', icon: IconWallet },
    { key: 'account', label: 'Account', href: '/account', icon: IconUser },
  ];

  return (
    <Box
      hiddenFrom="sm"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        height: 'var(--mobile-bottom-tabs-total-height)',
        paddingBottom: 'var(--safe-area-bottom)',
        paddingLeft: 'max(12px, var(--safe-area-left))',
        paddingRight: 'max(12px, var(--safe-area-right))',
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        boxShadow: `0 -4px 14px rgba(0, 0, 0, 0.08), ${shadow.sm}`,
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
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive ? `${colors.primary}1A` : 'transparent',
                color,
                transition: 'background-color 120ms ease',
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
