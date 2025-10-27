import React from 'react';
import {
  Card,
  Text,
  Group,
  Stack,
  SimpleGrid,
  ThemeIcon,
  Badge,
  Table,
  ScrollArea,
  Progress,
} from '@mantine/core';
import { BarChart, PieChart, DonutChart } from '@mantine/charts';
import {
  IconPackage,
  IconTrendingUp,
  IconTrendingDown,
  IconAlertTriangle,
  IconStar,
  IconCurrencyRupee,
} from '@tabler/icons-react';
import { formatCurrency } from '@shreehari/utils';

interface ProductAnalyticsProps {
  data: {
    topSellingVegetables: Array<{
      id: string;
      name: string;
      totalQuantity: number;
      totalRevenue: number;
      unit: string;
    }>;
    lowSellingProducts: Array<{
      id: string;
      name: string;
      totalQuantity: number;
      totalRevenue: number;
      unit: string;
    }>;
    revenueContribution: Array<{
      id: string;
      name: string;
      revenue: number;
      percentage: number;
    }>;
  } | null;
  loading?: boolean;
}

export const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Loading product analytics...
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  if (!data) {
    return (
      <Card withBorder p="md" radius="md">
        <Text c="dimmed">No product analytics data available</Text>
      </Card>
    );
  }

  // Prepare data for revenue contribution pie chart
  const revenueContributionData = data.revenueContribution.map(
    (product, index) => ({
      name:
        product.name.length > 15
          ? `${product.name.substring(0, 15)}...`
          : product.name,
      value: product.revenue,
      color: `var(--mantine-color-blue-${Math.min(9, index + 4)})`,
    })
  );

  // Prepare data for top selling products chart
  const topSellingData = data?.topSellingVegetables?.map((product) => ({
    product:
      product.name.length > 10
        ? `${product.name.substring(0, 10)}...`
        : product.name,
    quantity: product.totalQuantity,
    revenue: product.totalRevenue,
  }));

  // Calculate total revenue for percentage calculations
  const totalRevenue = data.revenueContribution.reduce(
    (sum, product) => sum + product.revenue,
    0
  );

  return (
    <Stack gap="lg">
      {/* Product Performance Overview */}
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Top Products
              </Text>
              <Text fw={700} size="xl">
                {data?.topSellingVegetables?.length}
              </Text>
            </div>
            <ThemeIcon color="green" variant="light" size={38} radius="md">
              <IconTrendingUp size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Low Performers
              </Text>
              <Text fw={700} size="xl">
                {data?.lowSellingProducts?.length}
              </Text>
            </div>
            <ThemeIcon color="red" variant="light" size={38} radius="md">
              <IconTrendingDown size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Total Revenue
              </Text>
              <Text fw={700} size="xl">
                {formatCurrency(totalRevenue)}
              </Text>
            </div>
            <ThemeIcon color="blue" variant="light" size={38} radius="md">
              <IconCurrencyRupee size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Active Products
              </Text>
              <Text fw={700} size="xl">
                {data?.topSellingVegetables?.length +
                  data?.lowSellingProducts?.length}
              </Text>
            </div>
            <ThemeIcon color="violet" variant="light" size={38} radius="md">
              <IconPackage size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        {/* Top Selling Products Chart */}
        <Card withBorder p="md" radius="md">
          <Text fw={500} mb="md" size="lg">
            Top Selling Products by Quantity
          </Text>
          <BarChart
            h={300}
            data={topSellingData}
            dataKey="product"
            series={[{ name: 'quantity', color: 'green.6' }]}
            gridAxis="y"
          />
        </Card>

        {/* Revenue Contribution Chart */}
        <Card withBorder p="md" radius="md">
          <Text fw={500} mb="md" size="lg">
            Revenue Contribution by Product
          </Text>
          <DonutChart
            data={revenueContributionData}
            thickness={40}
            size={240}
            tooltipDataSource="segment"
            mx="auto"
          />
        </Card>
      </SimpleGrid>

      {/* Top Selling Products Table */}
      <Card withBorder p="md" radius="md">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            Top Selling Vegetables
          </Text>
          <ThemeIcon color="green" variant="light" size={32} radius="md">
            <IconStar size={16} />
          </ThemeIcon>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product Name</Table.Th>
                <Table.Th>Total Quantity Sold</Table.Th>
                <Table.Th>Total Revenue</Table.Th>
                <Table.Th>Revenue Share</Table.Th>
                <Table.Th>Performance</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.topSellingVegetables?.map((product, index) => {
                const revenueShare =
                  totalRevenue > 0
                    ? (product.totalRevenue / totalRevenue) * 100
                    : 0;
                return (
                  <Table.Tr key={product.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Badge
                          color={
                            index === 0
                              ? 'green'
                              : index === 1
                                ? 'blue'
                                : 'teal'
                          }
                          variant="light"
                          size="sm"
                        >
                          #{index + 1}
                        </Badge>
                        <Text fw={500}>{product.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text>
                        {product.totalQuantity} {product.unit}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} c="green">
                        {formatCurrency(product.totalRevenue)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text c="blue">{revenueShare.toFixed(1)}%</Text>
                    </Table.Td>
                    <Table.Td>
                      <Progress
                        value={revenueShare}
                        size="sm"
                        color="green"
                        w={80}
                      />
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Low Selling/Non-Moving Products */}
      <Card withBorder p="md" radius="md">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            Low-Selling/Non-Moving Vegetables
          </Text>
          <ThemeIcon color="orange" variant="light" size={32} radius="md">
            <IconAlertTriangle size={16} />
          </ThemeIcon>
        </Group>

        {data?.lowSellingProducts?.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No low-performing products found. All products are selling well!
          </Text>
        ) : (
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product Name</Table.Th>
                  <Table.Th>Total Quantity Sold</Table.Th>
                  <Table.Th>Total Revenue</Table.Th>
                  <Table.Th>Revenue Share</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data?.lowSellingProducts?.map((product) => {
                  const revenueShare =
                    totalRevenue > 0
                      ? (product.totalRevenue / totalRevenue) * 100
                      : 0;
                  const isNonMoving = product.totalQuantity === 0;

                  return (
                    <Table.Tr key={product.id}>
                      <Table.Td>
                        <Text fw={500}>{product.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c={isNonMoving ? 'red' : 'dimmed'}>
                          {product.totalQuantity} {product.unit}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c={isNonMoving ? 'red' : 'orange'}>
                          {formatCurrency(product.totalRevenue)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c="dimmed">{revenueShare.toFixed(1)}%</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={isNonMoving ? 'red' : 'orange'}
                          variant="light"
                          size="sm"
                        >
                          {isNonMoving ? 'Non-Moving' : 'Low Selling'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Card>
    </Stack>
  );
};
