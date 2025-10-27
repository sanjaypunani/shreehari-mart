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

export interface ProductDetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    quantity: string;
    deliveryTime?: string;
    variants?: Array<{
      value: string;
      label: string;
      price: number;
      originalPrice?: number;
    }>;
  };
}

export function ProductDetailDrawer({
  opened,
  onClose,
  product,
}: ProductDetailDrawerProps) {
  if (!product) return null;

  // Sample quantity options (will be replaced with product.variants)
  const quantityOptions = product.variants || [
    {
      value: '250g',
      label: '250 gm',
      price: product.price,
      originalPrice: product.originalPrice,
    },
    {
      value: '500g',
      label: '500 gm',
      price: product.price * 2,
      originalPrice: product.originalPrice
        ? product.originalPrice * 2
        : undefined,
    },
    {
      value: '1kg',
      label: '1 kg',
      price: product.price * 4,
      originalPrice: product.originalPrice
        ? product.originalPrice * 4
        : undefined,
    },
    {
      value: '2kg',
      label: '2 kg',
      price: product.price * 8,
      originalPrice: product.originalPrice
        ? product.originalPrice * 8
        : undefined,
    },
  ];

  const [selectedVariant, setSelectedVariant] = React.useState(
    quantityOptions[0].value
  );

  const currentVariant =
    quantityOptions.find((v) => v.value === selectedVariant) ||
    quantityOptions[0];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size={160}
      withCloseButton={false}
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
                ₹{currentVariant.price}
              </Text>
              {currentVariant.originalPrice && (
                <Text
                  size="sm"
                  variant="secondary"
                  style={{
                    textDecoration: 'line-through',
                    color: colors.text.secondary,
                    fontSize: '12px',
                  }}
                >
                  ₹{currentVariant.originalPrice}
                </Text>
              )}
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
                }}
              >
                ADD
              </Button>
            </Group>
          </Stack>
        </Group>
      </Box>
    </Drawer>
  );
}
