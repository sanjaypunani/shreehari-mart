'use client';

import React from 'react';
import { Box } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconReceipt, IconChevronRight } from '@tabler/icons-react';
import { colors } from '../../theme';

const RING_SIZE = 140;
const CONFETTI_COUNT = 22;
const CONFETTI_COLORS = [
  colors.primary,
  colors.secondary,
  '#E9C46A',
  '#F4A261',
  colors.primarySoft,
];

const ANIMATION_KEYFRAMES = `
@keyframes cropzoRingIn {
  0% { transform: scale(0.2); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes cropzoPulse {
  0% { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(1.9); opacity: 0; }
}
@keyframes cropzoCheckDraw {
  0% { stroke-dashoffset: 60; }
  100% { stroke-dashoffset: 0; }
}
@keyframes cropzoFadeUp {
  0% { transform: translateY(14px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes cropzoConfetti {
  0% { transform: translate(0, 0) rotate(0); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) rotate(var(--tr)); opacity: 0; }
}
@keyframes cropzoTruck {
  0% { transform: translateX(-12px); }
  50% { transform: translateX(12px); }
  100% { transform: translateX(-12px); }
}
@keyframes cropzoBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
`;

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rot: number;
  delay: number;
  color: string;
  shape: number;
  size: number;
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const orderRef = orderId
    ? `#${orderId.slice(0, 8).toUpperCase()}`
    : '#CRP-NEW';
  const orderDetailsHref = orderId ? `/orders/${orderId}` : '/orders';

  // Phase: 0 = ring scale-in, 1 = check stroke + pulse rings, 2 = title/subtext fade-up,
  // 3 = card + confetti + truck appear, 4 = buttons settle
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 380),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const confetti = React.useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 280,
        y: -120 - Math.random() * 140,
        rot: Math.random() * 540 - 270,
        delay: Math.random() * 250,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape: i % 3,
        size: 6 + Math.random() * 8,
      })),
    []
  );

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        color: colors.text.primary,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 28px',
        paddingTop: 'calc(var(--safe-area-top) + 60px)',
        paddingBottom: 'calc(var(--safe-area-bottom) + 24px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{ANIMATION_KEYFRAMES}</style>

      {/* Confetti burst */}
      {phase >= 3 && (
        <div
          style={{
            position: 'absolute',
            top: '34%',
            left: '50%',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        >
          {confetti.map((c) => (
            <div
              key={c.id}
              style={
                {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: c.size,
                  height: c.shape === 1 ? c.size * 0.4 : c.size,
                  background: c.color,
                  borderRadius: c.shape === 2 ? '50%' : 2,
                  '--tx': `${c.x}px`,
                  '--ty': `${c.y}px`,
                  '--tr': `${c.rot}deg`,
                  animation: `cropzoConfetti 1.6s cubic-bezier(.2,.8,.4,1) ${c.delay}ms forwards`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Ring + check */}
        <div
          style={{
            position: 'relative',
            width: RING_SIZE,
            height: RING_SIZE,
            marginBottom: 28,
          }}
        >
          {phase >= 1 &&
            [0, 600].map((d) => (
              <div
                key={d}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `2px solid ${colors.primary}`,
                  animation: `cropzoPulse 1.6s ease-out ${d}ms infinite`,
                }}
              />
            ))}
          <div
            style={{
              width: RING_SIZE,
              height: RING_SIZE,
              borderRadius: '50%',
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 0 12px ${colors.secondarySoft}`,
              animation:
                'cropzoRingIn 0.55s cubic-bezier(.34,1.56,.64,1) forwards',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path
                d="M16 33 L28 44 L48 22"
                stroke={colors.text.inverse}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset="60"
                style={{
                  animation:
                    phase >= 1
                      ? 'cropzoCheckDraw 0.45s cubic-bezier(.6,.2,.2,1) 0.15s forwards'
                      : 'none',
                }}
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily:
              "var(--font-heading), 'Instrument Serif', Georgia, serif",
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: -0.6,
            opacity: phase >= 2 ? 1 : 0,
            animation:
              phase >= 2 ? 'cropzoFadeUp 0.5s ease-out forwards' : 'none',
          }}
        >
          Order placed{' '}
          <span style={{ fontStyle: 'italic' }}>with love</span>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 13,
            color: colors.text.secondary,
            marginTop: 12,
            lineHeight: 1.5,
            maxWidth: 280,
            opacity: phase >= 2 ? 1 : 0,
            animation:
              phase >= 2 ? 'cropzoFadeUp 0.5s ease-out 80ms backwards' : 'none',
          }}
        >
          Your farmers have been notified. They&rsquo;ll harvest at dawn and
          your basket arrives{' '}
          <b style={{ color: colors.text.primary }}>tomorrow 8am–12pm</b>.
        </div>

        {/* Truck delivery strip */}
        {phase >= 3 && (
          <div
            style={{
              marginTop: 26,
              width: '100%',
              height: 54,
              position: 'relative',
              opacity: 0,
              animation: 'cropzoFadeUp 0.5s ease-out forwards',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                borderTop: `2px dashed ${colors.borderStrong}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                animation: 'cropzoTruck 2.6s ease-in-out infinite',
              }}
            >
              <div
                style={{
                  animation: 'cropzoBob 0.6s ease-in-out infinite',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 38,
                    borderRadius: 8,
                    background: colors.surface,
                    border: `1.5px solid ${colors.text.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  🥬
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: 8,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: colors.text.primary,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    right: 8,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: colors.text.primary,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Order ref card */}
        <div
          onClick={() => router.push(orderDetailsHref)}
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 18,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            opacity: phase >= 3 ? 1 : 0,
            animation:
              phase >= 3
                ? 'cropzoFadeUp 0.5s ease-out 120ms backwards'
                : 'none',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: colors.surfaceAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconReceipt size={18} color={colors.text.primary} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: colors.text.secondary,
              }}
            >
              Order ref
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
              {orderRef}
            </div>
          </div>
          <IconChevronRight size={16} color={colors.text.faint} />
        </div>
      </div>

      {/* Bottom buttons */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <button
          onClick={() => router.replace('/')}
          style={{
            flex: 1,
            height: 54,
            borderRadius: 27,
            background: 'transparent',
            color: colors.text.primary,
            border: `1.5px solid ${colors.borderStrong}`,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Continue shopping
        </button>
        <button
          onClick={() => router.replace(orderDetailsHref)}
          style={{
            flex: 1,
            height: 54,
            borderRadius: 27,
            background: colors.primary,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Track order
        </button>
      </div>
    </Box>
  );
}

export default function OrderSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <Box
          style={{
            height: 'var(--app-viewport-height)',
            backgroundColor: colors.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      }
    >
      <OrderSuccessContent />
    </React.Suspense>
  );
}
