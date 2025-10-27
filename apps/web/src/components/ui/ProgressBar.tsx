import {
  Progress as MantineProgress,
  ProgressProps as MantineProgressProps,
  Box,
  Text,
  Group,
} from '@mantine/core';
import { colors } from '../../theme';

export interface ProgressBarProps extends Omit<MantineProgressProps, 'value'> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  striped?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'primary',
  size = 'md',
  striped = false,
  animated = false,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'green';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'red';
      case 'primary':
        return 'primary';
      default:
        return 'blue';
    }
  };

  return (
    <Box>
      {(label || showValue) && (
        <Group justify="space-between" mb="xs">
          {label && (
            <Text size="sm" fw={500} c={colors.text.primary}>
              {label}
            </Text>
          )}
          {showValue && (
            <Text size="sm" fw={600} c={colors.text.secondary}>
              {Math.round(percentage)}%
            </Text>
          )}
        </Group>
      )}
      <MantineProgress
        value={percentage}
        color={getVariantColor()}
        size={size}
        striped={striped}
        animated={animated}
        {...props}
      />
    </Box>
  );
}

// Ring Progress variant
import {
  RingProgress as MantineRingProgress,
  RingProgressProps as MantineRingProgressProps,
  Stack,
} from '@mantine/core';

export interface CircularProgressProps
  extends Omit<MantineRingProgressProps, 'sections'> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: number;
  thickness?: number;
}

export function CircularProgress({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'primary',
  size = 120,
  thickness = 8,
  ...props
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'primary':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  return (
    <Stack align="center" gap="xs">
      <MantineRingProgress
        size={size}
        thickness={thickness}
        sections={[{ value: percentage, color: getVariantColor() }]}
        label={
          showValue ? (
            <Text ta="center" fw={700} size="lg" c={colors.text.primary}>
              {Math.round(percentage)}%
            </Text>
          ) : undefined
        }
        {...props}
      />
      {label && (
        <Text size="sm" fw={500} c={colors.text.secondary} ta="center">
          {label}
        </Text>
      )}
    </Stack>
  );
}
