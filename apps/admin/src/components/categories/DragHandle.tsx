import React from 'react';
import { ActionIcon } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';

interface DragHandleProps {
  disabled: boolean;
  listeners?: DraggableSyntheticListeners | undefined;
  attributes?: DraggableAttributes;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  disabled,
  listeners,
  attributes,
}) => {
  if (disabled) {
    return (
      <ActionIcon
        variant="subtle"
        color="gray"
        size="sm"
        aria-disabled="true"
        aria-label="Drag to reorder (unavailable while searching)"
        aria-describedby="category-list-keyboard-hint"
        style={{ opacity: 0.35, cursor: 'not-allowed', pointerEvents: 'none' }}
      >
        <IconGripVertical size={18} color="var(--mantine-color-gray-5)" />
      </ActionIcon>
    );
  }

  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      size="sm"
      aria-label="Drag to reorder"
      aria-describedby="category-list-keyboard-hint"
      style={{ cursor: 'grab' }}
      {...listeners}
      {...attributes}
    >
      <IconGripVertical size={18} color="var(--mantine-color-gray-5)" />
    </ActionIcon>
  );
};
