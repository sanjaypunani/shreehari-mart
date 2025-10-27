import React from 'react';
import { Card, Text, Group, Stack, SimpleGrid, ThemeIcon } from '@mantine/core';
import {
  IconShoppingCart,
  IconCurrencyRupee,
  IconTrendingUp,
  IconUsers,
  IconGift,
  IconClock,
} from '@tabler/icons-react';
import { formatCurrency } from '@shreehari/utils';

interface KPICardsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalDiscount: number;
    pendingOrders: number;
    averageOrderValue: number;
  } | null;
  loading?: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4, lg: 6 }} spacing="md">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Loading...
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  if (!stats) {
    return (
      <Card withBorder p="md" radius="md">
        <Text c="dimmed">No statistics available</Text>
      </Card>
    );
  }

  const kpiData = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: IconShoppingCart,
      color: 'blue',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: IconCurrencyRupee,
      color: 'green',
    },
    {
      title: 'Total Discount',
      value: formatCurrency(stats.totalDiscount),
      icon: IconGift,
      color: 'orange',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: IconClock,
      color: 'red',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(stats.averageOrderValue),
      icon: IconTrendingUp,
      color: 'violet',
    },
    {
      title: 'Completion Rate',
      value:
        stats.totalOrders > 0
          ? `${Math.round(((stats.totalOrders - stats.pendingOrders) / stats.totalOrders) * 100)}%`
          : '0%',
      icon: IconUsers,
      color: 'teal',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                {kpi.title}
              </Text>
              <Text fw={700} size="xl">
                {kpi.value}
              </Text>
            </div>
            <ThemeIcon color={kpi.color} variant="light" size={38} radius="md">
              <kpi.icon size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
};
