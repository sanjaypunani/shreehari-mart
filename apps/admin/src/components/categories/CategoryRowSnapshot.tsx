import React from 'react';
import { Group, Image, Text, Badge, ActionIcon } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { CategoryDto } from '@shreehari/types';
import { getImageUrl } from '@shreehari/utils';

interface CategoryRowSnapshotProps {
  category: CategoryDto;
}

export const CategoryRowSnapshot: React.FC<CategoryRowSnapshotProps> = ({
  category,
}) => {
  return (
    <div
      style={{
        background: 'white',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        borderRadius: '8px',
        padding: '12px 16px',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Group align="center" gap="md" style={{ width: '100%' }}>
        {/* Drag handle placeholder */}
        <div style={{ width: 32, flexShrink: 0 }} />

        {/* Image */}
        <Image
          src={getImageUrl(category.imageUrl ?? null)}
          w={48}
          h={48}
          radius="sm"
          fallbackSrc="https://via.placeholder.com/48"
          style={{ flexShrink: 0 }}
        />

        {/* Name */}
        <Text size="sm" fw={500} style={{ flex: 1 }}>
          {category.name}
        </Text>

        {/* Product count */}
        <div style={{ width: 96, flexShrink: 0 }}>
          <Badge variant="outline">{category.productCount ?? 0}</Badge>
        </div>

        {/* Actions placeholder */}
        <div style={{ width: 80, flexShrink: 0, display: 'flex', gap: 4 }}>
          <ActionIcon variant="subtle" color="gray" size="sm" tabIndex={-1}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" size="sm" tabIndex={-1}>
            <IconTrash size={16} />
          </ActionIcon>
        </div>
      </Group>
    </div>
  );
};
