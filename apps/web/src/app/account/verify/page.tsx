'use client';

import React, { useState, Suspense } from 'react';
import {
  Box,
  Stack,
  Button,
  Center,
  ThemeIcon,
  PinInput,
  Alert,
} from '@mantine/core';
import { IconArrowLeft, IconDeviceMobile } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, spacing, typography } from '../../../theme';
import { Text } from '../../../components/ui';
import { authApi } from '../../../lib/api/services';
import { getErrorMessage } from '../../../lib/api-client';
import { useAppStore } from '../../../store/app-store';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAppStore((state) => state.login);

  const phone = searchParams.get('phone') || '';
  const returnUrl = searchParams.get('returnUrl');
  const debugOtp = searchParams.get('debugOtp');

  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const isOtpValid = otp.length === 6;

  const handleVerify = async () => {
    if (!isOtpValid || isVerifying) {
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage(null);

      const response = await authApi.verifyOtp({
        mobileNumber: phone,
        otp,
      });

      const authenticatedUser = response.data.user;

      login(
        {
          id: authenticatedUser.id,
          name:
            authenticatedUser.name ||
            `+91-${authenticatedUser.mobileNumber}`,
          email: authenticatedUser.email,
          mobileNumber: authenticatedUser.mobileNumber,
          customerId: authenticatedUser.customerId,
          role:
            authenticatedUser.role === 'admin' ||
            authenticatedUser.role === 'staff'
              ? authenticatedUser.role
              : 'customer',
        },
        response.data.token
      );

      if (response.data.requiresSignup) {
        router.push(
          `/account/signup?phone=${phone}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`
        );
        return;
      }

      router.push(returnUrl ? decodeURIComponent(returnUrl) : '/account');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleResend = async () => {
    if (!phone || isResending) {
      return;
    }

    try {
      setIsResending(true);
      setErrorMessage(null);
      await authApi.requestOtp({ mobileNumber: phone });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box
      px={spacing.md}
      style={{
        minHeight: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        paddingTop: spacing.md,
        paddingBottom: `calc(${spacing.md} + var(--safe-area-bottom-with-keyboard))`,
        scrollPaddingBottom: 'calc(120px + var(--safe-area-bottom-with-keyboard))',
      }}
    >
      <Stack gap={spacing.xl}>
        <Stack gap={spacing.xs}>
          <Box
            onClick={handleBack}
            style={{
              cursor: 'pointer',
              marginBottom: spacing.xs,
              width: 'fit-content',
            }}
          >
            <IconArrowLeft size={24} color={colors.text.primary} />
          </Box>

          <Text
            size="xl"
            fw={typography.fontWeight.bold}
            style={{ textTransform: 'uppercase' }}
          >
            Verify Details
          </Text>
          <Text variant="secondary" size="sm">
            OTP sent to +91-{phone}
          </Text>
        </Stack>

        {debugOtp && (
          <Alert color="orange" radius="md">
            Testing OTP: {debugOtp}
          </Alert>
        )}

        {errorMessage && (
          <Alert color="red" radius="md">
            {errorMessage}
          </Alert>
        )}

        <Stack gap={spacing.xl} align="center" mt={spacing.xl}>
          <Box style={{ position: 'relative', height: '100px', width: '100%' }}>
            <Center>
              <ThemeIcon size={80} radius="md" variant="light" color="gray">
                <IconDeviceMobile size={50} />
              </ThemeIcon>
            </Center>
          </Box>

          <Stack gap={spacing.md} w="100%">
            <Text
              size="xs"
              variant="secondary"
              style={{ textTransform: 'uppercase' }}
            >
              Enter OTP
            </Text>
            <Center>
              <PinInput
                length={6}
                type="number"
                size="md"
                gap="md"
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                }}
                autoFocus
                styles={{
                  input: {
                    border: 'none',
                    borderBottom: `2px solid ${colors.primary}`,
                    borderRadius: 0,
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.primary,
                    backgroundColor: 'transparent',
                    '&:focus': {
                      borderColor: colors.primary,
                    },
                  },
                }}
              />
            </Center>
            <Text size="sm" variant="secondary">
              Didn't receive the OTP?{' '}
              <span
                style={{
                  cursor: isResending ? 'default' : 'pointer',
                  color: colors.primary,
                  pointerEvents: isResending ? 'none' : 'auto',
                }}
                onClick={handleResend}
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </span>
            </Text>
          </Stack>
        </Stack>

        <Button
          fullWidth
          size="lg"
          color={colors.primary}
          radius="md"
          disabled={!isOtpValid || isVerifying}
          loading={isVerifying}
          onClick={handleVerify}
          styles={{
            root: {
              height: '50px',
              backgroundColor: isOtpValid && !isVerifying ? colors.primary : '#FFCCB0',
              color: colors.text.inverse,
            },
            label: {
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
            },
          }}
        >
          VERIFY AND PROCEED
        </Button>
      </Stack>
    </Box>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <Box p={spacing.md}>
          <Text>Loading...</Text>
        </Box>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
