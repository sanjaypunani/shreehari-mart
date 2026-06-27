'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, UnstyledButton } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store';
import { colors } from '../../theme';
import { triggerHaptic } from '../../utils';

interface CartFabProps {
  /** Whether the FAB should be visible (used by scroll auto-hide). */
  visible?: boolean;
  /** Extra bottom offset — typically the height of the bottom tab bar. */
  bottomOffset?: string;
}

export function CartFab({
  visible = true,
  bottomOffset = '0px',
}: CartFabProps) {
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems);
  const itemCount = useCartStore((s) => s.items.length);

  // Track previous totalItems to detect count changes for bump animation
  const prevTotalRef = useRef(totalItems);
  const [bumpKey, setBumpKey] = useState(0);

  // Track whether this is the very first appearance (0 → n)
  const [hasEntered, setHasEntered] = useState(itemCount > 0);
  const prevItemCountRef = useRef(itemCount);

  useEffect(() => {
    // First item added: trigger entry animation
    if (prevItemCountRef.current === 0 && itemCount > 0) {
      setHasEntered(false);
      // Force re-mount of animation by toggling
      requestAnimationFrame(() => setHasEntered(true));
    }
    if (itemCount === 0) {
      setHasEntered(false);
    }
    prevItemCountRef.current = itemCount;
  }, [itemCount]);

  useEffect(() => {
    // Count increased: trigger badge bump
    if (totalItems > prevTotalRef.current && prevTotalRef.current > 0) {
      setBumpKey((k) => k + 1);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  if (itemCount === 0) return null;

  const fabSize = 54;

  return (
    <Box
      hiddenFrom="sm"
      style={{
        position: 'fixed',
        right: 16,
        // Animate bottom position so FAB follows the tabs up/down
        bottom: visible
          ? `calc(${bottomOffset} + 4px + var(--safe-area-bottom))`
          : `calc(8px + var(--safe-area-bottom))`,
        zIndex: 95,
        transition: 'bottom 0.3s cubic-bezier(.4,0,.2,1)',
        // Entry animation
        ...(hasEntered
          ? {
              animation: 'cartFabEnter 0.4s cubic-bezier(.34,1.56,.64,1) forwards',
            }
          : {}),
      }}
    >
      <UnstyledButton
        onClick={() => {
          triggerHaptic('selection');
          router.push('/cart');
        }}
        aria-label={`View cart, ${totalItems} items`}
        style={{
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          background: colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: [
            '0 8px 24px rgba(28, 42, 33, 0.25)',
            '0 2px 8px rgba(28, 42, 33, 0.12)',
          ].join(', '),
          transition: 'transform 120ms ease',
        }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(0.9)';
        }}
        onPointerUp={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
        onPointerLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <IconShoppingCart size={22} color={colors.text.inverse} stroke={2} />

        {/* Count badge */}
        <span
          key={bumpKey}
          style={{
            position: 'absolute',
            top: -3,
            right: -3,
            minWidth: 20,
            height: 20,
            padding: '0 6px',
            borderRadius: 10,
            background: colors.secondary,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff',
            animation:
              bumpKey > 0
                ? 'cartBadgeBump 0.3s cubic-bezier(.34,1.56,.64,1)'
                : 'none',
          }}
        >
          {totalItems}
        </span>
      </UnstyledButton>
    </Box>
  );
}
