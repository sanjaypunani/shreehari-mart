'use client';

import React, { useState, Suspense } from 'react';
import { Box, Stack, Button, Center, ThemeIcon, PinInput } from '@mantine/core';
import { IconArrowLeft, IconDeviceMobile } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, spacing, typography, radius } from '../../../theme';
import { Text } from '../../../components/ui';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const returnUrl = searchParams.get('returnUrl');
  const [otp, setOtp] = useState('');
  
  const isOtpValid = otp.length === 6;

  const handleVerify = () => {
    if (isOtpValid) {
      console.log('Verify OTP', otp);
      // Proceed to returnUrl or home
      router.push(returnUrl ? decodeURIComponent(returnUrl) : '/');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: colors.background }} p={spacing.md}>
      <Stack gap={spacing.xl}>
        
        {/* Header */}
        <Stack gap={spacing.xs}>
          <Box onClick={handleBack} style={{ cursor: 'pointer', marginBottom: spacing.xs, width: 'fit-content' }}>
              <IconArrowLeft size={24} color={colors.text.primary} />
          </Box>
          
          <Text size="xl" fw={typography.fontWeight.bold} style={{ textTransform: 'uppercase' }}>
            Verify Details
          </Text>
          <Text variant="secondary" size="sm">
            OTP sent to +91-{phone}
          </Text>
        </Stack>

        {/* OTP Section */}
        <Stack gap={spacing.xl} align="center" mt={spacing.xl}>
            {/* Illustration */}
            <Box style={{ position: 'relative', height: '100px', width: '100%' }}>
              <Center>
                  <ThemeIcon size={80} radius="md" variant="light" color="gray">
                      <IconDeviceMobile size={50} />
                  </ThemeIcon>
              </Center>
            </Box>

            <Stack gap={spacing.md} w="100%">
              <Text size="xs" variant="secondary" style={{ textTransform: 'uppercase' }}>
                  Enter OTP
              </Text>
              <Center>
                  <PinInput 
                      length={6} 
                      type="number" 
                      size="md" 
                      gap="md"
                      value={otp}
                      onChange={setOtp}
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
                              }
                          }
                      }}
                  />
              </Center>
              <Text size="sm" variant="secondary">
                  Didn't receive the OTP? <Text span inherit style={{ cursor: 'pointer', color: colors.primary }}>Retry in 00:22</Text>
              </Text>
            </Stack>
        </Stack>

        {/* Action Button */}
        <Button
          fullWidth
          size="lg"
          color={colors.primary}
          radius="md"
          disabled={!isOtpValid}
          onClick={handleVerify}
          styles={{
            root: {
              height: '50px',
              backgroundColor: isOtpValid ? colors.primary : '#FFCCB0',
              color: colors.text.inverse,
            },
            label: {
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
            }
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
    <Suspense fallback={<Box p={spacing.md}><Text>Loading...</Text></Box>}>
      <VerifyContent />
    </Suspense>
  );
}
