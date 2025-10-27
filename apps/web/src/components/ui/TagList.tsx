import { Group, GroupProps } from '@mantine/core';
import { ReactNode } from 'react';
import { Chip } from './Chip';

export interface TagListProps extends Omit<GroupProps, 'children'> {
  tags: string[] | { label: string; value: string; color?: string }[];
  onRemove?: (tag: string | { label: string; value: string }) => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  removable?: boolean;
}

export function TagList({
  tags,
  onRemove,
  variant = 'primary',
  size = 'sm',
  removable = false,
  ...props
}: TagListProps) {
  return (
    <Group gap="xs" {...props}>
      {tags.map((tag, index) => {
        const isString = typeof tag === 'string';
        const label = isString ? tag : tag.label;
        const value = isString ? tag : tag.value;

        return (
          <Chip
            key={value}
            variant={variant}
            size={size}
            removable={removable}
            onRemove={onRemove ? () => onRemove(tag) : undefined}
          >
            {label}
          </Chip>
        );
      })}
    </Group>
  );
}
