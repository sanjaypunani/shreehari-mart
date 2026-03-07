'use client';

import React from 'react';
import {
  Drawer,
  Stack,
  TextInput,
  Button,
  Group,
  Box,
  ScrollArea,
  Alert,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { colors, spacing, typography, radius } from '../../theme';
import { Text } from '../ui';
import { authApi } from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';

interface LoginBottomSheetProps {
  opened: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export function LoginBottomSheet({
  opened,
  onClose,
  returnUrl,
}: LoginBottomSheetProps) {
  const router = useRouter();
  const [phone, setPhone] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isValid = phone.length === 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleContinue = async () => {
    if (!isValid || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await authApi.requestOtp({
        mobileNumber: phone,
      });

      const otpForTesting = response.data.otp
        ? `&debugOtp=${encodeURIComponent(response.data.otp)}`
        : '';

      onClose();

      const url = `/account/verify?phone=${phone}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}${otpForTesting}`;
      router.push(url);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
          bottom: 'var(--keyboard-inset-height)',
          maxHeight: 'calc(var(--app-viewport-height) - var(--safe-area-top))',
        },
        body: {
          padding: 0,
          flex: 1,
          overflow: 'hidden',
          paddingBottom: 'var(--safe-area-bottom-with-keyboard)',
        },
      }}
    >
      <ScrollArea h="100%" type="scroll">
        <Box
          p={spacing.lg}
          pb={`calc(${spacing.xl} + var(--safe-area-bottom-with-keyboard))`}
        >
          <Stack gap={spacing.xl}>
            <Stack gap={spacing.xs}>
              <Text
                size="xl"
                fw={typography.fontWeight.bold}
                style={{ textTransform: 'uppercase' }}
              >
                Login
              </Text>
              <Text variant="secondary" size="sm">
                Enter your phone number to proceed
              </Text>
            </Stack>

            {errorMessage && (
              <Alert color="red" radius="md">
                {errorMessage}
              </Alert>
            )}

            <Stack gap={spacing.xs}>
              <Text
                size="xs"
                variant="secondary"
                style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Phone Number
              </Text>
              <Group
                gap={spacing.xs}
                align="center"
                style={{
                  borderBottom: `2px solid ${colors.primary}`,
                  paddingBottom: spacing.xs,
                }}
              >
                <Group gap={4}>
                  <Text size="lg">🇮🇳</Text>
                  <Text size="lg" fw={typography.fontWeight.bold}>
                    +91
                  </Text>
                </Group>
                <TextInput
                  variant="unstyled"
                  placeholder=""
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                  value={phone}
                  onChange={handlePhoneChange}
                  styles={{
                    input: {
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      padding: 0,
                      height: 'auto',
                    },
                  }}
                  style={{ flex: 1 }}
                />
              </Group>
            </Stack>

            <Button
              fullWidth
              size="lg"
              color={colors.primary}
              radius="md"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              onClick={handleContinue}
              styles={{
                root: {
                  height: '50px',
                  backgroundColor:
                    isValid && !isSubmitting ? colors.primary : '#FFCCB0',
                  color: colors.text.inverse,
                },
                label: {
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                },
              }}
            >
              CONTINUE
            </Button>

            <Text variant="secondary" size="xs" style={{ textAlign: 'center' }}>
              By clicking, I accept the{' '}
              <Text span fw={typography.fontWeight.bold} inherit>
                Terms & Conditions
              </Text>{' '}
              &{' '}
              <Text span fw={typography.fontWeight.bold} inherit>
                Privacy Policy
              </Text>
            </Text>
          </Stack>
        </Box>
      </ScrollArea>
    </Drawer>
  );
}
