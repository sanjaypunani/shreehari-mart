import React from 'react';
import { Card, Text, Group, Stack, SimpleGrid, ThemeIcon } from '@mantine/core';
import {
  IconShoppingCart,
  IconCurrencyRupee,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { formatCurrency } from '@shreehari/utils';

interface OrderStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalCustomers: number;
    statusBreakdown: {
      pending: number;
      confirmed: number;
      delivered: number;
      cancelled: number;
    };
    paymentModeBreakdown: {
      wallet: number;
      monthly: number;
      cod: number;
    };
  } | null;
  loading?: boolean;
}

export const OrderStats: React.FC<OrderStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {Array.from({ length: 4 }).map((_, index) => (
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

  const mainStats = [
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
      title: 'Average Order Value',
      value: formatCurrency(stats.averageOrderValue),
      icon: IconTrendingUp,
      color: 'orange',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers?.toString(),
      icon: IconUsers,
      color: 'violet',
    },
  ];

  return (
    <Stack gap="lg">
      {/* Main Statistics */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {mainStats.map((stat) => (
          <Card key={stat.title} withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  {stat.title}
                </Text>
                <Text fw={700} size="xl">
                  {stat.value}
                </Text>
              </div>
              <ThemeIcon
                color={stat.color}
                variant="light"
                size={38}
                radius="md"
              >
                <stat.icon size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Status Breakdown */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Card withBorder p="md" radius="md">
          <Text fw={500} mb="md">
            Order Status Breakdown
          </Text>
          {/* <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm">Pending:</Text>
              <Text fw={500}>{stats.statusBreakdown.pending}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Confirmed:</Text>
              <Text fw={500}>{stats.statusBreakdown.confirmed}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Delivered:</Text>
              <Text fw={500} c="green">
                {stats.statusBreakdown.delivered}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Cancelled:</Text>
              <Text fw={500} c="red">
                {stats.statusBreakdown.cancelled}
              </Text>
            </Group>
          </Stack> */}
        </Card>

        <Card withBorder p="md" radius="md">
          <Text fw={500} mb="md">
            Payment Mode Breakdown
          </Text>
          {/* <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm">Wallet:</Text>
              <Text fw={500} c="blue">
                {stats.paymentModeBreakdown.wallet}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Monthly:</Text>
              <Text fw={500} c="orange">
                {stats.paymentModeBreakdown.monthly}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Cash on Delivery:</Text>
              <Text fw={500} c="gray">
                {stats.paymentModeBreakdown.cod}
              </Text>
            </Group>
          </Stack> */}
        </Card>
      </SimpleGrid>
    </Stack>
  );
};
