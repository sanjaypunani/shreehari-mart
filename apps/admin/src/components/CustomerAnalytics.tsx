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
} from '@mantine/core';
import { BarChart, PieChart, DonutChart, AreaChart } from '@mantine/charts';
import {
  IconUsers,
  IconUserCheck,
  IconUserPlus,
  IconTrendingUp,
  IconMapPin,
  IconCrown,
} from '@tabler/icons-react';
import { formatCurrency } from '@shreehari/utils';

interface CustomerAnalyticsProps {
  data: {
    newVsReturning: {
      newCustomers: number;
      returningCustomers: number;
      newCustomerPercentage: number;
      returningCustomerPercentage: number;
    };
    topCustomers: Array<{
      customerId: string;
      name: string;
      orderCount: number;
      totalOrderValue: number;
      avgOrderValue: number;
      societyName: string;
      flatNumber: string;
    }>;
    retentionMetrics: {
      totalCustomers: number;
      activeCustomers: number;
      retentionRate: number;
      repeatOrderRate: number;
    };
    customersByLocation: Array<{
      societyName: string;
      customerCount: number;
      totalOrders: number;
      totalRevenue: number;
    }>;
  } | null;
  loading?: boolean;
}

export const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Loading customer analytics...
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  if (!data) {
    return (
      <Card withBorder p="md" radius="md">
        <Text c="dimmed">No customer analytics data available</Text>
      </Card>
    );
  }

  // Prepare data for new vs returning customers chart
  const newVsReturningData = [
    {
      name: 'New Customers',
      value: data?.newVsReturning?.newCustomers,
      color: 'blue.6',
    },
    {
      name: 'Returning Customers',
      value: data?.newVsReturning?.returningCustomers,
      color: 'green.6',
    },
  ];

  // Prepare data for customer location chart
  const locationData = data?.customersByLocation?.map((location) => ({
    society: location.societyName,
    customers: location.customerCount,
    orders: location.totalOrders,
    revenue: location.totalRevenue,
  }));

  return (
    <Stack gap="lg">
      {/* Customer Overview KPIs */}
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Total Customers
              </Text>
              <Text fw={700} size="xl">
                {data?.retentionMetrics?.totalCustomers}
              </Text>
            </div>
            <ThemeIcon color="blue" variant="light" size={38} radius="md">
              <IconUsers size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Active Customers
              </Text>
              <Text fw={700} size="xl">
                {data?.retentionMetrics?.activeCustomers}
              </Text>
            </div>
            <ThemeIcon color="green" variant="light" size={38} radius="md">
              <IconUserCheck size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Retention Rate
              </Text>
              <Text fw={700} size="xl">
                {data?.retentionMetrics?.retentionRate.toFixed(1)}%
              </Text>
            </div>
            <ThemeIcon color="teal" variant="light" size={38} radius="md">
              <IconTrendingUp size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Repeat Orders
              </Text>
              <Text fw={700} size="xl">
                {data?.retentionMetrics?.repeatOrderRate.toFixed(1)}%
              </Text>
            </div>
            <ThemeIcon color="violet" variant="light" size={38} radius="md">
              <IconUserPlus size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        {/* New vs Returning Customers Chart */}
        <Card withBorder p="md" radius="md">
          <Text fw={500} mb="md" size="lg">
            New vs Returning Customers
          </Text>
          {/* <DonutChart
            data={newVsReturningData}
            thickness={30}
            size={200}
            tooltipDataSource="segment"
            mx="auto"
          /> */}
          <SimpleGrid cols={2} mt="md" spacing="xs">
            <Group justify="center">
              <Badge color="blue" variant="dot">
                New: {data?.newVsReturning?.newCustomerPercentage.toFixed(1)}%
              </Badge>
            </Group>
            <Group justify="center">
              <Badge color="green" variant="dot">
                Returning:{' '}
                {data?.newVsReturning?.returningCustomerPercentage.toFixed(1)}%
              </Badge>
            </Group>
          </SimpleGrid>
        </Card>

        {/* Customer Location Distribution */}
        <Card withBorder p="md" radius="md">
          <Text fw={500} mb="md" size="lg">
            Customers by Location
          </Text>
          {/* <BarChart
            h={200}
            data={locationData}
            dataKey="society"
            series={[{ name: 'customers', color: 'blue.6' }]}
            gridAxis="none"
          /> */}
        </Card>
      </SimpleGrid>

      {/* Top Customers Table */}
      <Card withBorder p="md" radius="md">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            Top Customers by Order Value
          </Text>
          <ThemeIcon color="yellow" variant="light" size={32} radius="md">
            <IconCrown size={16} />
          </ThemeIcon>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer Name</Table.Th>
                <Table.Th>Total Orders</Table.Th>
                <Table.Th>Total Spent</Table.Th>
                {/* <Table.Th>Avg Order Value</Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.topCustomers.map((customer, index) => (
                <Table.Tr key={customer.customerId}>
                  <Table.Td>
                    <Group gap="sm">
                      <Badge
                        color={
                          index === 0 ? 'gold' : index === 1 ? 'gray' : 'orange'
                        }
                        variant="light"
                        size="sm"
                      >
                        #{index + 1}
                      </Badge>
                      <Text
                        fw={500}
                      >{`${customer.flatNumber} - ${customer.societyName} ${customer.name}`}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text>{customer.orderCount}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} c="green">
                      {formatCurrency(customer.totalOrderValue)}
                    </Text>
                  </Table.Td>
                  {/* <Table.Td>
                    <Text c="blue">
                      {formatCurrency(customer.avgOrderValue)}
                    </Text>
                  </Table.Td> */}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Active Areas/Societies */}
      <Card withBorder p="md" radius="md">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            Most Active Areas/Societies
          </Text>
          <ThemeIcon color="cyan" variant="light" size={32} radius="md">
            <IconMapPin size={16} />
          </ThemeIcon>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Society Name</Table.Th>
                <Table.Th>Customer Count</Table.Th>
                <Table.Th>Total Orders</Table.Th>
                <Table.Th>Total Revenue</Table.Th>
                <Table.Th>Avg Revenue per Customer</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.customersByLocation?.map((location, index) => (
                <Table.Tr key={location.societyName}>
                  <Table.Td>
                    <Group gap="sm">
                      <Badge
                        color={index < 3 ? 'blue' : 'gray'}
                        variant="light"
                        size="sm"
                      >
                        #{index + 1}
                      </Badge>
                      <Text fw={500}>{location.societyName}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text>{location.customerCount}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text>{location.totalOrders}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} c="green">
                      {formatCurrency(location.totalRevenue)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text c="blue">
                      {formatCurrency(
                        location.totalRevenue / location.customerCount
                      )}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>
  );
};
