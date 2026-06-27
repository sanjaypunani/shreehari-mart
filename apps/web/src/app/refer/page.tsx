'use client';

import React from 'react';
import { Box } from '@mantine/core';
import {
  IconChevronLeft,
  IconShare,
  IconCopy,
  IconCheck,
  IconBrandWhatsapp,
  IconMail,
  IconMessage,
  IconGift,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../theme';

const REFERRALS = [
  { name: 'Aanya M.', joined: '2 days ago', earned: 100, status: 'completed' },
  { name: 'Rohan K.', joined: '5 days ago', earned: 100, status: 'completed' },
  { name: 'Priya S.', joined: '1 week ago', earned: 0, status: 'pending' },
];

const STEPS = [
  { n: 1, t: 'Share your code', d: 'Send to friends via WhatsApp, SMS, or email' },
  { n: 2, t: 'They sign up', d: 'Friend uses your code on their first order' },
  { n: 3, t: 'You both earn', d: 'Get ₹100 each after their first delivery' },
];

export default function ReferPage() {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const code = 'JUNO100';

  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalEarned = REFERRALS.filter((r) => r.status === 'completed').length * 100;

  return (
    <Box
      style={{
        minHeight: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        color: colors.text.primary,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: colors.background,
        }}
      >
        <button
          onClick={() => router.back()}
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
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Refer & Earn
        </div>
        <button
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
          <IconShare size={17} color={colors.text.primary} />
        </button>
      </div>

      <div style={{ padding: '10px 20px 60px' }}>
        {/* Hero */}
        <div
          style={{
            padding: 24,
            borderRadius: 24,
            background: colors.primary,
            color: colors.text.inverse,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <IconGift size={32} color={colors.text.inverse} />
          </div>
          <div
            style={{
              fontFamily:
                "var(--font-heading), 'Instrument Serif', Georgia, serif",
              fontSize: 32,
              lineHeight: 1.05,
              letterSpacing: -0.5,
            }}
          >
            Give ₹100, get <span style={{ fontStyle: 'italic' }}>₹100</span>
          </div>
          <div
            style={{
              fontSize: 13,
              marginTop: 10,
              opacity: 0.9,
              maxWidth: 280,
              margin: '10px auto 0',
              lineHeight: 1.5,
            }}
          >
            Invite friends to Cropzo. They get ₹100 off their first order, you
            get ₹100 in your wallet.
          </div>
          <div
            style={{
              position: 'absolute',
              right: -40,
              bottom: -40,
              width: 140,
              height: 140,
              borderRadius: 70,
              background: 'rgba(255,255,255,0.08)',
            }}
          />
        </div>

        {/* Code copy */}
        <SectionLabel>Your referral code</SectionLabel>
        <div
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: 18,
            background: colors.surface,
            border: `2px dashed ${colors.primary}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              flex: 1,
              fontFamily:
                "var(--font-heading), 'Instrument Serif', Georgia, serif",
              fontSize: 28,
              letterSpacing: 2,
              color: colors.primary,
            }}
          >
            {code}
          </div>
          <button
            onClick={handleCopy}
            style={{
              padding: '10px 16px',
              borderRadius: 20,
              background: colors.primary,
              color: colors.text.inverse,
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>

        {/* Share buttons */}
        <SectionLabel style={{ marginTop: 24 }}>Share via</SectionLabel>
        <div
          style={{
            marginTop: 8,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}
        >
          {[
            { Icon: IconBrandWhatsapp, label: 'WhatsApp' },
            { Icon: IconMessage, label: 'SMS' },
            { Icon: IconMail, label: 'Email' },
          ].map((s) => (
            <button
              key={s.label}
              style={{
                padding: 14,
                borderRadius: 16,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <s.Icon size={22} color={colors.primary} />
              <div style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* Earnings */}
        <div
          style={{
            marginTop: 24,
            padding: 18,
            borderRadius: 20,
            background: colors.secondarySoft,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: colors.secondary,
                fontWeight: 700,
              }}
            >
              Earned so far
            </div>
            <div
              style={{
                fontFamily:
                  "var(--font-heading), 'Instrument Serif', Georgia, serif",
                fontSize: 36,
                lineHeight: 1.05,
                color: colors.secondary,
                marginTop: 4,
              }}
            >
              ₹{totalEarned}
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.text.secondary,
                marginTop: 4,
              }}
            >
              From {REFERRALS.filter((r) => r.status === 'completed').length}{' '}
              successful referrals
            </div>
          </div>
        </div>

        {/* How it works */}
        <SectionLabel style={{ marginTop: 24 }}>How it works</SectionLabel>
        <div
          style={{
            marginTop: 12,
            position: 'relative',
            paddingLeft: 8,
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              style={{
                position: 'relative',
                paddingLeft: 40,
                paddingBottom: i < STEPS.length - 1 ? 18 : 0,
              }}
            >
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 13,
                    top: 28,
                    bottom: 0,
                    width: 1,
                    background: colors.border,
                  }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: colors.primary,
                  color: colors.text.inverse,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {step.n}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                {step.t}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                {step.d}
              </div>
            </div>
          ))}
        </div>

        {/* Referrals list */}
        <SectionLabel style={{ marginTop: 24 }}>Your referrals</SectionLabel>
        <div
          style={{
            marginTop: 8,
            background: colors.surface,
            borderRadius: 18,
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
          }}
        >
          {REFERRALS.map((r, i) => (
            <div
              key={r.name}
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom:
                  i < REFERRALS.length - 1
                    ? `1px solid ${colors.border}`
                    : 'none',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: colors.surfaceAlt,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: colors.text.primary,
                }}
              >
                {r.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: colors.text.secondary,
                  }}
                >
                  {r.joined}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background:
                    r.status === 'completed'
                      ? colors.secondarySoft
                      : colors.surfaceAlt,
                  color:
                    r.status === 'completed'
                      ? colors.secondary
                      : colors.text.secondary,
                  letterSpacing: 0.3,
                }}
              >
                {r.status === 'completed' ? `+₹${r.earned}` : 'Pending'}
              </div>
            </div>
          ))}
        </div>

        {/* T&C */}
        <div
          style={{
            marginTop: 18,
            fontSize: 11,
            color: colors.text.faint,
            lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          Rewards credited within 24 hours of friend&apos;s first delivery.
          <br />
          Maximum 50 referrals per user. Terms apply.
        </div>
      </div>
    </Box>
  );
}

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: colors.text.secondary,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
