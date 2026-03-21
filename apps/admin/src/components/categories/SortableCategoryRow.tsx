import React from 'react';
import { Group, Image, Text, Badge, ActionIcon, Divider } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CategoryDto } from '@shreehari/types';
import { getImageUrl } from '@shreehari/utils';
import { DragHandle } from './DragHandle';

interface SortableCategoryRowProps {
  category: CategoryDto;
  isDndDisabled: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isLast: boolean;
}

export const SortableCategoryRow: React.FC<SortableCategoryRowProps> = ({
  category,
  isDndDisabled,
  isSaving,
  onEdit,
  onDelete,
  isLast,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const handleDisabled = isDndDisabled || isSaving;

  const rowStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    minHeight: '64px',
    padding: '8px 0',
    ...(isDragging
      ? {
          backgroundColor: 'var(--mantine-color-gray-1)',
          border: '1px dashed var(--mantine-color-gray-3)',
          borderRadius: '4px',
        }
      : {}),
  };

  const contentStyle: React.CSSProperties = isDragging
    ? { opacity: 0.4 }
    : {};

  return (
    <div ref={setNodeRef} role="listitem" style={rowStyle}>
      <div style={contentStyle}>
        <Group align="center" gap="md">
          {/* Drag handle - 32px */}
          <div style={{ width: 32, flexShrink: 0 }}>
            <DragHandle
              disabled={handleDisabled}
              listeners={listeners}
              attributes={attributes}
            />
          </div>

          {/* Image - 64px */}
          <div style={{ width: 64, flexShrink: 0 }}>
            <Image
              src={getImageUrl(category.imageUrl ?? null)}
              w={48}
              h={48}
              radius="sm"
              fallbackSrc="https://via.placeholder.com/48"
            />
          </div>

          {/* Name - flex grow */}
          <Text size="sm" fw={500} style={{ flex: 1 }}>
            {category.name}
          </Text>

          {/* Product count - 96px */}
          <div style={{ width: 96, flexShrink: 0 }}>
            <Badge variant="outline">{category.productCount ?? 0}</Badge>
          </div>

          {/* Actions - 80px */}
          <div
            style={{
              width: 80,
              flexShrink: 0,
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={onEdit}
              aria-label={`Edit ${category.name}`}
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={onDelete}
              disabled={isSaving}
              aria-label={`Delete ${category.name}`}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </div>
        </Group>
      </div>

      {!isLast && <Divider color="gray.2" mt={8} />}
    </div>
  );
};
