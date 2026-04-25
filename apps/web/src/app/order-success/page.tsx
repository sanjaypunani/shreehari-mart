'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Group, Stack } from '@mantine/core';
import { IconShoppingBag, IconReceiptRupee } from '@tabler/icons-react';
import { colors, radius, spacing, typography } from '../../theme';
import { Text } from '../../components/ui';
import styles from './page.module.css';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
}).format(amount);

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const items = Number(searchParams.get('items') || 0);
  const amount = Number(searchParams.get('amount') || 0);
  const hasAmount = Number.isFinite(amount) && amount > 0;
  const hasItems = Number.isFinite(items) && items > 0;
  const orderDetailsHref = orderId ? `/account/orders/${orderId}` : '/account/orders';

  return (
    <Box className={styles.page}>
      <Box className={styles.card}>
        <div className={styles.iconWrap}>
          <span className={styles.ring} />
          <span className={styles.ring} />
          <div className={styles.checkCircle}>
            <svg className={styles.checkSvg} viewBox="0 0 32 32" aria-hidden>
              <path className={styles.checkPath} d="M7 16.7l6.2 6.1L25.5 10.4" />
            </svg>
          </div>
        </div>

        <Stack className={styles.content} gap={spacing.md} mt={spacing.md}>
          <Stack gap={4} align="center">
            <Text
              style={{
                fontSize: '29px',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                textAlign: 'center',
                fontWeight: typography.fontWeight.bold,
              }}
            >
              Order Placed Successfully
            </Text>
            <Text variant="secondary" size="sm" ta="center">
              Your order is confirmed and our team has started preparing it.
            </Text>
          </Stack>

          {(hasAmount || hasItems || orderId) && (
            <Box className={styles.meta}>
              <Stack gap={6}>
                {orderId && (
                  <Text size="sm" fw={typography.fontWeight.semibold}>
                    Order #{orderId.slice(0, 8).toUpperCase()}
                  </Text>
                )}
                <Group justify="space-between">
                  <Text size="sm" variant="secondary">
                    Items
                  </Text>
                  <Text size="sm" fw={typography.fontWeight.semibold}>
                    {hasItems ? items : '-'}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" variant="secondary">
                    Total Paid
                  </Text>
                  <Text size="sm" fw={typography.fontWeight.bold}>
                    {hasAmount ? formatCurrency(amount) : '-'}
                  </Text>
                </Group>
              </Stack>
            </Box>
          )}

          <Stack gap={spacing.xs}>
            <Button
              component={Link}
              href={orderDetailsHref}
              leftSection={<IconReceiptRupee size={18} />}
              style={{
                minHeight: 'var(--touch-target-size)',
                borderRadius: radius.full,
                fontWeight: typography.fontWeight.bold,
                backgroundColor: colors.primary,
              }}
            >
              Order Details
            </Button>

            <Button
              component={Link}
              href="/account/orders"
              variant="default"
              leftSection={<IconShoppingBag size={18} />}
              style={{
                minHeight: 'var(--touch-target-size)',
                borderRadius: radius.full,
                fontWeight: typography.fontWeight.semibold,
                borderColor: colors.border,
                color: colors.text.primary,
              }}
            >
              View All Orders
            </Button>

            <Button
              component={Link}
              href="/"
              variant="subtle"
              style={{
                minHeight: 'var(--touch-target-size)',
                borderRadius: radius.full,
                fontWeight: typography.fontWeight.semibold,
                color: colors.primary,
              }}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default function OrderSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <Box className={styles.page}>
          <Box className={styles.card}>
            <Text size="lg" fw={typography.fontWeight.bold} ta="center">
              Loading your order confirmation...
            </Text>
          </Box>
        </Box>
      }
    >
      <OrderSuccessContent />
    </React.Suspense>
  );
}
