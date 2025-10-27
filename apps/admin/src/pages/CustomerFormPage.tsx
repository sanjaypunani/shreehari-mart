import React, { useState, useEffect } from 'react';
import { Stack, Grid, Switch } from '@mantine/core';
import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  AddressDto,
} from '@shreehari/types';
import {
  useCreateCustomer,
  useUpdateCustomer,
  useCustomer,
  useSocieties,
  useBuildings,
} from '@shreehari/data-access';
import {
  Form,
  FormField,
  TextInput,
  Select,
  PageHeader,
  type FormAction,
  type PageHeaderAction,
} from '@shreehari/ui';

interface CustomerFormData {
  societyId: string;
  buildingId: string;
  name: string;
  email: string;
  phone: string;
  mobileNumber: string;
  flatNumber: string;
  isMonthlyPayment: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const CustomerFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CustomerFormData>({
    societyId: '',
    buildingId: '',
    name: '',
    email: '',
    phone: '',
    mobileNumber: '',
    flatNumber: '',
    isMonthlyPayment: false,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
  });

  const { data: societies } = useSocieties();
  const { data: buildings } = useBuildings(formData.societyId || undefined);
  const { data: customer, loading: loadingCustomer } = useCustomer(id || '');
  const { createCustomer, loading: creating } = useCreateCustomer();
  const { updateCustomer, loading: updating } = useUpdateCustomer();

  const loading = creating || updating;

  // Load customer data for editing
  useEffect(() => {
    if (isEditing && customer) {
      setFormData({
        societyId: customer.societyId,
        buildingId: customer.buildingId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        mobileNumber: customer.mobileNumber,
        flatNumber: customer.flatNumber,
        isMonthlyPayment: customer.isMonthlyPayment,
        address: customer.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
        },
      });
    }
  }, [isEditing, customer]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const customerData: CreateCustomerDto | UpdateCustomerDto = {
        societyId: formData.societyId,
        buildingId: formData.buildingId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        mobileNumber: formData.mobileNumber,
        flatNumber: formData.flatNumber,
        isMonthlyPayment: formData.isMonthlyPayment,
        address: formData.address.street ? formData.address : undefined,
      };

      if (isEditing && id) {
        await updateCustomer(id, customerData);
        notifications.show({
          title: 'Success',
          message: 'Customer updated successfully',
          color: 'green',
        });
      } else {
        await createCustomer(customerData as CreateCustomerDto);
        notifications.show({
          title: 'Success',
          message: 'Customer created successfully',
          color: 'green',
        });
      }

      navigate('/customers');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'create'} customer`,
        color: 'red',
      });
    }
  };

  const handleCancel = () => {
    navigate('/customers');
  };

  const handleReset = () => {
    setFormData({
      societyId: '',
      buildingId: '',
      name: '',
      email: '',
      phone: '',
      mobileNumber: '',
      flatNumber: '',
      isMonthlyPayment: false,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
    });
  };

  const handleSaveAndAddAnother = async () => {
    try {
      const customerData: CreateCustomerDto = {
        societyId: formData.societyId,
        buildingId: formData.buildingId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        flatNumber: formData.flatNumber.trim(),
        isMonthlyPayment: formData.isMonthlyPayment,
        address: formData.address,
      };

      await createCustomer(customerData);
      notifications.show({
        title: 'Success',
        message: 'Customer created successfully',
        color: 'green',
      });

      // Reset form for next customer (keep society and building selection)
      setFormData((prev) => ({
        ...prev,
        name: '',
        email: '',
        phone: '',
        mobileNumber: '',
        flatNumber: '',
        address: {
          ...prev.address,
          street: '',
        },
      }));
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create customer',
        color: 'red',
      });
    }
  };

  const updateFormData = (
    field: keyof CustomerFormData | string,
    value: any
  ) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1] as keyof AddressDto;
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle society change to reset building
  const handleSocietyChange = (value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      societyId: value || '',
      buildingId: '', // Reset building when society changes
    }));
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
      label: isEditing ? 'Update Customer' : 'Save Customer',
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

  if (isEditing && loadingCustomer) {
    return <div>Loading customer...</div>;
  }

  return (
    <Stack gap="md">
      <PageHeader
        title={isEditing ? 'Edit Customer' : 'Add New Customer'}
        subtitle={
          isEditing
            ? 'Update customer information'
            : 'Create a new customer in your system'
        }
        actions={headerActions}
      />

      <Form
        title="Customer Details"
        onSubmit={handleSubmit}
        actions={formActions}
        loading={loading}
        actionsPosition="right"
      >
        <Grid>
          {/* Basic Information */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Full Name"
                placeholder="Enter customer full name"
                required
                value={formData.name}
                onChange={(event) =>
                  updateFormData('name', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Email Address"
                placeholder="customer@example.com"
                type="email"
                required
                value={formData.email}
                onChange={(event) =>
                  updateFormData('email', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Mobile Number"
                placeholder="9876543210"
                required
                value={formData.mobileNumber}
                onChange={(event) =>
                  updateFormData('mobileNumber', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Phone Number (Optional)"
                placeholder="+91-22-12345678"
                value={formData.phone}
                onChange={(event) =>
                  updateFormData('phone', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          {/* Location Information */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <Select
                label="Society"
                placeholder="Select society"
                required
                data={
                  societies?.map((society) => ({
                    value: society.id,
                    label: society.name,
                  })) || []
                }
                value={formData.societyId}
                onChange={handleSocietyChange}
                searchable
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <Select
                label="Building"
                placeholder="Select building"
                required
                data={
                  buildings?.map((building) => ({
                    value: building.id,
                    label: `Building ${building.name}`,
                  })) || []
                }
                value={formData.buildingId}
                onChange={(value) => updateFormData('buildingId', value || '')}
                disabled={!formData.societyId}
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Flat Number"
                placeholder="A-101"
                required
                value={formData.flatNumber}
                onChange={(event) =>
                  updateFormData('flatNumber', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <Switch
                label="Monthly Payment Plan"
                description="Enable for customers who pay monthly instead of per order"
                checked={formData.isMonthlyPayment}
                onChange={(event) =>
                  updateFormData(
                    'isMonthlyPayment',
                    event.currentTarget.checked
                  )
                }
              />
            </FormField>
          </Grid.Col>

          {/* Address Information */}
          <Grid.Col span={12}>
            <FormField>
              <TextInput
                label="Street Address (Optional)"
                placeholder="123 Main Street"
                value={formData.address.street}
                onChange={(event) =>
                  updateFormData('address.street', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="City"
                placeholder="Mumbai"
                value={formData.address.city}
                onChange={(event) =>
                  updateFormData('address.city', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="State"
                placeholder="Maharashtra"
                value={formData.address.state}
                onChange={(event) =>
                  updateFormData('address.state', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="ZIP Code"
                placeholder="400001"
                value={formData.address.zipCode}
                onChange={(event) =>
                  updateFormData('address.zipCode', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Country"
                placeholder="India"
                value={formData.address.country}
                onChange={(event) =>
                  updateFormData('address.country', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>
        </Grid>
      </Form>
    </Stack>
  );
};
