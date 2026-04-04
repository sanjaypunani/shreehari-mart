import React, { useState, useEffect } from 'react';
import { Stack, Grid, Switch } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import {
  useDeliveryPartner,
  useCreateDeliveryPartner,
  useUpdateDeliveryPartner,
} from '@shreehari/data-access';
import {
  Form,
  FormField,
  TextInput,
  PageHeader,
  type FormAction,
} from '@shreehari/ui';

interface DeliveryPartnerFormData {
  name: string;
  mobileNumber: string;
  isActive: boolean;
}

export function DeliveryPartnerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<DeliveryPartnerFormData>({
    name: '',
    mobileNumber: '',
    isActive: true,
  });

  const { data: partner, loading: loadingPartner } = useDeliveryPartner(
    id || ''
  );
  const { createDeliveryPartner, loading: creating } =
    useCreateDeliveryPartner();
  const { updateDeliveryPartner, loading: updating } =
    useUpdateDeliveryPartner();

  const loading = creating || updating;

  // Load partner data for editing
  useEffect(() => {
    if (isEditMode && partner) {
      setFormData({
        name: partner.name,
        mobileNumber: partner.mobileNumber,
        isActive: partner.isActive,
      });
    }
  }, [isEditMode, partner]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Name is required',
        color: 'red',
      });
      return;
    }

    if (!formData.mobileNumber.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Mobile number is required',
        color: 'red',
      });
      return;
    }

    try {
      const partnerData = {
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        isActive: formData.isActive,
      };

      if (isEditMode && id) {
        await updateDeliveryPartner(id, partnerData);
        notifications.show({
          title: 'Success',
          message: 'Delivery partner updated successfully',
          color: 'green',
        });
      } else {
        await createDeliveryPartner(partnerData);
        notifications.show({
          title: 'Success',
          message: 'Delivery partner created successfully',
          color: 'green',
        });
      }

      navigate('/delivery-partners');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${isEditMode ? 'update' : 'create'} delivery partner`,
        color: 'red',
      });
    }
  };

  const handleCancel = () => {
    navigate('/delivery-partners');
  };

  const updateField = (
    field: keyof DeliveryPartnerFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      label: isEditMode ? 'Update Delivery Partner' : 'Save Delivery Partner',
      variant: 'brand',
      type: 'submit',
      loading: loading,
      onClick: () => {}, // Handled by form onSubmit
    },
  ];

  if (isEditMode && loadingPartner) {
    return <div>Loading delivery partner...</div>;
  }

  return (
    <Stack gap="md">
      <PageHeader
        title={isEditMode ? 'Edit Delivery Partner' : 'Add Delivery Partner'}
        subtitle={
          isEditMode
            ? 'Update delivery partner details'
            : 'Create a new delivery partner'
        }
      />

      <Form
        title="Delivery Partner Details"
        onSubmit={handleSubmit}
        actions={formActions}
        loading={loading}
        actionsPosition="right"
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Name"
                placeholder="Enter partner name"
                required
                value={formData.name}
                onChange={(event) =>
                  updateField('name', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Mobile Number"
                placeholder="Enter mobile number"
                required
                value={formData.mobileNumber}
                onChange={(event) =>
                  updateField('mobileNumber', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <Switch
                label="Active"
                description="Inactive partners will not appear in order assignment dropdowns"
                checked={formData.isActive}
                onChange={(event) =>
                  updateField('isActive', event.currentTarget.checked)
                }
              />
            </FormField>
          </Grid.Col>
        </Grid>
      </Form>
    </Stack>
  );
}
