'use client';

import React from 'react';
import { Drawer, Stack, TextInput, Button, Group, Box, ScrollArea } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { colors, spacing, typography, radius } from '../../theme';
import { Text } from '../ui';

interface LoginBottomSheetProps {
  opened: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export function LoginBottomSheet({ opened, onClose, returnUrl }: LoginBottomSheetProps) {
  const router = useRouter();
  const [phone, setPhone] = React.useState('');
  const isValid = phone.length === 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleContinue = () => {
    if (isValid) {
      onClose();
      const url = `/account/verify?phone=${phone}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
      router.push(url);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="55%"
      withCloseButton={false}
      styles={{
        content: {
          borderRadius: `${radius.xl} ${radius.xl} 0 0`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          padding: 0,
          flex: 1,
          overflow: 'hidden',
        }
      }}
    >
      <ScrollArea h="100%" type="scroll">
        <Box p={spacing.lg} pb={`calc(${spacing.xl} * 6)`}>
          <Stack gap={spacing.xl}>
            
            {/* Header */}
            <Stack gap={spacing.xs}>
              <Text size="xl" fw={typography.fontWeight.bold} style={{ textTransform: 'uppercase' }}>
                Login
              </Text>
              <Text variant="secondary" size="sm">
                Enter your phone number to proceed
              </Text>
            </Stack>

            {/* Input Section */}
            <Stack gap={spacing.xs}>
              <Text size="xs" variant="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phone Number
              </Text>
              <Group gap={spacing.xs} align="center" style={{ borderBottom: `2px solid ${colors.primary}`, paddingBottom: spacing.xs }}>
                <Group gap={4}>
                   {/* Flag placeholder - using emoji for simplicity as per screenshot */}
                  <Text size="lg">🇮🇳</Text>
                  <Text size="lg" fw={typography.fontWeight.bold}>+91</Text>
                </Group>
                <TextInput
                  variant="unstyled"
                  placeholder=""
                  type="tel"
                  autoFocus
                  value={phone}
                  onChange={handlePhoneChange}
                  styles={{
                    input: {
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      padding: 0,
                      height: 'auto',
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </Group>
            </Stack>

            {/* Continue Button */}
            <Button
              fullWidth
              size="lg"
              color={colors.primary}
              radius="md"
              disabled={!isValid}
              onClick={handleContinue}
              styles={{
                root: {
                  height: '50px',
                  backgroundColor: isValid ? colors.primary : '#FFCCB0', // Use theme primary when valid, light orange (or disabled color) when not
                  color: colors.text.inverse,
                },
                label: {
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                }
              }}
            >
              CONTINUE
            </Button>

            {/* Footer */}
            <Text variant="secondary" size="xs" style={{ textAlign: 'center' }}>
              By clicking, I accept the{' '}
              <Text span fw={typography.fontWeight.bold} inherit>Terms & Conditions</Text> &{' '}
              <Text span fw={typography.fontWeight.bold} inherit>Privacy Policy</Text>
            </Text>

          </Stack>
        </Box>
      </ScrollArea>
    </Drawer>
  );
}
