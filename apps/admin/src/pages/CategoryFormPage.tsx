import React, { useState, useEffect } from 'react';
import { Stack, Grid, FileInput, Box, Image, Text } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CreateCategoryDto, UpdateCategoryDto } from '@shreehari/types';
import {
  useCreateCategory,
  useUpdateCategory,
  useCategory,
} from '@shreehari/data-access';
import {
  Form,
  FormField,
  TextInput,
  PageHeader,
  type FormAction,
} from '@shreehari/ui';
import { getImageUrl } from '@shreehari/utils';

interface CategoryFormData {
  name: string;
  imageFile: File | null;
}

export const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    imageFile: null,
  });

  // API hooks
  const { createCategory, loading: createLoading } = useCreateCategory();
  const { updateCategory, loading: updateLoading } = useUpdateCategory();
  const { data: existingCategory, loading: fetchLoading } = useCategory(id || '');

  const loading = createLoading || updateLoading;

  // Pre-populate form in edit mode
  useEffect(() => {
    if (isEditing && existingCategory) {
      setFormData({ name: existingCategory.name, imageFile: null });
    }
  }, [isEditing, existingCategory]);

  const updateFormData = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Client-side 5 MB image size check
    if (formData.imageFile && formData.imageFile.size > 5 * 1024 * 1024) {
      notifications.show({
        title: 'Error',
        message: 'Image file size must be 5 MB or less',
        color: 'red',
      });
      return;
    }

    try {
      if (isEditing && id) {
        const updateData: UpdateCategoryDto = {
          name: formData.name,
        };
        await updateCategory(id, updateData, formData.imageFile);
        notifications.show({
          title: 'Success',
          message: 'Category updated successfully',
          color: 'green',
        });
      } else {
        const createData: CreateCategoryDto = {
          name: formData.name,
        };
        await createCategory(createData, formData.imageFile);
        notifications.show({
          title: 'Success',
          message: 'Category created successfully',
          color: 'green',
        });
      }

      navigate('/categories');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: isEditing
          ? 'Failed to update category'
          : 'Failed to create category',
        color: 'red',
      });
    }
  };

  // Form actions
  const formActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: () => navigate('/categories'),
      disabled: loading,
    },
    {
      label: isEditing ? 'Update Category' : 'Save Category',
      variant: 'brand',
      type: 'submit',
      loading: loading,
      onClick: () => {},
    },
  ];

  return (
    <Stack gap="md">
      <PageHeader
        title={isEditing ? 'Edit Category' : 'Add New Category'}
        subtitle={
          isEditing
            ? 'Update category information'
            : 'Create a new product category'
        }
      />

      <Form
        title="Category Details"
        onSubmit={handleSubmit}
        actions={formActions}
        loading={loading}
        actionsPosition="right"
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <FormField>
              <TextInput
                label="Category Name"
                placeholder="e.g. Fresh Vegetables"
                required
                maxLength={100}
                value={formData.name}
                onChange={(event) =>
                  updateFormData('name', event.currentTarget.value)
                }
              />
            </FormField>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <FormField>
              {isEditing &&
                existingCategory?.imageUrl &&
                !formData.imageFile && (
                  <Box mb="xs">
                    <Text size="sm" c="dimmed" mb={4}>
                      Current Image
                    </Text>
                    <Image
                      src={getImageUrl(existingCategory.imageUrl)}
                      w={80}
                      h={80}
                      radius="sm"
                      fit="contain"
                    />
                  </Box>
                )}
              <FileInput
                label="Category Image"
                placeholder="Upload category image (optional)"
                leftSection={<IconUpload size={14} />}
                accept="image/jpeg,image/png,image/webp,image/gif"
                clearable
                value={formData.imageFile}
                onChange={(file) => updateFormData('imageFile', file)}
              />
            </FormField>
          </Grid.Col>
        </Grid>
      </Form>
    </Stack>
  );
};
