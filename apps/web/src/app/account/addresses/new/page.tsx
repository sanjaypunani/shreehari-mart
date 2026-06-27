'use client';

import React from 'react';
import { Box } from '@mantine/core';
import {
  IconChevronLeft,
  IconCheck,
  IconMapPin,
  IconSearch,
  IconCurrentLocation,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { colors } from '../../../../theme';
import { useAddressesStore } from '../../../../store';

const DEFAULT_AREA = 'Koramangala 5th Block';
const DEFAULT_FULL_ADDRESS =
  '80 Feet Road, Koramangala, Bengaluru 560095';

/**
 * Address pin-picker step. The map is a placeholder SVG — when a real map
 * provider is wired in, replace the <FakeMap /> body but keep the bottom
 * sheet, draft store wiring, and routing untouched.
 */
export default function AddressMapPage() {
  const router = useRouter();
  const setDraft = useAddressesStore((s) => s.setDraft);
  const draft = useAddressesStore((s) => s.draft);

  const [pin, setPin] = React.useState(draft?.pin || { x: 50, y: 52 });
  const [area, setArea] = React.useState(draft?.area || DEFAULT_AREA);
  const fullAddress = draft?.fullAddress || DEFAULT_FULL_ADDRESS;

  const handleMapTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleContinue = () => {
    setDraft({ pin, area, fullAddress });
    router.push('/account/addresses/new/details');
  };

  return (
    <Box
      style={{
        height: 'var(--app-viewport-height)',
        backgroundColor: colors.background,
        color: colors.text.primary,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Map placeholder */}
      <div
        onClick={handleMapTap}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'crosshair',
          background: `linear-gradient(135deg, ${colors.surfaceAlt} 0%, ${colors.background} 100%)`,
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.45,
          }}
        >
          <g stroke={colors.borderStrong} strokeWidth="0.3" fill="none">
            <path d="M0 20 L100 22" />
            <path d="M0 38 L100 42" />
            <path d="M0 58 L100 56" />
            <path d="M0 76 L100 78" />
            <path d="M18 0 L20 100" />
            <path d="M38 0 L42 100" />
            <path d="M62 0 L60 100" />
            <path d="M82 0 L80 100" />
          </g>
          <g fill={colors.primary} opacity="0.15">
            <rect x="22" y="24" width="14" height="12" rx="1" />
            <rect x="44" y="44" width="14" height="10" rx="1" />
            <rect x="66" y="60" width="12" height="14" rx="1" />
            <rect x="24" y="62" width="10" height="12" rx="1" />
            <rect x="64" y="24" width="14" height="14" rx="1" />
          </g>
          <g fill={colors.primarySoft} opacity="0.25">
            <circle cx="28" cy="80" r="5" />
            <circle cx="74" cy="30" r="4" />
          </g>
          <path
            d="M0 42 Q50 38 100 44"
            stroke={colors.secondary}
            strokeWidth="0.6"
            opacity="0.5"
            fill="none"
          />
        </svg>

        {/* Pin pulse */}
        <div
          style={{
            position: 'absolute',
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 44,
            height: 44,
            borderRadius: 22,
            background: colors.primary,
            opacity: 0.2,
            pointerEvents: 'none',
            animation: 'cropzoPulse 1.8s ease-in-out infinite',
          }}
        />

        {/* Pin */}
        <div
          style={{
            position: 'absolute',
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
          }}
        >
          <svg width="44" height="56" viewBox="0 0 44 56">
            <path
              d="M22 0 C10 0 0 10 0 22 C0 36 22 56 22 56 C22 56 44 36 44 22 C44 10 34 0 22 0 Z"
              fill={colors.primary}
            />
            <circle cx="22" cy="22" r="7" fill={colors.text.inverse} />
          </svg>
        </div>
      </div>

      {/* Top bar with search */}
      <div
        style={{
          padding: '12px 16px',
          paddingTop: 'calc(var(--safe-area-top) + 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          position: 'relative',
          zIndex: 2,
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
        <div
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 22,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <IconSearch size={17} color={colors.text.secondary} />
          <input
            placeholder="Search area, street, landmark…"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 13,
              fontFamily: 'inherit',
              color: colors.text.primary,
            }}
          />
        </div>
      </div>

      {/* Locate-me FAB */}
      <button
        onClick={() => setPin({ x: 50, y: 52 })}
        aria-label="Locate me"
        style={{
          position: 'absolute',
          right: 20,
          bottom: 280,
          zIndex: 2,
          width: 46,
          height: 46,
          borderRadius: 23,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
        }}
      >
        <IconCurrentLocation size={18} color={colors.primary} />
      </button>

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          background: colors.background,
          borderRadius: '24px 24px 0 0',
          padding: '18px 20px',
          paddingBottom: 'calc(20px + var(--safe-area-bottom))',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: colors.borderStrong,
            borderRadius: 2,
            margin: '0 auto 14px',
          }}
        />
        <div
          style={{
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.text.secondary,
            marginBottom: 6,
          }}
        >
          Delivering to
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <IconMapPin size={15} color={colors.text.inverse} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{area}</div>
            <div
              style={{
                fontSize: 12,
                color: colors.text.secondary,
                marginTop: 3,
                lineHeight: 1.4,
              }}
            >
              {fullAddress}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 10,
            borderRadius: 12,
            background: colors.secondarySoft,
            color: colors.secondary,
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <IconCheck size={14} color={colors.secondary} stroke={2.5} />
          We deliver here · Next-day slot available
        </div>

        <button
          onClick={handleContinue}
          style={{
            marginTop: 14,
            width: '100%',
            height: 54,
            borderRadius: 27,
            background: colors.primary,
            color: colors.text.inverse,
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 0.3,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Enter address details →
        </button>
      </div>

    </Box>
  );
}
