'use client';

import React from 'react';
import { Box, Group, Stack, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { IconMapPin, IconChevronDown, IconUser } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../theme';
import { Text, SearchInput, IconButton } from './ui';

export function MobileHeader() {
  return (
    <Box
      component="header"
      style={{
        backgroundColor: colors.background,
        // position: 'sticky',
        // top: 0,
        // zIndex: 100,
        boxShadow: shadow.sm,
      }}
    >
      <Stack gap={0}>
        {/* Top Section - Location and Profile */}
        <Group justify="space-between" px={spacing.md} py={spacing.sm}>
          {/* Location Selector */}
          <UnstyledButton
            style={{
              flex: 1,
            }}
            onClick={() => console.log('Location selector clicked')}
          >
            <Group gap={spacing.sm}>
              <Box
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: radius.md,
                  padding: spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '40px',
                  height: '40px',
                }}
              >
                <IconMapPin size={20} color={colors.text.inverse} stroke={2} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Group gap={4} wrap="nowrap">
                  <Text
                    size="sm"
                    fw={typography.fontWeight.semibold}
                    style={{
                      color: colors.primary,
                      lineHeight: typography.lineHeight.tight,
                    }}
                  >
                    Add your location
                  </Text>
                  <IconChevronDown
                    size={16}
                    color={colors.primary}
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
                  To see items in your area
                </Text>
              </Box>
            </Group>
          </UnstyledButton>

          {/* Profile Icon */}
          <IconButton
            component={Link}
            href="/account"
            variant="ghost"
            size="lg"
            radius="xl"
            style={{
              backgroundColor: colors.text.secondary,
              width: '40px',
              height: '40px',
            }}
          >
            <IconUser size={22} color={colors.text.inverse} stroke={2} />
          </IconButton>
        </Group>

        {/* Search Section */}
        <Box px={spacing.md} py={spacing.sm}>
          <SearchInput placeholder='Search for "Grapes"' size="md" />
        </Box>
      </Stack>
    </Box>
  );
}
