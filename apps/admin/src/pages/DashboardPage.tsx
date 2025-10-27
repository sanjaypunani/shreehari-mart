import React from 'react';
import {
  Title,
  Grid,
  Card,
  Text,
  Group,
  RingProgress,
  Stack,
  Button,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconShoppingCart,
  IconBox,
  IconUsers,
  IconTrendingUp,
  IconChartBar,
  IconPlus,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@shreehari/utils';
import { useOrderStats, useCustomers } from '@shreehari/data-access';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Fetch real order statistics
  const {
    data: orderStats,
    loading: orderStatsLoading,
    error: orderStatsError,
  } = useOrderStats();

  // Fetch customer data for count
  const { data: customerData, loading: customersLoading } = useCustomers(1, 1);

  const loading = orderStatsLoading || customersLoading;

  // Prepare stats with real data
  const stats = [
    {
      icon: IconShoppingCart,
      title: 'Total Orders',
      value: orderStats?.totalOrders?.toString() || '0',
      diff: 13,
      color: 'blue',
    },
    {
      icon: IconBox,
      title: 'Products',
      value: '456', // This could be fetched from a products API
      diff: 5,
      color: 'teal',
    },
    {
      icon: IconUsers,
      title: 'Customers',
      value: customerData?.total?.toString() || '0',
      diff: 8,
      color: 'pink',
    },
    {
      icon: IconTrendingUp,
      title: 'Revenue',
      value: orderStats?.totalRevenue
        ? formatCurrency(orderStats.totalRevenue)
        : formatCurrency(0),
      diff: 23,
      color: 'green',
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={1}>Dashboard</Title>
        <Group gap="sm">
          <Button
            variant="outline"
            leftSection={<IconChartBar size={16} />}
            onClick={() => navigate('/orders/analytics')}
          >
            View Analytics
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/orders/new')}
          >
            New Order
          </Button>
        </Group>
      </Group>

      {orderStatsError && (
        <Card withBorder padding="md" radius="md">
          <Text c="red">Error loading dashboard data: {orderStatsError}</Text>
        </Card>
      )}

      <Grid>
        {stats.map((stat) => (
          <Grid.Col key={stat.title} span={{ base: 12, xs: 6, md: 3 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ position: 'relative' }}
            >
              <LoadingOverlay visible={loading} />
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: stat.diff, color: stat.color }]}
                  label={
                    <div style={{ textAlign: 'center' }}>
                      <stat.icon size={22} stroke={1.5} />
                    </div>
                  }
                />
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Order Overview</Title>
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate('/orders')}
              >
                View All Orders
              </Button>
            </Group>
            {orderStats && (
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">
                      Order Status
                    </Text>
                    <Text>
                      Pending:{' '}
                      <strong>
                        {orderStats.statusBreakdown?.pending || 0}
                      </strong>
                    </Text>
                    <Text>
                      Confirmed:{' '}
                      <strong>
                        {orderStats.statusBreakdown?.confirmed || 0}
                      </strong>
                    </Text>
                    <Text c="green">
                      Delivered:{' '}
                      <strong>
                        {orderStats.statusBreakdown?.delivered || 0}
                      </strong>
                    </Text>
                    <Text c="red">
                      Cancelled:{' '}
                      <strong>
                        {orderStats.statusBreakdown?.cancelled || 0}
                      </strong>
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">
                      Payment Modes
                    </Text>
                    <Text c="blue">
                      Wallet:{' '}
                      <strong>
                        {orderStats.paymentModeBreakdown?.wallet || 0}
                      </strong>
                    </Text>
                    <Text c="orange">
                      Monthly:{' '}
                      <strong>
                        {orderStats.paymentModeBreakdown?.monthly || 0}
                      </strong>
                    </Text>
                    <Text c="gray">
                      COD:{' '}
                      <strong>
                        {orderStats.paymentModeBreakdown?.cod || 0}
                      </strong>
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            )}
            {!orderStats && !loading && (
              <Text c="dimmed">No order data available</Text>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Quick Actions
            </Title>
            <Stack gap="sm">
              <Button
                variant="light"
                fullWidth
                leftSection={<IconPlus size={16} />}
                onClick={() => navigate('/orders/new')}
              >
                Create New Order
              </Button>
              <Button
                variant="light"
                fullWidth
                leftSection={<IconUsers size={16} />}
                onClick={() => navigate('/customers')}
              >
                Manage Customers
              </Button>
              <Button
                variant="light"
                fullWidth
                leftSection={<IconChartBar size={16} />}
                onClick={() => navigate('/orders/analytics')}
              >
                View Analytics
              </Button>
              <Button
                variant="light"
                fullWidth
                leftSection={<IconShoppingCart size={16} />}
                onClick={() => navigate('/orders')}
              >
                Manage Orders
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
