import React, { useState, useEffect } from 'react';
import { Stack, Grid } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateBuildingDto, UpdateBuildingDto } from '@shreehari/types';
import {
  useCreateBuilding,
  useUpdateBuilding,
  useBuilding,
  useSocieties,
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

interface BuildingFormData {
  societyId: string;
  name: string;
}

export const BuildingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id);
  const preSelectedSocietyId = searchParams.get('societyId');

  const [formData, setFormData] = useState<BuildingFormData>({
    societyId: preSelectedSocietyId || '',
    name: '',
  });

  const { data: societies } = useSocieties();
  const { data: building, loading: loadingBuilding } = useBuilding(id || '');
  const { createBuilding, loading: creating } = useCreateBuilding();
  const { updateBuilding, loading: updating } = useUpdateBuilding();

  const loading = creating || updating;

  // Load building data for editing
  useEffect(() => {
    if (isEditing && building) {
      setFormData({
        societyId: building.societyId,
        name: building.name,
      });
    }
  }, [isEditing, building]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const buildingData: CreateBuildingDto | UpdateBuildingDto = {
        societyId: formData.societyId,
        name: formData.name.trim(),
      };

      if (isEditing && id) {
        await updateBuilding(id, buildingData);
        notifications.show({
          title: 'Success',
          message: 'Building updated successfully',
          color: 'green',
        });
      } else {
        await createBuilding(buildingData as CreateBuildingDto);
        notifications.show({
          title: 'Success',
          message: 'Building created successfully',
          color: 'green',
        });
      }

      navigate('/buildings');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'create'} building`,
        color: 'red',
      });
    }
  };

  const handleCancel = () => {
    navigate('/buildings');
  };

  const handleReset = () => {
    setFormData({
      societyId: preSelectedSocietyId || '',
      name: '',
    });
  };

  const handleSaveAndAddAnother = async () => {
    try {
      const buildingData: CreateBuildingDto = {
        societyId: formData.societyId,
        name: formData.name.trim(),
      };

      await createBuilding(buildingData);
      notifications.show({
        title: 'Success',
        message: 'Building created successfully',
        color: 'green',
      });

      // Reset form for next building (keep societyId)
      setFormData((prev) => ({
        ...prev,
        name: '',
      }));
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create building',
        color: 'red',
      });
    }
  };

  const updateFormData = (field: keyof BuildingFormData, value: string) => {
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
      label: isEditing ? 'Update Building' : 'Save Building',
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

  if (isEditing && loadingBuilding) {
    return <div>Loading building...</div>;
  }

  return (
    <Stack gap="md">
      <PageHeader
        title={isEditing ? 'Edit Building' : 'Add New Building'}
        subtitle={
          isEditing
            ? 'Update building information'
            : 'Create a new building in a society'
        }
        actions={headerActions}
      />

      <Form
        title="Building Details"
        onSubmit={handleSubmit}
        actions={formActions}
        loading={loading}
        actionsPosition="right"
      >
        <Grid>
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
                onChange={(value) => updateFormData('societyId', value || '')}
                searchable
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <FormField>
              <TextInput
                label="Building Name/Number"
                placeholder="e.g., A, B, Tower 1, Block C"
                required
                value={formData.name}
                onChange={(event) =>
                  updateFormData('name', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>
        </Grid>
      </Form>
    </Stack>
  );
};
