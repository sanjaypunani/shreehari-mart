import React, { useState } from 'react';
import { Stack, Group, Button, Text, Tabs } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconCalendar,
  IconRefresh,
  IconChartBar,
  IconUsers,
  IconPackage,
  IconTruck,
} from '@tabler/icons-react';
import { PageHeader } from '@shreehari/ui';
import {
  useOrderAnalytics,
  useCustomerAnalytics,
  useProductAnalytics,
  useDeliveryPlanAnalytics,
} from '@shreehari/data-access';
import { KPICards } from '../components/KPICards';
import { CustomerAnalytics } from '../components/CustomerAnalytics';
import { ProductAnalytics } from '../components/ProductAnalytics';
import { DeliveryPlanAnalytics } from '../components/DeliveryPlanAnalytics';

export const OrderAnalyticsPage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Fetch all analytics data
  const {
    data: orderStats,
    loading: orderLoading,
    error: orderError,
    refetch: refetchOrder,
  } = useOrderAnalytics(
    dateFrom ? new Date(dateFrom).toISOString() : undefined,
    dateTo ? new Date(dateTo).toISOString() : undefined
  );

  const {
    data: customerData,
    loading: customerLoading,
    error: customerError,
    refetch: refetchCustomer,
  } = useCustomerAnalytics(
    dateFrom ? new Date(dateFrom).toISOString() : undefined,
    dateTo ? new Date(dateTo).toISOString() : undefined
  );

  const {
    data: productData,
    loading: productLoading,
    error: productError,
    refetch: refetchProduct,
  } = useProductAnalytics(
    dateFrom ? new Date(dateFrom).toISOString() : undefined,
    dateTo ? new Date(dateTo).toISOString() : undefined
  );

  console.log('Product Data:', productData);

  const {
    data: deliveryData,
    loading: deliveryLoading,
    error: deliveryError,
    refetch: refetchDelivery,
  } = useDeliveryPlanAnalytics(
    dateFrom ? new Date(dateFrom).toISOString() : undefined,
    dateTo ? new Date(dateTo).toISOString() : undefined
  );

  console.log('Analytics data:', {
    orderStats,
    customerData,
    productData,
    deliveryData,
  });

  const handleClearFilters = () => {
    setDateFrom(null);
    setDateTo(null);
  };

  const handleRefreshAll = () => {
    refetchOrder();
    refetchCustomer();
    refetchProduct();
    refetchDelivery();
  };

  const headerActions = [
    {
      label: 'Refresh All',
      variant: 'outline' as const,
      leftSection: <IconRefresh size={16} />,
      onClick: handleRefreshAll,
    },
  ];

  const hasError = orderError || customerError || productError || deliveryError;
  const isLoading =
    orderLoading || customerLoading || productLoading || deliveryLoading;

  return (
    <Stack gap="md">
      <PageHeader
        title="Order Analytics Dashboard"
        subtitle="Comprehensive analytics for orders, customers, products, and delivery planning"
        actions={headerActions}
      />

      {/* Date Filters */}
      <Group gap="md">
        <DatePickerInput
          label="From Date"
          placeholder="Select start date"
          value={dateFrom}
          onChange={setDateFrom}
          leftSection={<IconCalendar size={16} />}
          clearable
        />
        <DatePickerInput
          label="To Date"
          placeholder="Select end date"
          value={dateTo}
          onChange={setDateTo}
          leftSection={<IconCalendar size={16} />}
          clearable
        />
        <Button
          variant="light"
          onClick={handleClearFilters}
          style={{ marginTop: 25 }}
        >
          Clear Filters
        </Button>
      </Group>

      {/* Error Display */}
      {hasError && (
        <Text c="red">
          Error loading analytics:{' '}
          {orderError || customerError || productError || deliveryError}
        </Text>
      )}

      {/* Analytics Tabs */}
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value || 'overview')}
      >
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartBar size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="customers" leftSection={<IconUsers size={16} />}>
            Customer Analytics
          </Tabs.Tab>
          <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
            Product Analytics
          </Tabs.Tab>
          <Tabs.Tab value="delivery" leftSection={<IconTruck size={16} />}>
            Delivery Planning
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          {orderStats && <KPICards stats={orderStats} loading={orderLoading} />}
        </Tabs.Panel>

        <Tabs.Panel value="customers" pt="md">
          {customerData && (
            <CustomerAnalytics data={customerData} loading={customerLoading} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="products" pt="md">
          {productData && (
            <ProductAnalytics data={productData} loading={productLoading} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="delivery" pt="md">
          {deliveryData && (
            <DeliveryPlanAnalytics
              data={deliveryData}
              loading={deliveryLoading}
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
