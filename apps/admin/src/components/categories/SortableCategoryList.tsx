import React, { useState, useEffect } from 'react';
import { Card, LoadingOverlay, VisuallyHidden } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { CategoryDto } from '@shreehari/types';
import { SortableCategoryRow } from './SortableCategoryRow';
import { CategoryRowSnapshot } from './CategoryRowSnapshot';

interface SortableCategoryListProps {
  categories: CategoryDto[];
  onReorder: (ids: string[]) => Promise<void>;
  loading: boolean;
  isDndDisabled: boolean;
  onEdit: (id: string) => void;
  onDelete: (category: CategoryDto) => void;
}

export const SortableCategoryList: React.FC<SortableCategoryListProps> = ({
  categories,
  onReorder,
  loading,
  isDndDisabled,
  onEdit,
  onDelete,
}) => {
  const [localOrder, setLocalOrder] = useState<CategoryDto[]>(categories);
  const [preReorderSnapshot, setPreReorderSnapshot] = useState<CategoryDto[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync from prop only when not dragging or saving
  useEffect(() => {
    if (activeId === null && !isSaving) {
      setLocalOrder(categories);
    }
  }, [categories, activeId, isSaving]);

  const activeSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const disabledSensors = useSensors(); // empty — no drag initiation allowed

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // No-op: dropped outside a droppable area or on the same position
    if (over === null || active.id === over.id) return;

    const oldIndex = localOrder.findIndex((c) => c.id === active.id);
    const newIndex = localOrder.findIndex((c) => c.id === over.id);

    const snapshot = [...localOrder];
    setPreReorderSnapshot(snapshot);

    const newOrder = arrayMove(localOrder, oldIndex, newIndex);
    setLocalOrder(newOrder); // optimistic update
    setIsSaving(true);

    try {
      await onReorder(newOrder.map((c) => c.id));
      setPreReorderSnapshot([]);
    } catch (err) {
      // Rollback
      setLocalOrder(snapshot);
      setPreReorderSnapshot([]);

      const message = err instanceof Error ? err.message : '';
      const isStaleList =
        message.includes('does not match') || message.includes('non-empty');

      notifications.show({
        title: 'Reorder failed',
        message: isStaleList
          ? 'Category list has changed. Please refresh the page and try again.'
          : 'Could not save the new order. The list has been restored.',
        color: 'red',
        autoClose: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const activeCategory = activeId
    ? localOrder.find((c) => c.id === activeId) ?? null
    : null;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ position: 'relative' }}
    >
      <LoadingOverlay visible={loading || isSaving} />

      <VisuallyHidden id="category-list-keyboard-hint">
        Press Space or Enter to pick up an item, use arrow keys to move it, and
        press Space or Enter again to drop it. Press Escape to cancel.
      </VisuallyHidden>

      <DndContext
        sensors={isDndDisabled || isSaving ? disabledSensors : activeSensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localOrder.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            role="list"
            aria-label="Categories list, drag to reorder"
            aria-describedby="category-list-keyboard-hint"
          >
            {localOrder.map((category, index) => (
              <SortableCategoryRow
                key={category.id}
                category={category}
                isDndDisabled={isDndDisabled}
                isSaving={isSaving}
                onEdit={() => onEdit(category.id)}
                onDelete={() => onDelete(category)}
                isLast={index === localOrder.length - 1}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCategory ? (
            <CategoryRowSnapshot category={activeCategory} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
};
