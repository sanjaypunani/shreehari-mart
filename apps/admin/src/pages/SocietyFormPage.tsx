import React, { useState, useEffect } from 'react';
import { Stack, Grid } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateSocietyDto, UpdateSocietyDto } from '@shreehari/types';
import {
  useCreateSociety,
  useUpdateSociety,
  useSociety,
} from '@shreehari/data-access';
import {
  Form,
  FormField,
  TextInput,
  Textarea,
  PageHeader,
  type FormAction,
  type PageHeaderAction,
} from '@shreehari/ui';

interface SocietyFormData {
  name: string;
  address: string;
}

export const SocietyFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<SocietyFormData>({
    name: '',
    address: '',
  });

  const { data: society, loading: loadingSociety } = useSociety(id || '');
  const { createSociety, loading: creating } = useCreateSociety();
  const { updateSociety, loading: updating } = useUpdateSociety();

  const loading = creating || updating;

  // Load society data for editing
  useEffect(() => {
    if (isEditing && society) {
      setFormData({
        name: society.name,
        address: society.address,
      });
    }
  }, [isEditing, society]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const societyData: CreateSocietyDto | UpdateSocietyDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
      };

      if (isEditing && id) {
        await updateSociety(id, societyData);
        notifications.show({
          title: 'Success',
          message: 'Society updated successfully',
          color: 'green',
        });
      } else {
        await createSociety(societyData as CreateSocietyDto);
        notifications.show({
          title: 'Success',
          message: 'Society created successfully',
          color: 'green',
        });
      }

      navigate('/societies');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'create'} society`,
        color: 'red',
      });
    }
  };

  const handleCancel = () => {
    navigate('/societies');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      address: '',
    });
  };

  const handleSaveAndAddAnother = async () => {
    try {
      const societyData: CreateSocietyDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
      };

      await createSociety(societyData);
      notifications.show({
        title: 'Success',
        message: 'Society created successfully',
        color: 'green',
      });

      // Reset form for next society
      handleReset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create society',
        color: 'red',
      });
    }
  };

  const updateFormData = (field: keyof SocietyFormData, value: string) => {
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
      label: 'Reset',
      variant: 'light',
      onClick: handleReset,
      disabled: loading,
    },
    {
      label: isEditing ? 'Update Society' : 'Save Society',
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

  if (isEditing && loadingSociety) {
    return <div>Loading society...</div>;
  }

  return (
    <Stack gap="md">
      <PageHeader
        title={isEditing ? 'Edit Society' : 'Add New Society'}
        subtitle={
          isEditing
            ? 'Update society information'
            : 'Create a new housing society or complex'
        }
        actions={headerActions}
      />

      <Form
        title="Society Details"
        onSubmit={handleSubmit}
        actions={formActions}
        loading={loading}
        actionsPosition="right"
      >
        <Grid>
          <Grid.Col span={12}>
            <FormField>
              <TextInput
                label="Society Name"
                placeholder="Enter society name"
                required
                value={formData.name}
                onChange={(event) =>
                  updateFormData('name', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={12}>
            <FormField>
              <Textarea
                label="Society Address"
                placeholder="Enter complete address including area, city, state, and pin code"
                required
                minRows={3}
                maxRows={6}
                value={formData.address}
                onChange={(event) =>
                  updateFormData('address', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>
        </Grid>
      </Form>
    </Stack>
  );
};
