import React, { useState, useEffect, useMemo } from 'react';
import {
  Stack,
  Grid,
  Group,
  Text,
  Notification,
  Card,
  Divider,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconDeviceFloppy,
  IconX,
  IconCheck,
  IconExclamationMark,
  IconPlus,
  IconTrash,
  IconCalendar,
  IconCurrencyRupee,
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageHeader,
  Button,
  Select,
  NumberInput,
  Textarea,
  type PageHeaderAction,
} from '@shreehari/ui';
import { OrderDto, UpdateOrderDto } from '@shreehari/types';
import {
  useCreateOrder,
  useCustomers,
  useProducts,
  useOrder,
  useUpdateOrder,
} from '@shreehari/data-access';

interface OrderItem {
  productId: string;
  orderedQuantity: number;
  unit: 'gm' | 'kg' | 'pc';
}

export const OrderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [customerId, setCustomerId] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: '', orderedQuantity: 1, unit: 'pc' },
  ]);
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // API hooks
  const {
    createOrder,
    loading: createLoading,
    error: createError,
  } = useCreateOrder();
  const { updateOrder, loading: updateLoading } = useUpdateOrder();
  const { data: existingOrder, loading: orderLoading } = useOrder(id || '');
  const { data: customersData, loading: customersLoading } = useCustomers(
    1,
    100
  );
  const { data: productsData, loading: productsLoading } = useProducts(1, 100);

  const loading = createLoading || updateLoading;

  const customers = customersData?.data || [];
  const products = productsData?.products || [];

  // Load existing order data for editing
  useEffect(() => {
    if (isEditing && existingOrder) {
      setCustomerId(existingOrder.customerId);
      // Note: OrderDto might not have notes property, handle gracefully
      setNotes((existingOrder as any).notes || '');
      setDeliveryDate((existingOrder as any).deliveryDate || null);
      setDiscount((existingOrder as any).discount || 0);

      // Convert existing order items to form format
      if (existingOrder.items && existingOrder.items.length > 0) {
        const formattedItems = existingOrder.items.map((item) => ({
          productId: item.productId,
          orderedQuantity: item.orderedQuantity || item.quantity || 1,
          unit: item.unit || ('pc' as 'gm' | 'kg' | 'pc'),
        }));
        setOrderItems(formattedItems);
      }
    }
  }, [isEditing, existingOrder]);

  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: `${customer.flatNumber} - ${customer.society?.name} ${customer.mobileNumber}-${customer.name}  `,
  }));

  const productOptions = products.map((product) => ({
    value: product.id,
    label: `${product.name} - ₹${product.price} per ${product.quantity}${product.unit}`,
  }));

  const unitOptions = [
    { value: 'gm', label: 'Grams' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'pc', label: 'Pieces' },
  ];

  // Calculate item price based on quantity and unit
  const calculateItemPrice = (
    orderedQuantity: number,
    unit: 'gm' | 'kg' | 'pc',
    productPrice: number,
    productQuantity: number,
    productUnit: 'gm' | 'kg' | 'pc'
  ): number => {
    // Convert ordered quantity to the same unit as product pricing
    let normalizedOrderedQuantity: number;

    // Handle unit conversion
    if (productUnit === 'kg' && unit === 'gm') {
      // Product is priced per kg, but ordered in grams
      normalizedOrderedQuantity = orderedQuantity / 1000;
    } else if (productUnit === 'gm' && unit === 'kg') {
      // Product is priced per gram, but ordered in kg
      normalizedOrderedQuantity = orderedQuantity * 1000;
    } else if (productUnit === unit) {
      // Same units, no conversion needed
      normalizedOrderedQuantity = orderedQuantity;
    } else if (productUnit === 'pc' || unit === 'pc') {
      // For pieces, use direct quantity
      normalizedOrderedQuantity = orderedQuantity;
    } else {
      // Fallback for any other cases
      normalizedOrderedQuantity = orderedQuantity;
    }

    // Calculate price per unit of the product
    const pricePerUnit = productPrice / productQuantity;

    return normalizedOrderedQuantity * pricePerUnit;
  };

  // Calculate order totals
  const orderTotals = useMemo(() => {
    let subtotal = 0;

    const itemTotals = orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || !item.productId || item.orderedQuantity <= 0) {
        return { item, price: 0 };
      }

      const price = calculateItemPrice(
        item.orderedQuantity,
        item.unit,
        product.price,
        product.quantity,
        product.unit
      );

      subtotal += price;
      return { item, price };
    });

    const discountAmount = Math.min(discount, subtotal);
    const total = Math.max(0, subtotal - discountAmount);

    return {
      itemTotals,
      subtotal,
      discountAmount,
      total,
    };
  }, [orderItems, products, discount]);

  // Auto-adjust discount if it exceeds subtotal
  useEffect(() => {
    if (discount > orderTotals.subtotal && orderTotals.subtotal > 0) {
      setDiscount(orderTotals.subtotal);
    }
  }, [orderTotals.subtotal, discount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customerId) {
      setNotification({ type: 'error', message: 'Please select a customer' });
      return;
    }

    if (!deliveryDate) {
      setNotification({
        type: 'error',
        message: 'Please select a delivery date',
      });
      return;
    }

    const validItems = orderItems.filter(
      (item) => item.productId && item.orderedQuantity > 0
    );
    if (validItems.length === 0) {
      setNotification({
        type: 'error',
        message: 'Please add at least one valid item',
      });
      return;
    }

    try {
      if (isEditing && id) {
        // For updates, use the new structure that supports updating items
        await updateOrder(id, {
          deliveryDate: deliveryDate,
          discount: discount > 0 ? discount : undefined,
          notes: notes || undefined,
          items: validItems,
        } as UpdateOrderDto);

        setNotification({
          type: 'success',
          message: 'Order updated successfully!',
        });

        // Navigate back to orders list after successful update
        setTimeout(() => navigate('/orders'), 1500);
      } else {
        await createOrder({
          customerId,
          items: validItems,
          notes: notes || undefined,
          deliveryDate: deliveryDate,
          discount: discount > 0 ? discount : undefined,
        } as any);

        setNotification({
          type: 'success',
          message: 'Order created successfully!',
        });

        // Reset form for new order
        setCustomerId('');
        setDeliveryDate(null);
        setDiscount(0);
        setOrderItems([{ productId: '', orderedQuantity: 1, unit: 'pc' }]);
        setNotes('');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to ${isEditing ? 'update' : 'create'} order: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { productId: '', orderedQuantity: 1, unit: 'pc' },
    ]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      const newItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(newItems);
    }
  };

  const updateOrderItem = (index: number, updates: Partial<OrderItem>) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], ...updates };
    setOrderItems(newItems);
  };

  const handleSelectOrderItemAndDefaultUnit = (
    value: string | null,
    index: number
  ) => {
    const product = products.find((p) => p.id === value);

    // Update multiple fields at once
    updateOrderItem(index, {
      productId: value || '',
      unit: product ? product.unit : 'gm',
      orderedQuantity: product?.quantity,
      // You can also set default quantity based on product if needed
      // orderedQuantity: product ? product.quantity : 1
    });
  };

  // Header actions
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      leftSection: <IconX size={16} />,
      onClick: handleCancel,
    },
  ];

  return (
    <Stack gap="md">
      <PageHeader
        title={isEditing ? 'Edit Order' : 'Create New Order'}
        subtitle={
          isEditing
            ? 'Update order information'
            : 'Create a new order for a customer'
        }
        actions={headerActions}
      />

      {notification && (
        <Notification
          icon={
            notification.type === 'success' ? (
              <IconCheck size={18} />
            ) : (
              <IconExclamationMark size={18} />
            )
          }
          color={notification.type === 'success' ? 'teal' : 'red'}
          title={notification.type === 'success' ? 'Success' : 'Error'}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Notification>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <Card withBorder p="md">
            <Text fw={500} mb="md">
              Customer Information
            </Text>
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Select
                  label="Customer"
                  placeholder="Select a customer"
                  data={customerOptions}
                  value={customerId}
                  onChange={(value) => setCustomerId(value || '')}
                  searchable
                  required
                  disabled={customersLoading}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <DatePickerInput
                  label="Delivery Date"
                  placeholder="Select delivery date"
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                  leftSection={<IconCalendar size={16} />}
                  required
                  minDate={new Date()}
                />
              </Grid.Col>
            </Grid>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="md">
              <Text fw={500}>Order Items</Text>
              <Button
                size="sm"
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={addOrderItem}
              >
                Add Item
              </Button>
            </Group>

            <Stack gap="md">
              {orderItems.map((item, index) => (
                <Card key={index} withBorder p="sm" bg="gray.0">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 5 }}>
                      <Select
                        label="Product"
                        placeholder="Select a product"
                        data={productOptions}
                        value={item.productId}
                        onChange={(value) => {
                          handleSelectOrderItemAndDefaultUnit(value, index);
                        }}
                        searchable
                        required
                        disabled={productsLoading}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, md: 2 }}>
                      <NumberInput
                        label="Quantity"
                        placeholder="1"
                        value={item.orderedQuantity}
                        onChange={(value) =>
                          updateOrderItem(index, {
                            orderedQuantity:
                              typeof value === 'number' ? value : 1,
                          })
                        }
                        min={1}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, md: 3 }}>
                      <Select
                        label="Unit"
                        data={unitOptions}
                        value={item.unit}
                        onChange={(value) =>
                          updateOrderItem(index, {
                            unit: value as 'gm' | 'kg' | 'pc',
                          })
                        }
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 2 }}>
                      <Group justify="end" mt="xl">
                        <Button
                          size="sm"
                          variant="outline"
                          color="red"
                          onClick={() => removeOrderItem(index)}
                          disabled={orderItems.length === 1}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </Stack>
          </Card>

          <Card withBorder p="md">
            <Text fw={500} mb="md">
              Additional Information
            </Text>
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Textarea
                  label="Notes"
                  placeholder="Enter any special instructions or notes"
                  value={notes}
                  onChange={(event) => setNotes(event.currentTarget.value)}
                  minRows={3}
                  maxRows={6}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <NumberInput
                  label="Discount"
                  placeholder="0.00"
                  value={discount}
                  onChange={(value) => {
                    const newValue = Number(value);
                    setDiscount(typeof newValue === 'number' ? newValue : 0);
                  }}
                  leftSection={<IconCurrencyRupee size={16} />}
                  min={0}
                  max={
                    orderTotals.subtotal > 0 ? orderTotals.subtotal : undefined
                  }
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  description={
                    orderTotals.subtotal > 0
                      ? `Maximum: ₹${orderTotals.subtotal.toFixed(2)}`
                      : undefined
                  }
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Order Summary */}
          <Card withBorder p="md" bg="gray.0">
            <Group justify="space-between" mb="md">
              <Text fw={500}>Order Summary</Text>
              <Text size="sm" c="dimmed">
                {orderTotals.itemTotals.filter(({ price }) => price > 0).length}{' '}
                items
              </Text>
            </Group>

            <Stack gap="xs">
              {orderTotals.itemTotals.map(({ item, price }, index) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product || !item.productId || price === 0) return null;

                return (
                  <Group key={index} justify="space-between" gap="xs">
                    <Text size="sm" style={{ flex: 1 }}>
                      {product.name} × {item.orderedQuantity}
                      {item.unit}
                    </Text>
                    <Text size="sm" fw={500}>
                      ₹{price.toFixed(2)}
                    </Text>
                  </Group>
                );
              })}

              {orderTotals.subtotal > 0 && (
                <>
                  <Divider />
                  <Group justify="space-between">
                    <Text fw={500}>Subtotal</Text>
                    <Text fw={500}>₹{orderTotals.subtotal.toFixed(2)}</Text>
                  </Group>

                  {discount > 0 && (
                    <Group justify="space-between">
                      <Text c="red" fw={500}>
                        Discount
                      </Text>
                      <Text c="red" fw={500}>
                        -₹{orderTotals.discountAmount.toFixed(2)}
                      </Text>
                    </Group>
                  )}

                  <Divider />
                  <Group justify="space-between">
                    <Text fw={700} size="lg">
                      Total
                    </Text>
                    <Text fw={700} size="lg" c="blue">
                      ₹{orderTotals.total.toFixed(2)}
                    </Text>
                  </Group>
                </>
              )}

              {orderTotals.subtotal === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  Add items to see order total
                </Text>
              )}
            </Stack>
          </Card>

          <Group justify="end">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              leftSection={<IconDeviceFloppy size={16} />}
              loading={loading}
            >
              {isEditing ? 'Update Order' : 'Create Order'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default OrderFormPage;
