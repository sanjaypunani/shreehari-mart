'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { colors } from '../../theme';

const SPLASH_SEEN_KEY = 'cropzo:splash-seen';

export const SPLASH_IMAGE_URL =
  'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80';

export default function SplashPage() {
  const router = useRouter();

  const handleStart = () => {
    try {
      window.localStorage.setItem(SPLASH_SEEN_KEY, '1');
    } catch {
      // ignore — gate just runs again next time
    }
    router.push('/');
  };

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        background: colors.primary,
        color: colors.text.inverse,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '90px 28px 40px',
        paddingTop: 'calc(var(--safe-area-top) + 60px)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 24px)',
      }}
    >
      {/* Soft radial highlights */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.6) 0%, transparent 40%)',
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 20,
            fontStyle: 'italic',
            opacity: 0.9,
          }}
        >
          est. &apos;24
        </div>
        <div style={{ fontSize: 10, letterSpacing: 3, opacity: 0.6 }}>
          ◦ ◦ ◦
        </div>
      </div>

      {/* Center hero */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 92,
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: -3,
            textAlign: 'center',
          }}
        >
          Crop<span style={{ fontStyle: 'italic' }}>zo</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: 0.75,
            textAlign: 'center',
          }}
        >
          Farm · To · Door
        </div>
        <div
          style={{
            marginTop: 40,
            width: 210,
            height: 210,
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPLASH_IMAGE_URL}
            alt="Harvest"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ zIndex: 2 }}>
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 20,
            lineHeight: 1.25,
            textAlign: 'center',
            marginBottom: 24,
            opacity: 0.95,
            fontStyle: 'italic',
          }}
        >
          &ldquo;Harvested yesterday.
          <br />
          At your door tomorrow.&rdquo;
        </div>
        <button
          onClick={handleStart}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 27,
            background: colors.text.inverse,
            color: colors.primary,
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: -0.1,
            fontFamily: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Start shopping
          <IconChevronRight size={17} color={colors.primary} stroke={2} />
        </button>
        <div
          style={{
            textAlign: 'center',
            marginTop: 14,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            onClick={() => {
              try {
                window.localStorage.setItem(SPLASH_SEEN_KEY, '1');
              } catch {
                // noop
              }
            }}
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </Box>
  );
}
