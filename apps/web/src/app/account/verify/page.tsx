'use client';

import React, { useState, Suspense } from 'react';
import { Box, Alert, PinInput } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors } from '../../../theme';
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
  const [secondsLeft, setSecondsLeft] = useState(30);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000
    );
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  const isOtpValid = otp.length === 6;

  const handleVerify = async (otpValue?: string) => {
    const otpToVerify = otpValue ?? otp;
    if (otpToVerify.length !== 6 || isVerifying) return;

    try {
      setIsVerifying(true);
      setErrorMessage(null);

      const response = await authApi.verifyOtp({
        mobileNumber: phone,
        otp: otpToVerify,
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
        router.replace(
          `/account/signup?phone=${phone}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}`
        );
        return;
      }

      router.replace(returnUrl ? decodeURIComponent(returnUrl) : '/account');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!phone || isResending || secondsLeft > 0) return;

    try {
      setIsResending(true);
      setErrorMessage(null);
      await authApi.requestOtp({ mobileNumber: phone });
      setSecondsLeft(30);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        color: colors.text.primary,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconChevronLeft size={18} color={colors.text.primary} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          padding: '20px 24px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 36,
            lineHeight: 1.05,
            letterSpacing: -0.6,
          }}
        >
          Enter the code
        </div>
        <div
          style={{
            fontSize: 14,
            color: colors.text.secondary,
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          We&rsquo;ve sent a 6-digit code to{' '}
          <b style={{ color: colors.text.primary }}>+91 {phone}</b>.{' '}
          <span
            onClick={() => router.back()}
            style={{
              color: colors.primary,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Wrong number?
          </span>
        </div>

        {debugOtp && (
          <Alert color="orange" radius="md" mt={20}>
            Testing OTP: <b>{debugOtp}</b>
          </Alert>
        )}

        {errorMessage && (
          <Alert color="red" radius="md" mt={20}>
            {errorMessage}
          </Alert>
        )}

        {/* OTP input */}
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: colors.text.secondary,
              marginBottom: 12,
              paddingLeft: 4,
            }}
          >
            6-digit OTP
          </div>
          <PinInput
            length={6}
            type="number"
            size="lg"
            gap="xs"
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (errorMessage) setErrorMessage(null);
            }}
            onComplete={(value) => handleVerify(value)}
            autoFocus
            styles={{
              root: {
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
                width: '100%',
              },
              input: {
                flex: 1,
                height: 56,
                fontSize: 22,
                fontWeight: 700,
                color: colors.text.primary,
                background: colors.surface,
                border: `1.5px solid ${colors.border}`,
                borderRadius: 14,
                textAlign: 'center',
              },
            }}
          />
        </div>

        {/* Resend */}
        <div
          style={{
            marginTop: 20,
            fontSize: 13,
            color: colors.text.secondary,
            textAlign: 'center',
          }}
        >
          {secondsLeft > 0 ? (
            <>
              Resend code in <b style={{ color: colors.text.primary }}>
                {String(Math.floor(secondsLeft / 60)).padStart(1, '0')}:
                {String(secondsLeft % 60).padStart(2, '0')}
              </b>
            </>
          ) : (
            <span
              onClick={handleResend}
              style={{
                color: colors.primary,
                fontWeight: 700,
                cursor: isResending ? 'default' : 'pointer',
                opacity: isResending ? 0.6 : 1,
              }}
            >
              {isResending ? 'Resending…' : 'Resend OTP'}
            </span>
          )}
        </div>

        {/* Verify button */}
        <button
          disabled={!isOtpValid || isVerifying}
          onClick={() => handleVerify()}
          style={{
            marginTop: 28,
            width: '100%',
            height: 54,
            borderRadius: 27,
            background:
              isOtpValid && !isVerifying ? colors.primary : colors.text.faint,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor:
              isOtpValid && !isVerifying ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            letterSpacing: 0.3,
          }}
        >
          {isVerifying ? 'Verifying…' : 'VERIFY & CONTINUE'}
        </button>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 32,
            paddingBottom: 'calc(20px + var(--safe-area-bottom))',
          }}
        />
      </div>
    </Box>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
