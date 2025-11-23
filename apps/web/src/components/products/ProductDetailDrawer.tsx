'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Stack,
  Group,
  ActionIcon,
  Badge,
  Select,
} from '@mantine/core';
import { IconX, IconChevronDown } from '@tabler/icons-react';
import { colors, spacing, radius, shadow, typography } from '../../theme';
import { Text, Image, Button } from '../ui';
import { useCartStore } from '../../store';
import { calculateItemPrice } from '../../utils';

export interface ProductDetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    image: string;
    price: number; // Base price from API
    baseQuantity: number; // Base quantity from API (e.g., 250)
    unit: 'gm' | 'kg' | 'pc'; // Unit from API
    discount?: number;
    quantity: string; // Display string (e.g., "250gm")
    deliveryTime?: string;
    variants?: Array<{
      value: string;
      label: string;
      price?: number; // Optional, calculated on-demand if not provided
      quantity: number;
      unit?: 'gm' | 'kg' | 'pc';
    }>;
  };
}

export function ProductDetailDrawer({
  opened,
  onClose,
  product,
}: ProductDetailDrawerProps) {
  console.log('ProductDetailDrawer render - product:', product);
  // Hooks must be called before any conditional returns
  const addItem = useCartStore((state) => state.addItem);

  // Generate quantity variants based on product unit
  // Prices are calculated on-demand, not stored in variants
  const quantityOptions = React.useMemo(() => {
    if (!product) return [];

    // If custom variants exist, use them
    if (product.variants && product.variants.length > 0) {
      return product.variants;
    }

    // For pieces, generate 1pc to 5pc
    if (product.unit === 'pc') {
      return [
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
    }

    // For gm/kg units: 250gm, 500gm, 1kg, 2kg
    return [
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
  }, [product]);

  const [selectedVariant, setSelectedVariant] = React.useState('');

  // Update selected variant when product or quantityOptions change
  React.useEffect(() => {
    if (quantityOptions.length > 0 && !selectedVariant) {
      setSelectedVariant(quantityOptions[0].value);
    }
  }, [quantityOptions, selectedVariant]);

  const currentVariant = React.useMemo(() => {
    return (
      quantityOptions.find((v) => v.value === selectedVariant) ||
      quantityOptions[0]
    );
  }, [quantityOptions, selectedVariant]);

  // Calculate price on-demand for current variant
  const currentPrice = React.useMemo(() => {
    if (!product || !currentVariant) return 0;

    // If variant has pre-calculated price, use it
    if (currentVariant.price !== undefined) {
      return currentVariant.price;
    }

    // Otherwise, calculate on-demand using backend logic
    const variantUnit = currentVariant.unit || product.unit;
    return calculateItemPrice(
      currentVariant.quantity,
      variantUnit,
      product.price,
      product.baseQuantity,
      product.unit
    );
  }, [product, currentVariant]);

  // Now we can safely return null after all hooks
  if (!product) return null;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size={160}
      withCloseButton={false}
      zIndex={1100}
      styles={{
        body: {
          padding: 0,
          height: '160px',
        },
        content: {
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
        },
      }}
    >
      <Box
        style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          height: '160px',
          padding: spacing.lg,
          position: 'relative',
        }}
      >
        {/* Close Button - Top Right */}
        <ActionIcon
          size="sm"
          radius="50%"
          variant="subtle"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            color: colors.text.secondary,
            zIndex: 10,
          }}
        >
          <IconX size={16} />
        </ActionIcon>

        {/* Horizontal Layout */}
        <Group
          gap={spacing.md}
          align="flex-start"
          wrap="nowrap"
          style={{ height: '100%' }}
        >
          {/* Product Image - Left Side */}
          <Box
            style={{
              width: '100px',
              height: '100px',
              flexShrink: 0,
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              border: `1px solid ${colors.border}`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Discount Badge */}
            {product.discount && (
              <Box
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  zIndex: 10,
                }}
              >
                <Badge
                  size="sm"
                  style={{
                    backgroundColor: colors.success,
                    color: colors.text.inverse,
                    fontWeight: typography.fontWeight.bold,
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: radius.sm,
                  }}
                >
                  {product.discount}% OFF
                </Badge>
              </Box>
            )}

            <Image
              src={product.image}
              alt={product.name}
              width="100%"
              height="100%"
              fit="contain"
              radius={0}
              withPlaceholder
            />
          </Box>

          {/* Product Details - Middle */}
          <Stack
            gap={spacing.xs}
            style={{ flex: 1, justifyContent: 'space-between' }}
          >
            {/* Product Name */}
            <Text
              size="md"
              fw={typography.fontWeight.bold}
              variant="primary"
              style={{
                fontSize: '14px',
                lineHeight: typography.lineHeight.tight,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.name}
            </Text>

            {/* Quantity */}
            <Text
              size="sm"
              variant="secondary"
              style={{
                fontWeight: typography.fontWeight.medium,
                fontSize: '12px',
              }}
            >
              {product.quantity}
            </Text>

            {/* Price Section */}
            <Group gap={spacing.xs} align="center">
              <Text
                size="lg"
                fw={typography.fontWeight.bold}
                variant="primary"
                style={{
                  fontSize: '16px',
                  color: colors.text.primary,
                }}
              >
                ₹{currentPrice}
              </Text>
            </Group>

            {/* Quantity Selector and Add Button */}
            <Group gap={spacing.sm} align="center">
              {/* Quantity Selector Dropdown */}
              <Select
                value={selectedVariant}
                onChange={(value) => value && setSelectedVariant(value)}
                data={quantityOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                rightSection={<IconChevronDown size={14} />}
                styles={{
                  input: {
                    height: 28,
                    minHeight: 28,
                    fontSize: '12px',
                    fontWeight: typography.fontWeight.semibold,
                    borderColor: colors.border,
                    borderRadius: radius.sm,
                    paddingLeft: spacing.sm,
                    paddingRight: spacing.sm,
                  },
                  section: {
                    width: 20,
                  },
                  dropdown: {
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                  },
                  option: {
                    fontSize: '12px',
                    padding: spacing.sm,
                  },
                }}
                comboboxProps={{
                  width: 100,
                  position: 'bottom-start',
                }}
              />

              {/* Add to Cart Button */}
              <Box
                onClick={() => {
                  if (!currentVariant) return;

                  const variantUnit = currentVariant.unit || product.unit;

                  addItem({
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: currentPrice,
                    unit: variantUnit,
                    productQuantity: currentVariant.label,
                    orderedQuantity: currentVariant.quantity,
                    baseQuantity: product.baseQuantity,
                    basePrice: product.price,
                    baseUnit: product.unit,
                    isAvailable: true,
                    selectedVariant: selectedVariant,
                  });
                  onClose();
                }}
                style={{
                  cursor: 'pointer',
                }}
              >
                <Button
                  size="sm"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.text.inverse,
                    fontWeight: typography.fontWeight.semibold,
                    fontSize: '12px',
                    height: 28,
                    paddingLeft: spacing.md,
                    paddingRight: spacing.md,
                    borderRadius: radius.sm,
                    pointerEvents: 'none',
                  }}
                >
                  ADD
                </Button>
              </Box>
            </Group>
          </Stack>
        </Group>
      </Box>
    </Drawer>
  );
}
