'use client';

import React from 'react';
import {
  Box,
  Group,
  Text,
  Stack,
  Image,
  Button,
  Collapse,
  Badge,
  CloseButton,
  Paper,
  Select,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store';
import { colors, spacing, radius, shadow } from '../../theme';
import { calculateItemPrice } from '../../utils';

// Default quantity variants for weight-based products
const DEFAULT_WEIGHT_OPTIONS = [
  {
    value: '250gm',
    label: '250 gm',
    quantity: 250,
    unit: 'gm' as const,
  },
  {
    value: '500gm',
    label: '500 gm',
    quantity: 500,
    unit: 'gm' as const,
  },
  {
    value: '1kg',
    label: '1 kg',
    quantity: 1,
    unit: 'kg' as const,
  },
  {
    value: '2kg',
    label: '2 kg',
    quantity: 2,
    unit: 'kg' as const,
  },
];

// Default quantity variants for piece-based products
const DEFAULT_PIECE_OPTIONS = [
  {
    value: '1pc',
    label: '1 pc',
    quantity: 1,
    unit: 'pc' as const,
  },
  {
    value: '2pc',
    label: '2 pc',
    quantity: 2,
    unit: 'pc' as const,
  },
  {
    value: '3pc',
    label: '3 pc',
    quantity: 3,
    unit: 'pc' as const,
  },
  {
    value: '4pc',
    label: '4 pc',
    quantity: 4,
    unit: 'pc' as const,
  },
  {
    value: '5pc',
    label: '5 pc',
    quantity: 5,
    unit: 'pc' as const,
  },
];

export const CartBar = () => {
  const router = useRouter();
  const {
    items,
    totalItems,
    totalAmount,
    savings,
    isExpanded,
    toggleExpanded,
    updateVariant,
    removeItem,
  } = useCartStore();

  console.log('CartBar render - items:', items);

  // Don't show cart if empty
  if (items.length === 0) {
    return null;
  }

  // Format currency
  const formatPrice = (price: number) => `₹${Math.round(price)}`;

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        maxWidth: '100vw',
      }}
    >
      {/* Expanded Cart Items */}
      <Collapse in={isExpanded}>
        <Paper
          shadow="lg"
          style={{
            backgroundColor: '#ffffff',
            borderTopLeftRadius: radius.md,
            borderTopRightRadius: radius.md,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          <Stack gap={0}>
            {/* Header */}
            <Group
              justify="space-between"
              p={spacing.md}
              style={{
                borderBottom: `1px solid ${colors.border}`,
                position: 'sticky',
                top: 0,
                backgroundColor: '#ffffff',
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

            {/* Unavailable Items Section */}
            {items.some((item) => !item.isAvailable) && (
              <Box
                p={spacing.md}
                style={{
                  backgroundColor: '#fef2f2',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <Group justify="space-between" mb={spacing.sm}>
                  <Text size="sm" fw={600} c="#dc2626">
                    Currently unavailable
                  </Text>
                  <Button
                    variant="subtle"
                    size="xs"
                    c="#dc2626"
                    onClick={() => {
                      items
                        .filter((item) => !item.isAvailable)
                        .forEach((item) => removeItem(item.id));
                    }}
                  >
                    Remove all ×
                  </Button>
                </Group>

                {items
                  .filter((item) => !item.isAvailable)
                  .map((item) => (
                    <Group
                      key={item.id}
                      justify="space-between"
                      align="flex-start"
                      mb={spacing.sm}
                      p={spacing.sm}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: radius.sm,
                      }}
                    >
                      <Group gap={spacing.sm} style={{ flex: 1 }}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          w={40}
                          h={40}
                          radius={radius.sm}
                          fit="cover"
                        />
                        <Stack gap={2} style={{ flex: 1 }}>
                          <Text size="sm" fw={500} c={colors.text.secondary}>
                            {item.name}
                          </Text>
                          <Text size="xs" c={colors.text.secondary}>
                            {item.productQuantity}
                          </Text>
                        </Stack>
                      </Group>
                      <Badge color="red" size="sm" variant="light">
                        Sold out
                      </Badge>
                    </Group>
                  ))}
              </Box>
            )}

            {/* Available Items Section */}
            <Box p={spacing.md}>
              <Group justify="space-between" mb={spacing.md}>
                <Group gap={spacing.xs}>
                  <Text size="sm" fw={600} c={colors.text.primary}>
                    Delivery in
                  </Text>
                  <Text size="sm" fw={700} c={colors.text.primary}>
                    4 Mins
                  </Text>
                  <Badge color="green" size="sm" variant="light">
                    Superfast
                  </Badge>
                </Group>
                <Text size="sm" c={colors.text.secondary}>
                  {items.filter((item) => item.isAvailable).length} Items
                </Text>
              </Group>

              <Stack gap={spacing.md}>
                {items
                  .filter((item) => item.isAvailable)
                  .map((item) => {
                    // Use appropriate quantity options based on item unit
                    const quantityOptions =
                      item.baseUnit === 'pc'
                        ? DEFAULT_PIECE_OPTIONS
                        : DEFAULT_WEIGHT_OPTIONS;

                    // Find the current variant
                    const currentVariant =
                      quantityOptions.find(
                        (v) => v.value === item.selectedVariant
                      ) || quantityOptions[0];

                    return (
                      <Group
                        key={item.id}
                        justify="space-between"
                        align="flex-start"
                      >
                        <Group gap={spacing.sm} style={{ flex: 1 }}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            w={50}
                            h={50}
                            radius={radius.sm}
                            fit="cover"
                          />
                          <Stack gap={4} style={{ flex: 1 }}>
                            <Text size="sm" fw={500} c={colors.text.primary}>
                              {item.name}
                            </Text>
                            <Select
                              data={quantityOptions.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                              }))}
                              value={
                                item.selectedVariant ||
                                quantityOptions[0]?.value
                              }
                              onChange={(value) => {
                                if (value) {
                                  const selectedOption = quantityOptions.find(
                                    (opt) => opt.value === value
                                  );
                                  if (selectedOption) {
                                    // Calculate price on-demand
                                    const newPrice = calculateItemPrice(
                                      selectedOption.quantity,
                                      selectedOption.unit,
                                      item.basePrice,
                                      item.baseQuantity,
                                      item.baseUnit
                                    );

                                    updateVariant(
                                      item.id,
                                      selectedOption.value,
                                      selectedOption.label,
                                      newPrice,
                                      selectedOption.quantity,
                                      selectedOption.unit
                                    );
                                  }
                                }
                              }}
                              size="xs"
                              styles={{
                                input: {
                                  fontSize: '12px',
                                  padding: '4px 8px',
                                  height: '28px',
                                  minHeight: '28px',
                                },
                              }}
                            />
                          </Stack>
                        </Group>

                        <Group gap={spacing.xs} align="center">
                          <Text
                            size="sm"
                            fw={600}
                            c={colors.text.primary}
                            w={50}
                          >
                            {formatPrice(item.price)}
                          </Text>
                          <CloseButton
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                            style={{
                              color: colors.text.secondary,
                            }}
                          />
                        </Group>
                      </Group>
                    );
                  })}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Collapse>

      {/* Collapsed Cart Bar */}
      <Box
        style={{
          backgroundColor: colors.primary,
          padding: spacing.md,
          boxShadow: shadow.lg,
        }}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          {/* Left side - Product images and item info */}
          <Group
            gap={spacing.sm}
            onClick={toggleExpanded}
            style={{ cursor: 'pointer', flex: 1 }}
            wrap="nowrap"
          >
            {/* Product Images Stack */}
            <Box style={{ position: 'relative', width: 48, height: 48 }}>
              {items
                .filter((item) => item.isAvailable)
                .slice(0, 3)
                .map((item, index) => (
                  <Box
                    key={item.id}
                    style={{
                      position: 'absolute',
                      left: index * 12,
                      top: 0,
                      width: 40,
                      height: 40,
                      border: '2px solid #ffffff',
                      borderRadius: radius.sm,
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      zIndex: 3 - index,
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      w={40}
                      h={40}
                      fit="cover"
                      radius={0}
                    />
                  </Box>
                ))}
            </Box>

            {/* Item count and savings */}
            <Stack gap={2} style={{ flex: 1 }}>
              <Text size="sm" c="#ffffff" fw={600}>
                {totalItems} Items
              </Text>
              <Text size="xs" c="rgba(255, 255, 255, 0.9)">
                ₹{Math.round(savings)} saved, more coming up!
              </Text>
            </Stack>
          </Group>

          {/* Right side - Go to Cart button */}
          <Button
            variant="white"
            color={colors.primary}
            radius={radius.sm}
            size="md"
            fw={600}
            onClick={(e) => {
              e.stopPropagation();
              router.push('/cart');
            }}
            style={{
              flexShrink: 0,
            }}
          >
            Go to Cart
          </Button>
        </Group>
      </Box>
    </Box>
  );
};
