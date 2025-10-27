import React, { useState, useEffect } from 'react';
import { Stack, Grid, FileInput, Switch } from '@mantine/core';
import { IconUpload, IconDeviceFloppy } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateProductDto, UpdateProductDto } from '@shreehari/types';
import {
  useCreateProduct,
  useUpdateProduct,
  useProduct,
} from '@shreehari/data-access';
import {
  Form,
  FormField,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  PageHeader,
  type FormAction,
  type PageHeaderAction,
} from '@shreehari/ui';

interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  unit: 'gm' | 'kg' | 'pc';
  description: string;
  isAvailable: boolean;
  imageFile: File | null;
}

export const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    quantity: 1,
    unit: 'kg',
    description: '',
    isAvailable: true,
    imageFile: null,
  });

  // API hooks
  const {
    createProduct,
    loading: createLoading,
    error: createError,
  } = useCreateProduct();
  const {
    updateProduct,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProduct();
  const { data: existingProduct, loading: fetchLoading } = useProduct(id || '');

  const loading = createLoading || updateLoading;

  // Load existing product data when editing
  useEffect(() => {
    if (isEditing && existingProduct) {
      setFormData({
        name: existingProduct.name,
        price: existingProduct.price,
        quantity: existingProduct.quantity,
        unit: existingProduct.unit,
        description: existingProduct.description || '',
        isAvailable: existingProduct.isAvailable,
        imageFile: null, // Can't load existing file
      });
    }
  }, [isEditing, existingProduct]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (isEditing && id) {
        const updateData: UpdateProductDto = {
          name: formData.name,
          price: formData.price,
          quantity: formData.quantity,
          unit: formData.unit,
          description: formData.description || undefined,
          isAvailable: formData.isAvailable,
        };
        await updateProduct(id, updateData, formData.imageFile);
        notifications.show({
          title: 'Success',
          message: 'Product updated successfully',
          color: 'green',
        });
      } else {
        const createData: CreateProductDto = {
          name: formData.name,
          price: formData.price,
          quantity: formData.quantity,
          unit: formData.unit,
          description: formData.description || undefined,
        };
        await createProduct(createData, formData.imageFile);
        notifications.show({
          title: 'Success',
          message: 'Product created successfully',
          color: 'green',
        });
      }

      navigate('/products');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: isEditing
          ? 'Failed to update product'
          : 'Failed to create product',
        color: 'red',
      });
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      price: 0,
      quantity: 1,
      unit: 'kg',
      description: '',
      isAvailable: true,
      imageFile: null,
    });
  };

  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndAddAnother = async () => {
    try {
      const productData: CreateProductDto = {
        name: formData.name,
        price: formData.price,
        quantity: formData.quantity,
        unit: formData.unit,
        description: formData.description || undefined,
      };

      await createProduct(productData, formData.imageFile);
      notifications.show({
        title: 'Success',
        message: 'Product created successfully',
        color: 'green',
      });

      // Reset form for next product
      handleReset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create product',
        color: 'red',
      });
    }
  };

  // Form actions
  const formActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: handleCancel,
      disabled: loading,
    },
    {
      label: 'Reset',
      variant: 'light',
      onClick: handleReset,
      disabled: loading,
    },
    {
      label: isEditing ? 'Update Product' : 'Save Product',
      variant: 'brand',
      type: 'submit',
      loading: loading,
      onClick: () => {}, // Handled by form onSubmit
    },
  ];

  // Header actions
  const headerActions: PageHeaderAction[] = !isEditing
    ? [
        {
          label: 'Save & Add Another',
          variant: 'outline',
          leftSection: <IconDeviceFloppy size={16} />,
          onClick: handleSaveAndAddAnother,
          disabled: loading,
        },
      ]
    : [];

  return (
    <Stack gap="md">
      <PageHeader
        title={isEditing ? 'Edit Product' : 'Add New Product'}
        subtitle={
          isEditing
            ? 'Update product information'
            : 'Create a new product in your inventory'
        }
        actions={headerActions}
      />

      <Form
        title="Product Details"
        onSubmit={handleSubmit}
        actions={formActions}
        loading={loading}
        actionsPosition="right"
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <FormField>
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                required
                value={formData.name}
                onChange={(event) =>
                  updateFormData('name', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <FormField>
              <NumberInput
                label="Price"
                placeholder="0.00"
                min={0}
                decimalScale={2}
                fixedDecimalScale
                prefix="₹"
                required
                value={formData.price}
                onChange={(value) => updateFormData('price', value)}
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <FormField>
              <NumberInput
                label="Quantity"
                placeholder="1"
                min={1}
                required
                value={formData.quantity}
                onChange={(value) => updateFormData('quantity', value)}
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <FormField>
              <Select
                label="Unit"
                placeholder="Select unit"
                required
                data={[
                  { value: 'gm', label: 'Gram (gm)' },
                  { value: 'kg', label: 'Kilogram (kg)' },
                  { value: 'pc', label: 'Piece (pc)' },
                ]}
                value={formData.unit}
                onChange={(value) =>
                  updateFormData('unit', value as 'gm' | 'kg' | 'pc')
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={12}>
            <FormField>
              <Textarea
                label="Product Description"
                placeholder="Describe the product features and benefits..."
                minRows={3}
                maxRows={6}
                required
                value={formData.description}
                onChange={(event) =>
                  updateFormData('description', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <FormField>
              <FileInput
                label="Product Image"
                placeholder="Upload product image"
                leftSection={<IconUpload size={14} />}
                accept="image/*"
                value={formData.imageFile}
                onChange={(file) => updateFormData('imageFile', file)}
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            {isEditing && (
              <FormField>
                <Switch
                  label="Available Product"
                  description="Product is available for purchase"
                  checked={formData.isAvailable}
                  onChange={(event) =>
                    updateFormData('isAvailable', event.currentTarget.checked)
                  }
                />
              </FormField>
            )}
          </Grid.Col>
        </Grid>
      </Form>
    </Stack>
  );
};
