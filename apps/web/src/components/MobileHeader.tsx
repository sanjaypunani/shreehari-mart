'use client';

import React from 'react';
import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconMapPin,
  IconChevronDown,
  IconBell,
  IconShoppingCart,
  IconSearch,
  IconMicrophone,
} from '@tabler/icons-react';
import { colors, spacing, typography } from '../theme';
import { Text, IconButton } from './ui';
import { useCartStore, useDefaultAddress } from '../store';

export interface MobileHeaderProps {
  /** Controls whether the address row is visible (scroll auto-hide). */
  headerVisible?: boolean;
}

export function MobileHeader({ headerVisible = true }: MobileHeaderProps) {
  const router = useRouter();
  const cartCount = useCartStore((state) => state.items.length);
  const defaultAddress = useDefaultAddress();

  const headerLine = defaultAddress
    ? defaultAddress.area
    : 'Add delivery address';

  const handleAddressClick = () => {
    router.push('/account/addresses?select=1&returnUrl=%2F');
  };

  return (
    <Box
      component="header"
      style={{
        backgroundColor: 'rgba(245, 241, 232, 0.92)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        paddingTop: 'var(--safe-area-top)',
        height: 'calc(106px + var(--safe-area-top))',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          transform: headerVisible ? 'translateY(0)' : 'translateY(-60px)',
          transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* ── Address row: 60px height ── */}
        <Box
          style={{
            height: 60,
            opacity: headerVisible ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          <Stack gap={0} px={spacing.md} pt={spacing.sm}>
            <Group justify="space-between" wrap="nowrap" mb={spacing.sm}>
              <UnstyledButton
                onClick={handleAddressClick}
                aria-label={
                  defaultAddress
                    ? `Change delivery address (currently ${defaultAddress.area})`
                    : 'Add delivery address'
                }
                style={{ flex: 1, minWidth: 0 }}
              >
                <div>
                  <Text
                    size="10px"
                    style={{
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase' as const,
                      color: colors.text.secondary,
                    }}
                  >
                    {defaultAddress ? `Deliver to · ${defaultAddress.label}` : 'Delivering to'}
                  </Text>
                  <Group gap={6} mt={3} wrap="nowrap" style={{ minWidth: 0 }}>
                    <IconMapPin
                      size={13}
                      color={colors.primary}
                      stroke={2.2}
                    />
                    <Text
                      size="15px"
                      fw={typography.fontWeight.semibold}
                      style={{
                        color: colors.text.primary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {headerLine}
                    </Text>
                    <IconChevronDown
                      size={13}
                      color={colors.text.primary}
                      stroke={2}
                    />
                  </Group>
                </div>
              </UnstyledButton>

              <Group gap={8}>
                <IconButton
                  aria-label="Notifications"
                  variant="ghost"
                  size="md"
                  radius="full"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <IconBell size={17} color={colors.text.primary} stroke={1.8} />
                </IconButton>

                <IconButton
                  component={Link}
                  href="/cart"
                  aria-label="Cart"
                  variant="ghost"
                  size="md"
                  radius="full"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    position: 'relative',
                  }}
                >
                  <IconShoppingCart
                    size={17}
                    color={colors.text.primary}
                    stroke={1.8}
                  />
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        minWidth: 18,
                        height: 18,
                        padding: '0 5px',
                        borderRadius: 9,
                        background: colors.secondary,
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </IconButton>
              </Group>
            </Group>
          </Stack>
        </Box>

        {/* ── Search bar: 46px height ── */}
        <Box px={spacing.md} style={{ height: 46, display: 'flex', alignItems: 'center' }}>
          <UnstyledButton
            component={Link}
            href="/search"
            style={{
              width: '100%',
              display: 'block',
            }}
            aria-label="Search products"
          >
            <Box
              style={{
                padding: '8px 16px',
                borderRadius: 26,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              <IconSearch size={18} color={colors.text.secondary} stroke={1.8} />
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: colors.text.faint,
                }}
              >
                Search &quot;tomatoes&quot;, &quot;basil&quot;...
              </span>
              <IconMicrophone
                size={18}
                color={colors.primary}
                stroke={1.8}
              />
            </Box>
          </UnstyledButton>
        </Box>
      </Box>
    </Box>
  );
}
