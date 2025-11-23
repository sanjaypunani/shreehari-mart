'use client';

import React from 'react';
import {
  Box,
  Container,
  Group,
  Text,
  Stack,
  Image,
  Button,
  Select,
  CloseButton,
  Paper,
  Divider,
  ActionIcon,
  Badge,
} from '@mantine/core';
import { IconChevronLeft, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { LoginBottomSheet } from '../../components/auth/LoginBottomSheet';
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

export default function CartPage() {
  const router = useRouter();
  const [loginOpen, { open: openLogin, close: closeLogin }] = useDisclosure(false);
  const { items, totalAmount, savings, updateVariant, removeItem } =
    useCartStore();

  // Format currency
  const formatPrice = (price: number) => `₹${Math.round(price)}`;

  // Calculate bill details
  const itemTotal = totalAmount;
  const handlingFee = 0;
  const deliveryPartnerFee = 0;
  const toBePaid = itemTotal + handlingFee + deliveryPartnerFee;

  // Separate available and unavailable items
  const availableItems = items.filter((item) => item.isAvailable);
  const unavailableItems = items.filter((item) => !item.isAvailable);

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          backgroundColor: colors.surface,
        }}
      >
        {/* Header */}
        <Paper
          shadow="sm"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#ffffff',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Container size="sm" p={0}>
            <Group p={spacing.md} justify="space-between" align="center">
              <Group gap={spacing.sm}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => router.back()}
                  size="lg"
                >
                  <IconChevronLeft size={24} />
                </ActionIcon>
                <Text size="lg" fw={600} c={colors.text.primary}>
                  Your Cart
                </Text>
              </Group>
            </Group>
          </Container>
        </Paper>

        {/* Empty state */}
        <Container size="sm" p={spacing.xl}>
          <Stack align="center" gap={spacing.lg} style={{ paddingTop: '20vh' }}>
            <Text size="xl" fw={600} c={colors.text.primary}>
              Your cart is empty
            </Text>
            <Text size="sm" c={colors.text.secondary} ta="center">
              Add items to your cart to get started
            </Text>
            <Button
              size="md"
              radius={radius.md}
              style={{ backgroundColor: colors.primary }}
              onClick={() => router.push('/')}
            >
              Start Shopping
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: colors.surface,
        paddingBottom: 120,
      }}
    >
      <LoginBottomSheet opened={loginOpen} onClose={closeLogin} returnUrl="/cart" />
      
      {/* Header */}
      <Paper
        shadow="sm"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#ffffff',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Container size="sm" p={0}>
          <Group p={spacing.md} justify="space-between" align="center">
            <Group gap={spacing.sm}>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => router.back()}
                size="lg"
              >
                <IconChevronLeft size={24} />
              </ActionIcon>
              <Text size="lg" fw={600} c={colors.text.primary}>
                Your Cart
              </Text>
            </Group>
            <Text size="sm" c={colors.text.secondary}>
              {availableItems.length} Item
              {availableItems.length !== 1 ? 's' : ''}
            </Text>
          </Group>
        </Container>
      </Paper>

      <Container size="sm" p={0}>
        {/* Delivery Time Badge */}
        <Paper p={spacing.md} radius={0}>
          <Group justify="space-between" align="center">
            <Group gap={spacing.xs}>
              <Text size="sm" fw={600} c={colors.text.primary}>
                30 Mins
              </Text>
              <Badge color="green" size="sm" variant="light">
                Superfast
              </Badge>
            </Group>
            <Text size="xs" c={colors.text.secondary}>
              {availableItems.length} Item
              {availableItems.length !== 1 ? 's' : ''}
            </Text>
          </Group>
        </Paper>

        {/* Unavailable Items */}
        {unavailableItems.length > 0 && (
          <Paper
            p={spacing.md}
            radius={0}
            style={{
              backgroundColor: '#fef2f2',
              borderTop: `1px solid ${colors.border}`,
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
                  unavailableItems.forEach((item) => removeItem(item.id));
                }}
              >
                Remove all ×
              </Button>
            </Group>

            <Stack gap={spacing.md}>
              {unavailableItems.map((item) => (
                <Group
                  key={item.id}
                  justify="space-between"
                  align="flex-start"
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
                      w={50}
                      h={50}
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
            </Stack>
          </Paper>
        )}

        {/* Available Cart Items */}
        <Paper p={spacing.md} radius={0}>
          <Stack gap={spacing.lg}>
            {availableItems.map((item) => {
              // Use appropriate quantity options based on item unit
              const quantityOptions =
                item.baseUnit === 'pc'
                  ? DEFAULT_PIECE_OPTIONS
                  : DEFAULT_WEIGHT_OPTIONS;

              return (
                <Group key={item.id} justify="space-between" align="flex-start">
                  <Group gap={spacing.sm} style={{ flex: 1 }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      w={60}
                      h={60}
                      radius={radius.sm}
                      fit="cover"
                    />
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text size="sm" fw={500} c={colors.text.primary}>
                        {item.name}
                      </Text>
                      <Text size="xs" c={colors.text.secondary}>
                        {item.productQuantity}
                      </Text>
                      <Group gap={spacing.xs} mt={2}>
                        <Button
                          variant="light"
                          size="xs"
                          color="gray"
                          onClick={() => {
                            const currentIndex = quantityOptions.findIndex(
                              (opt) => opt.value === item.selectedVariant
                            );
                            if (currentIndex > 0) {
                              const newOption =
                                quantityOptions[currentIndex - 1];
                              const newPrice = calculateItemPrice(
                                newOption.quantity,
                                newOption.unit,
                                item.basePrice,
                                item.baseQuantity,
                                item.baseUnit
                              );
                              updateVariant(
                                item.id,
                                newOption.value,
                                newOption.label,
                                newPrice,
                                newOption.quantity,
                                newOption.unit
                              );
                            }
                          }}
                          disabled={
                            quantityOptions.findIndex(
                              (opt) => opt.value === item.selectedVariant
                            ) === 0
                          }
                          style={{
                            minWidth: 32,
                            height: 32,
                            padding: 0,
                          }}
                        >
                          −
                        </Button>
                        <Select
                          data={quantityOptions.map((opt) => ({
                            value: opt.value,
                            label: opt.label,
                          }))}
                          value={
                            item.selectedVariant || quantityOptions[0]?.value
                          }
                          onChange={(value) => {
                            if (value) {
                              const selectedOption = quantityOptions.find(
                                (opt) => opt.value === value
                              );
                              if (selectedOption) {
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
                              fontSize: '13px',
                              fontWeight: 500,
                              padding: '6px 30px 6px 12px',
                              height: '32px',
                              minHeight: '32px',
                              borderColor: colors.border,
                            },
                          }}
                          w={100}
                        />
                        <Button
                          variant="light"
                          size="xs"
                          color="gray"
                          onClick={() => {
                            const currentIndex = quantityOptions.findIndex(
                              (opt) => opt.value === item.selectedVariant
                            );
                            if (currentIndex < quantityOptions.length - 1) {
                              const newOption =
                                quantityOptions[currentIndex + 1];
                              const newPrice = calculateItemPrice(
                                newOption.quantity,
                                newOption.unit,
                                item.basePrice,
                                item.baseQuantity,
                                item.baseUnit
                              );
                              updateVariant(
                                item.id,
                                newOption.value,
                                newOption.label,
                                newPrice,
                                newOption.quantity,
                                newOption.unit
                              );
                            }
                          }}
                          disabled={
                            quantityOptions.findIndex(
                              (opt) => opt.value === item.selectedVariant
                            ) ===
                            quantityOptions.length - 1
                          }
                          style={{
                            minWidth: 32,
                            height: 32,
                            padding: 0,
                          }}
                        >
                          +
                        </Button>
                      </Group>
                    </Stack>
                  </Group>

                  <Group gap={spacing.xs} align="center">
                    <Text size="sm" fw={600} c={colors.text.primary}>
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

          {/* Add More Items Button */}
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<IconPlus size={16} />}
            fullWidth
            mt={spacing.md}
            onClick={() => router.push('/')}
          >
            Add more items
          </Button>
        </Paper>

        {/* Bill Details */}
        <Paper p={spacing.md} radius={0} mt={spacing.sm}>
          <Text size="md" fw={600} c={colors.text.primary} mb={spacing.md}>
            BILL DETAILS
          </Text>

          <Stack gap={spacing.sm}>
            {/* Item Total */}
            <Group justify="space-between">
              <Text size="sm" c={colors.text.secondary}>
                Item Total
              </Text>
              <Text size="sm" fw={600} c={colors.text.primary}>
                {formatPrice(itemTotal)}
              </Text>
            </Group>

            {/* Handling Fee */}
            <Group justify="space-between">
              <Text size="sm" c={colors.text.secondary}>
                Handling Fee
              </Text>
              <Group gap={spacing.xs}>
                <Text size="sm" c={colors.text.secondary} td="line-through">
                  {formatPrice(10)}
                </Text>
                <Text size="sm" fw={500} c={colors.success}>
                  FREE
                </Text>
              </Group>
            </Group>

            {/* Delivery Partner Fee */}
            <Group justify="space-between">
              <Text size="sm" c={colors.text.secondary}>
                Delivery Partner Fee
              </Text>
              <Group gap={spacing.xs}>
                <Text size="sm" c={colors.text.secondary} td="line-through">
                  {formatPrice(30)}
                </Text>
                <Text size="sm" fw={500} c={colors.success}>
                  FREE
                </Text>
              </Group>
            </Group>

            <Divider my={spacing.xs} />

            {/* To Pay */}
            <Group justify="space-between">
              <Text size="md" fw={700} c={colors.text.primary}>
                To Pay: {formatPrice(toBePaid)}
              </Text>
              <Button
                variant="subtle"
                size="xs"
                color="blue"
                onClick={() => {
                  // Show detailed bill modal or expand
                }}
              >
                View Detailed Bill
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Almost There Section */}
        <Paper p={spacing.lg} radius={0} mt={spacing.sm} mb={spacing.xl}>
          <Stack gap={spacing.sm} align="center">
            <Text size="lg" fw={700} c={colors.text.primary}>
              Almost There
            </Text>
            <Text size="sm" c={colors.text.secondary} ta="center">
              Login or Signup to place your order
            </Text>
          </Stack>
        </Paper>
      </Container>

      {/* Bottom Proceed Button */}
      <Paper
        shadow="lg"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: '#ffffff',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <Container size="sm" p={spacing.md}>
          <Button
            size="lg"
            radius={radius.md}
            fullWidth
            style={{
              backgroundColor: colors.primary,
              fontSize: '16px',
              fontWeight: 600,
            }}
            onClick={openLogin}
          >
            Proceed with phone number
          </Button>
        </Container>
      </Paper>
    </Box>
  );
}
