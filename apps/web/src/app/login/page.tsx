'use client';

import React, { Suspense } from 'react';
import { Box, Alert } from '@mantine/core';
import { IconChevronLeft, IconLeaf } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors } from '../../theme';
import { authApi } from '../../lib/api/services';
import { getErrorMessage } from '../../lib/api-client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const [phone, setPhone] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isValid = phone.length === 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleContinue = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await authApi.requestOtp({ mobileNumber: phone });

      const otpForTesting = response.data.otp
        ? `&debugOtp=${encodeURIComponent(response.data.otp)}`
        : '';

      router.replace(
        `/account/verify?phone=${phone}${returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : ''}${otpForTesting}`
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
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
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconLeaf size={22} color={colors.text.inverse} />
          </div>
          <div
            style={{
              fontFamily:
                "var(--font-heading), 'Instrument Serif', Georgia, serif",
              fontSize: 28,
              letterSpacing: -0.5,
            }}
          >
            Cropzo
          </div>
        </div>

        {/* Heading */}
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 36,
            lineHeight: 1.05,
            letterSpacing: -0.6,
          }}
        >
          Welcome back
        </div>
        <div
          style={{
            fontSize: 14,
            color: colors.text.secondary,
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          Enter your phone number to continue. We&rsquo;ll send a 6-digit code
          to verify it&rsquo;s you.
        </div>

        {errorMessage && (
          <Alert color="red" radius="md" mt={20}>
            {errorMessage}
          </Alert>
        )}

        {/* Phone input */}
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: colors.text.secondary,
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            Phone Number
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 18px',
              borderRadius: 16,
              background: colors.surface,
              border: `1.5px solid ${isValid ? colors.primary : colors.border}`,
              transition: 'border-color 200ms ease',
            }}
          >
            <span style={{ fontSize: 22 }}>🇮🇳</span>
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: colors.text.primary,
              }}
            >
              +91
            </span>
            <div
              style={{
                width: 1,
                height: 24,
                background: colors.border,
                margin: '0 4px',
              }}
            />
            <input
              autoFocus
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={phone}
              onChange={handlePhoneChange}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 17,
                fontWeight: 600,
                color: colors.text.primary,
                fontFamily: 'inherit',
                letterSpacing: 1,
              }}
            />
          </div>
        </div>

        {/* Continue button */}
        <button
          disabled={!isValid || isSubmitting}
          onClick={handleContinue}
          style={{
            marginTop: 28,
            width: '100%',
            height: 54,
            borderRadius: 27,
            background:
              isValid && !isSubmitting ? colors.primary : colors.text.faint,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor:
              isValid && !isSubmitting ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            letterSpacing: 0.3,
          }}
        >
          {isSubmitting ? 'Sending OTP…' : 'CONTINUE'}
        </button>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 32,
            paddingBottom: 'calc(20px + var(--safe-area-bottom))',
            fontSize: 11,
            color: colors.text.faint,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          By continuing, you accept our{' '}
          <Link
            href="/terms"
            style={{
              fontWeight: 700,
              color: colors.text.primary,
              textDecoration: 'none',
            }}
          >
            Terms
          </Link>{' '}
          &amp;{' '}
          <Link
            href="/privacy"
            style={{
              fontWeight: 700,
              color: colors.text.primary,
              textDecoration: 'none',
            }}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
