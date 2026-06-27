'use client';

import React from 'react';
import {
  Box,
  Group,
  Text,
  Stack,
  Image,
  Collapse,
  CloseButton,
  Paper,
} from '@mantine/core';
import { IconChevronRight, IconShoppingCart, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store';
import { colors, spacing } from '../../theme';

interface CartBarProps {
  bottomOffset?: string;
  withSafeAreaInset?: boolean;
}

export const CartBar = ({
  bottomOffset = '0px',
  withSafeAreaInset = true,
}: CartBarProps) => {
  const router = useRouter();
  const {
    items,
    totalItems,
    isExpanded,
    toggleExpanded,
    removeLine,
    incrementLine,
    decrementLine,
  } = useCartStore();

  if (items.length === 0) return null;

  const formatPrice = (price: number) => `₹${Math.round(price)}`;
  const availableItems = items.filter((item) => item.isAvailable);
  const subtotal = availableItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: bottomOffset,
        left: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      {/* Expanded Cart Items */}
      <Collapse in={isExpanded}>
        <Paper
          shadow="lg"
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          <Stack gap={0}>
            <Group
              justify="space-between"
              p={spacing.md}
              style={{
                borderBottom: `1px solid ${colors.border}`,
                position: 'sticky',
                top: 0,
                backgroundColor: colors.surface,
                zIndex: 1,
              }}
            >
              <Text size="lg" fw={600} c={colors.text.primary}>
                Review Items
              </Text>
              <CloseButton
                onClick={toggleExpanded}
                size="md"
                icon={<IconX size={20} />}
              />
            </Group>

            <Box p={spacing.md}>
              <Stack gap={spacing.md}>
                {availableItems.map((item) => (
                  <Group
                    key={`${item.id}::${item.selectedVariant}`}
                    justify="space-between"
                    align="center"
                    wrap="nowrap"
                  >
                    <Group gap={spacing.sm} style={{ flex: 1, minWidth: 0 }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        w={50}
                        h={50}
                        radius={12}
                        fit="cover"
                      />
                      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          size="sm"
                          fw={600}
                          c={colors.text.primary}
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text size="xs" c={colors.text.secondary}>
                          {item.productQuantity} ·{' '}
                          {formatPrice(item.price)}
                        </Text>
                      </Stack>
                    </Group>

                    {/* Quantity stepper for this specific variant */}
                    <Group gap={spacing.xs} align="center" wrap="nowrap">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: colors.background,
                          border: `1px solid ${colors.primary}`,
                          borderRadius: 8,
                          height: 30,
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          onClick={() =>
                            decrementLine(item.id, item.selectedVariant)
                          }
                          style={{
                            width: 26,
                            height: '100%',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.primary,
                            fontSize: 16,
                            fontWeight: 700,
                            fontFamily: 'inherit',
                          }}
                        >
                          −
                        </button>
                        <div
                          style={{
                            minWidth: 18,
                            textAlign: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                            color: colors.primary,
                          }}
                        >
                          {item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            incrementLine(item.id, item.selectedVariant)
                          }
                          style={{
                            width: 26,
                            height: '100%',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.primary,
                            fontSize: 16,
                            fontWeight: 700,
                            fontFamily: 'inherit',
                          }}
                        >
                          +
                        </button>
                      </div>
                      <CloseButton
                        size="sm"
                        onClick={() =>
                          removeLine(item.id, item.selectedVariant)
                        }
                        aria-label="Remove item"
                        style={{ color: colors.text.secondary }}
                      />
                    </Group>
                  </Group>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Collapse>

      {/* Floating cart bar */}
      <Box
        style={{
          background: colors.primary,
          color: colors.text.inverse,
          borderRadius: 22,
          padding: '12px 16px',
          boxShadow: '0 14px 30px rgba(28,42,33,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          marginBottom: withSafeAreaInset ? 'var(--safe-area-bottom)' : 0,
        }}
        onClick={() => router.push('/cart')}
      >
        <Box
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <IconShoppingCart size={18} color={colors.text.inverse} />
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              borderRadius: 9,
              background: colors.secondary,
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {totalItems}
          </span>
        </Box>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            {totalItems} item{totalItems > 1 ? 's' : ''} ·{' '}
            {formatPrice(subtotal)}
          </div>
          <div
            style={{
              fontSize: 10,
              opacity: 0.8,
              letterSpacing: 0.4,
              marginTop: 1,
            }}
          >
            Next-day · 8am–12pm
          </div>
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          View basket
          <IconChevronRight size={14} color={colors.text.inverse} />
        </div>
      </Box>
    </Box>
  );
};
