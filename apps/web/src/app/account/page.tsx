'use client';

import React, { useState } from 'react';
import { Box, Stack, Group, Button, Divider } from '@mantine/core';
import { IconDiscount2, IconMessage2, IconChevronRight, IconMapPin, IconArrowLeft } from '@tabler/icons-react';
import { colors, spacing, typography, radius } from '../../theme';
import { Text } from '../../components/ui';
import { LoginBottomSheet } from '../../components/auth/LoginBottomSheet';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';

export default function AccountPage() {
  const router = useRouter();
  const [loginOpen, { open: openLogin, close: closeLogin }] = useDisclosure(false);

  return (
    <Box pb={80} style={{ minHeight: '100vh', backgroundColor: colors.background }}>
      <LoginBottomSheet opened={loginOpen} onClose={closeLogin} returnUrl="/account" />
      
      {/* Branding Header */}
      <Box 
        bg={colors.primary} 
        p={spacing.xl} 
        style={{ 
          borderBottomLeftRadius: radius.xl, 
          borderBottomRightRadius: radius.xl,
          color: colors.text.inverse,
          position: 'relative'
        }}
      >
        <Box 
          onClick={() => router.back()} 
          style={{ 
            position: 'absolute', 
            top: spacing.md, 
            left: spacing.md, 
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <IconArrowLeft color="white" />
        </Box>

        <Stack align="center" gap={spacing.md} py={spacing.xl}>
          <Box
            style={{
              backgroundColor: colors.background,
              borderRadius: radius.xl,
              padding: spacing.sm,
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconMapPin size={32} color={colors.primary} stroke={2} />
          </Box>
          <Stack gap={spacing.xs} align="center">
            <Text
              size="lg"
              fw={typography.fontWeight.bold}
              style={{ color: 'inherit', textAlign: 'center' }}
            >
              One app for food, dining, groceries & more in minutes!
            </Text>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Stack gap={spacing.xl} p={spacing.md}>
        
        {/* Account Section */}
        <Stack gap={spacing.xs} mt={spacing.md}>
          <Text size="xl" fw={typography.fontWeight.bold}>
            Account
          </Text>
          <Text variant="secondary" size="sm">
            Login/Create Account to manage orders
          </Text>
        </Stack>

        {/* Login Button */}
        <Button
          fullWidth
          size="lg"
          color={colors.primary}
          radius="md"
          onClick={openLogin}
          styles={{
            root: {
              height: '50px',
              backgroundColor: colors.primary,
            },
            label: {
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
            }
          }}
        >
          LOGIN
        </Button>

        {/* Legal Text */}
        <Text variant="secondary" size="xs" style={{ textAlign: 'center' }}>
          By clicking in, I accept the{' '}
          <Text span td="underline" inherit>terms of service</Text> &{' '}
          <Text span td="underline" inherit>privacy policy</Text>
        </Text>

        {/* Menu Items */}
        <Stack gap={0} style={{ 
          border: `1px solid ${colors.border}`, 
          borderRadius: radius.lg,
          overflow: 'hidden'
        }}>
          <MenuItem 
            icon={<IconDiscount2 size={20} />} 
            label="Offers" 
            onClick={() => {}} 
          />
          <Divider color={colors.border} />
          <MenuItem 
            icon={<IconMessage2 size={20} />} 
            label="Feedback" 
            onClick={() => {}} 
          />
        </Stack>

        {/* Version Info */}
        <Box style={{ marginTop: 'auto', paddingBottom: spacing.xl }}>
          <Text variant="secondary" size="xs" style={{ textAlign: 'center' }}>
            App version 6.3.2(1)
          </Text>
        </Box>

      </Stack>
    </Box>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      style={{
        padding: spacing.md,
        cursor: 'pointer',
        backgroundColor: colors.surface,
      }}
    >
      <Group justify="space-between">
        <Group gap={spacing.sm}>
          <Box style={{ color: colors.text.primary }}>{icon}</Box>
          <Text size="md" fw={typography.fontWeight.medium}>{label}</Text>
        </Group>
        <IconChevronRight size={18} color={colors.text.secondary} />
      </Group>
    </Box>
  );
}
