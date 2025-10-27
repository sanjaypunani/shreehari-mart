import { Paper, Stack, Text, Group, Box } from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
    direction?: 'up' | 'down';
  };
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  description,
  variant = 'default',
  loading = false,
}: MetricCardProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.text.primary;
    }
  };

  const getTrendColor = () => {
    if (!trend) return colors.text.secondary;
    if (trend.direction === 'up') return colors.success;
    if (trend.direction === 'down') return colors.error;
    return colors.text.secondary;
  };

  return (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        borderLeftWidth: 4,
        borderLeftColor: getVariantColor(),
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text size="sm" c={colors.text.secondary} fw={500}>
              {label}
            </Text>
            <Text size="xl" fw={700} c={getVariantColor()}>
              {loading ? '...' : value}
            </Text>
          </Stack>
          {icon && (
            <Box
              style={{
                color: getVariantColor(),
                opacity: 0.8,
              }}
            >
              {icon}
            </Box>
          )}
        </Group>

        {(trend || description) && (
          <Box>
            {trend && (
              <Group gap="xs" mb={description ? 4 : 0}>
                <Text size="sm" fw={600} c={getTrendColor()}>
                  {trend.direction === 'up' && '↑'}
                  {trend.direction === 'down' && '↓'}
                  {trend.value > 0 && '+'}
                  {trend.value}%
                </Text>
                {trend.label && (
                  <Text size="sm" c={colors.text.secondary}>
                    {trend.label}
                  </Text>
                )}
              </Group>
            )}
            {description && (
              <Text size="xs" c={colors.text.secondary}>
                {description}
              </Text>
            )}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

// Alias for backward compatibility
export const Statistic = MetricCard;
