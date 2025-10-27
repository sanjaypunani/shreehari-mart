import React, { useState } from 'react';
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
  Collapse,
  ActionIcon,
  Divider,
  Accordion,
} from '@mantine/core';
import {
  IconTruck,
  IconBuilding,
  IconHome,
  IconChevronDown,
  IconChevronRight,
  IconUsers,
  IconCalendar,
  IconPackage,
  IconMapPin,
  IconCopy,
} from '@tabler/icons-react';
import { formatCurrency, formatDate } from '@shreehari/utils';
import { notifications } from '@mantine/notifications';

interface DeliveryPlanAnalyticsProps {
  data: {
    ordersBySociety: Array<{
      societyName: string;
      buildings: Array<{
        buildingName: string;
        orders: Array<{
          id: string;
          flatNumber: string;
          customerName: string;
          orderAmount: number;
          paymentMethod: string;
          deliveryDate: string;
        }>;
      }>;
    }>;
    itemsByDeliveryDate: Array<{
      deliveryDate: string;
      items: Array<{
        productName: string;
        totalQuantity: number;
        unit: string;
        packageCount: number;
        packageSize: number;
        packageDescription: string;
      }>;
    }>;
  } | null;
  loading?: boolean;
}

export const DeliveryPlanAnalytics: React.FC<DeliveryPlanAnalyticsProps> = ({
  data,
  loading,
}) => {
  const [expandedSocieties, setExpandedSocieties] = useState<Set<string>>(
    new Set()
  );
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(
    new Set()
  );

  // Define types for copy handlers
  type DeliveryItem = {
    productName: string;
    totalQuantity: number;
    unit: string;
    packageCount: number;
    packageSize: number;
    packageDescription: string;
  };

  type ConvertedStockItem = {
    productName: string;
    totalQuantity: number;
    unit: string;
    displayQuantity: string;
  };

  // Helper function to convert units and format for display
  const convertAndFormatStock = (
    items: DeliveryItem[]
  ): ConvertedStockItem[] => {
    const stockSummary = items.reduce(
      (acc, item) => {
        if (!acc[item.productName]) {
          acc[item.productName] = {
            productName: item.productName,
            totalQuantity: 0,
            unit: item.unit,
          };
        }
        let kgQuantity = item.totalQuantity;
        const unitLower = item.unit.toLowerCase();

        const isGramUnit =
          unitLower === 'gm' ||
          unitLower === 'gram' ||
          unitLower === 'grams' ||
          unitLower === 'g';

        if (isGramUnit) {
          kgQuantity = item.totalQuantity / 1000;
        }

        acc[item.productName].totalQuantity += kgQuantity;
        acc[item.productName].unit =
          acc[item.productName].unit === 'pc' ? 'pc' : 'kg';
        return acc;
      },
      {} as Record<
        string,
        { productName: string; totalQuantity: number; unit: string }
      >
    );

    console.log('stockSummary', stockSummary);

    // Convert grams to kg and format for display
    return Object.values(stockSummary).map((item) => {
      // const unitLower = item.unit.toLowerCase();
      // const isGramUnit =
      //   unitLower === 'gm' ||
      //   unitLower === 'gram' ||
      //   unitLower === 'grams' ||
      //   unitLower === 'g';

      // if (isGramUnit) {
      //   const kgQuantity = item.totalQuantity / 1000;
      //   return {
      //     ...item,
      //     totalQuantity: kgQuantity,
      //     unit: 'kg',
      //     displayQuantity: `${kgQuantity.toFixed(kgQuantity < 1 ? 3 : 2)} kg`,
      //   };
      // }
      return {
        ...item,
        displayQuantity: `${item.totalQuantity} ${item.unit}`,
      };
    });
  };

  // Copy functionality handlers
  const handleCopyStockPlanning = async (
    deliveryDate: string,
    items: DeliveryItem[]
  ) => {
    try {
      const stockItems = convertAndFormatStock(items);

      // Format the text for copying
      const stockText =
        `📦 STOCK PLANNING - ${formatDate(deliveryDate)}\n\n` +
        stockItems
          .map(
            (item, index) =>
              `${index + 1}. ${item.productName}: ${item.displayQuantity}`
          )
          .join('\n') +
        `\n\nTotal Products: ${stockItems.length}`;

      await navigator.clipboard.writeText(stockText);

      notifications.show({
        title: 'Stock Planning Copied',
        message: 'Stock planning list has been copied to your clipboard.',
        color: 'green',
        icon: <IconCopy size={16} />,
      });
    } catch (error) {
      console.error('Failed to copy stock planning:', error);
      notifications.show({
        title: 'Copy Failed',
        message: 'Unable to copy to clipboard.',
        color: 'red',
      });
    }
  };

  const handleCopyPackagePlanning = async (
    deliveryDate: string,
    items: DeliveryItem[]
  ) => {
    try {
      // Group items by product name
      const groupedItems = items.reduce(
        (acc, item) => {
          if (!acc[item.productName]) {
            acc[item.productName] = [];
          }
          acc[item.productName].push(item);
          return acc;
        },
        {} as Record<string, DeliveryItem[]>
      );

      const totalPackages = items.reduce(
        (sum, item) => sum + item.packageCount,
        0
      );

      // Format the text for copying
      let packageText = `📋 PACKAGE PLANNING - ${formatDate(deliveryDate)}\n\n`;

      Object.entries(groupedItems).forEach(([productName, productItems]) => {
        packageText += `${productName}:\n`;
        productItems.forEach((item) => {
          packageText += `  • ${item.packageSize} ${item.unit} - ${item.packageCount} packages\n`;
        });
        packageText += '\n';
      });

      packageText += `Total Packages: ${totalPackages}`;

      await navigator.clipboard.writeText(packageText);

      notifications.show({
        title: 'Package Planning Copied',
        message: 'Package planning list has been copied to your clipboard.',
        color: 'green',
        icon: <IconCopy size={16} />,
      });
    } catch (error) {
      console.error('Failed to copy package planning:', error);
      notifications.show({
        title: 'Copy Failed',
        message: 'Unable to copy to clipboard.',
        color: 'red',
      });
    }
  };

  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Loading delivery planning data...
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  if (!data) {
    return (
      <Card withBorder p="md" radius="md">
        <Text c="dimmed">No delivery planning data available</Text>
      </Card>
    );
  }

  const toggleSociety = (societyName: string) => {
    const newExpanded = new Set(expandedSocieties);
    if (newExpanded.has(societyName)) {
      newExpanded.delete(societyName);
    } else {
      newExpanded.add(societyName);
    }
    setExpandedSocieties(newExpanded);
  };

  const toggleBuilding = (buildingKey: string) => {
    const newExpanded = new Set(expandedBuildings);
    if (newExpanded.has(buildingKey)) {
      newExpanded.delete(buildingKey);
    } else {
      newExpanded.add(buildingKey);
    }
    setExpandedBuildings(newExpanded);
  };

  // Calculate summary statistics
  const totalSocieties = data.ordersBySociety.length;
  const totalBuildings = data.ordersBySociety.reduce(
    (sum, society) => sum + society.buildings.length,
    0
  );
  const totalOrders = data.ordersBySociety.reduce(
    (sum, society) =>
      sum +
      society.buildings.reduce(
        (buildingSum, building) => buildingSum + building.orders.length,
        0
      ),
    0
  );
  const totalDeliveryDays = data.itemsByDeliveryDate.length;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    notifications.show({
      title: 'Copied to clipboard',
      message: 'The data has been copied to your clipboard.',
      color: 'teal',
      icon: <IconCopy size={16} />,
    });
  };

  const sortOrdersByFlatNumber = (orders: any) => {
    let sortedOrders = [...orders];
    console.log('sortedOrders before sorting:', sortedOrders.map(o => o.flatNumber));
    sortedOrders.sort((a, b) => {
      // Extract numeric parts from flat numbers for proper sorting
      const extractNumber = (flatNum: string) => {
        // Remove any non-numeric characters and convert to number
        const numericPart = flatNum.toString().replace(/[^0-9]/g, '');
        return parseInt(numericPart) || 0;
      };
      
      const flatA = extractNumber(a.flatNumber);
      const flatB = extractNumber(b.flatNumber);
      
      console.log(`Comparing: ${a.flatNumber} (${flatA}) vs ${b.flatNumber} (${flatB})`);
      return flatA - flatB;
    });
    console.log('sortedOrders after sorting:', sortedOrders.map(o => o.flatNumber));
    return sortedOrders;
  };

  console.log('data.itemsByDeliveryDate', data.itemsByDeliveryDate);

  return (
    <Stack gap="lg">
      {/* Delivery Overview KPIs */}
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Societies
              </Text>
              <Text fw={700} size="xl">
                {totalSocieties}
              </Text>
            </div>
            <ThemeIcon color="blue" variant="light" size={38} radius="md">
              <IconMapPin size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Buildings
              </Text>
              <Text fw={700} size="xl">
                {totalBuildings}
              </Text>
            </div>
            <ThemeIcon color="green" variant="light" size={38} radius="md">
              <IconBuilding size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Total Orders
              </Text>
              <Text fw={700} size="xl">
                {totalOrders}
              </Text>
            </div>
            <ThemeIcon color="orange" variant="light" size={38} radius="md">
              <IconTruck size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <div>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Delivery Days
              </Text>
              <Text fw={700} size="xl">
                {totalDeliveryDays}
              </Text>
            </div>
            <ThemeIcon color="violet" variant="light" size={38} radius="md">
              <IconCalendar size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Orders by Location */}
      <Card withBorder p="md" radius="md" style={{ minHeight: 500 }}>
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            Orders by Location
          </Text>
          <ThemeIcon color="blue" variant="light" size={32} radius="md">
            <IconHome size={16} />
          </ThemeIcon>
        </Group>

        <ScrollArea style={{ height: 400 }}>
          <Stack gap="sm">
            {data.ordersBySociety.map((society) => (
              <div key={society.societyName}>
                <Group
                  justify="space-between"
                  p="sm"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                  onClick={() => toggleSociety(society.societyName)}
                >
                  <Group gap="sm">
                    <ActionIcon variant="subtle" size="sm">
                      {expandedSocieties.has(society.societyName) ? (
                        <IconChevronDown size={16} />
                      ) : (
                        <IconChevronRight size={16} />
                      )}
                    </ActionIcon>
                    <ThemeIcon
                      color="blue"
                      variant="light"
                      size={24}
                      radius="md"
                    >
                      <IconMapPin size={12} />
                    </ThemeIcon>
                    <Text fw={500}>{society.societyName}</Text>
                  </Group>
                  <Badge variant="light" color="blue">
                    {society.buildings.reduce(
                      (sum, building) => sum + building.orders.length,
                      0
                    )}{' '}
                    orders
                  </Badge>
                </Group>

                <Collapse in={expandedSocieties.has(society.societyName)}>
                  <Stack gap="xs" ml="lg" mt="sm">
                    {society.buildings.map((building) => {
                      const buildingKey = `${society.societyName}-${building.buildingName}`;
                      return (
                        <div key={buildingKey}>
                          <Group
                            justify="space-between"
                            p="xs"
                            style={{
                              cursor: 'pointer',
                              backgroundColor: 'var(--mantine-color-gray-1)',
                              borderRadius: 'var(--mantine-radius-sm)',
                            }}
                            onClick={() => toggleBuilding(buildingKey)}
                          >
                            <Group gap="sm">
                              <ActionIcon variant="subtle" size="xs">
                                {expandedBuildings.has(buildingKey) ? (
                                  <IconChevronDown size={12} />
                                ) : (
                                  <IconChevronRight size={12} />
                                )}
                              </ActionIcon>
                              <ThemeIcon
                                color="green"
                                variant="light"
                                size={20}
                                radius="sm"
                              >
                                <IconBuilding size={10} />
                              </ThemeIcon>
                              <Text size="sm" fw={500}>
                                {building.buildingName}
                              </Text>
                            </Group>
                            <Badge variant="light" color="green" size="sm">
                              {building.orders.length} orders
                            </Badge>
                          </Group>

                          <Collapse in={expandedBuildings.has(buildingKey)}>
                            <Stack gap="xs" ml="lg" mt="xs">
                              {sortOrdersByFlatNumber(building.orders).map(
                                (order) => (
                                  <Group
                                    key={order.id}
                                    justify="space-between"
                                    p="xs"
                                    style={{
                                      backgroundColor:
                                        'var(--mantine-color-gray-0)',
                                      borderRadius: 'var(--mantine-radius-xs)',
                                      border:
                                        '1px solid var(--mantine-color-gray-3)',
                                    }}
                                  >
                                    <Group gap="sm">
                                      <ThemeIcon
                                        color="orange"
                                        variant="light"
                                        size={18}
                                        radius="xs"
                                      >
                                        <IconHome size={8} />
                                      </ThemeIcon>
                                      <div>
                                        <Text size="xs" fw={500}>
                                          Flat {order.flatNumber}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                          {order.customerName}
                                        </Text>
                                      </div>
                                    </Group>
                                    <div style={{ textAlign: 'right' }}>
                                      <Text size="xs" fw={500} c="green">
                                        {formatCurrency(order.orderAmount)}
                                      </Text>
                                      <Badge
                                        size="xs"
                                        variant="dot"
                                        color="blue"
                                      >
                                        {order.paymentMethod}
                                      </Badge>
                                    </div>
                                  </Group>
                                )
                              )}
                            </Stack>
                          </Collapse>
                        </div>
                      );
                    })}
                  </Stack>
                </Collapse>
              </div>
            ))}
          </Stack>
        </ScrollArea>
      </Card>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        {/* Stock Planning by Delivery Date */}
        <Card withBorder p="md" radius="md" style={{ minHeight: 500 }}>
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <Text fw={500} size="lg">
                Stock Planning by Delivery Date
              </Text>
              <ThemeIcon color="teal" variant="light" size={32} radius="md">
                <IconPackage size={16} />
              </ThemeIcon>
            </Group>
          </Group>

          <ScrollArea style={{ height: 400 }}>
            <Accordion variant="separated">
              {data.itemsByDeliveryDate.map((deliveryDay) => {
                const stockItems = convertAndFormatStock(deliveryDay.items);

                return (
                  <Accordion.Item
                    key={`stock-${deliveryDay.deliveryDate}`}
                    value={`stock-${deliveryDay.deliveryDate}`}
                  >
                    <Accordion.Control>
                      <Group justify="space-between">
                        <Group gap="sm">
                          <ThemeIcon
                            color="teal"
                            variant="light"
                            size={24}
                            radius="md"
                          >
                            <IconCalendar size={12} />
                          </ThemeIcon>
                          <div>
                            <Text fw={500} size="sm">
                              {formatDate(deliveryDay.deliveryDate)}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {stockItems.length} products
                            </Text>
                          </div>
                        </Group>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="teal"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyStockPlanning(
                                deliveryDay.deliveryDate,
                                deliveryDay.items
                              );
                            }}
                            title="Copy stock planning list"
                          >
                            <IconCopy size={14} />
                          </ActionIcon>
                          <Badge variant="light" color="teal">
                            {stockItems.length} items
                          </Badge>
                        </Group>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs">
                        {stockItems.map((item, index) => (
                          <Group key={index} justify="space-between" p="xs">
                            <Text size="sm" fw={500}>
                              {item.productName}
                            </Text>
                            <Badge variant="light" color="teal">
                              {item.displayQuantity}
                            </Badge>
                          </Group>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </ScrollArea>
        </Card>

        {/* Package Planning by Delivery Date */}
        <Card withBorder p="md" radius="md" style={{ minHeight: 500 }}>
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <Text fw={500} size="lg">
                Package Planning by Delivery Date
              </Text>
              <ThemeIcon color="violet" variant="light" size={32} radius="md">
                <IconPackage size={16} />
              </ThemeIcon>
            </Group>
          </Group>

          <ScrollArea style={{ height: 400 }}>
            <Accordion variant="separated">
              {data.itemsByDeliveryDate.map((deliveryDay) => (
                <Accordion.Item
                  key={`package-${deliveryDay.deliveryDate}`}
                  value={`package-${deliveryDay.deliveryDate}`}
                >
                  <Accordion.Control>
                    <Group justify="space-between">
                      <Group gap="sm">
                        <ThemeIcon
                          color="violet"
                          variant="light"
                          size={24}
                          radius="md"
                        >
                          <IconCalendar size={12} />
                        </ThemeIcon>
                        <div>
                          <Text fw={500} size="sm">
                            {formatDate(deliveryDay.deliveryDate)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {deliveryDay.items.reduce(
                              (sum, item) => sum + item.packageCount,
                              0
                            )}{' '}
                            packages
                          </Text>
                        </div>
                      </Group>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="violet"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyPackagePlanning(
                              deliveryDay.deliveryDate,
                              deliveryDay.items
                            );
                          }}
                          title="Copy package planning list"
                        >
                          <IconCopy size={14} />
                        </ActionIcon>
                        <Badge variant="light" color="violet">
                          {deliveryDay.items.reduce(
                            (sum, item) => sum + item.packageCount,
                            0
                          )}{' '}
                          packages
                        </Badge>
                      </Group>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      {/* Group items by product name */}
                      {Object.entries(
                        deliveryDay.items.reduce(
                          (acc, item) => {
                            if (!acc[item.productName]) {
                              acc[item.productName] = [];
                            }
                            acc[item.productName].push(item);
                            return acc;
                          },
                          {} as Record<string, typeof deliveryDay.items>
                        )
                      ).map(([productName, productItems]) => (
                        <div key={productName}>
                          <Text size="sm" fw={600} mb="xs">
                            {productName}:
                          </Text>
                          <Stack gap="xs" ml="md">
                            {productItems.map((item, index) => (
                              <Group
                                key={index}
                                justify="space-between"
                                p="xs"
                                style={{
                                  backgroundColor:
                                    'var(--mantine-color-gray-0)',
                                  borderRadius: 'var(--mantine-radius-sm)',
                                }}
                              >
                                <Text size="sm">
                                  {item.packageSize} {item.unit}
                                </Text>
                                <Badge variant="light" color="violet">
                                  {item.packageCount} packages
                                </Badge>
                              </Group>
                            ))}
                          </Stack>
                        </div>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ScrollArea>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};
