import React from 'react';
import { Group, Pagination, Text, Select, Stack } from '@mantine/core';

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showSizeSelector?: boolean;
  sizeOptions?: { value: string; label: string }[];
  loading?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  showSizeSelector = true,
  sizeOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
  ],
  loading = false,
}) => {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  if (total === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Showing {startItem} to {endItem} of {total} results
        </Text>

        {showSizeSelector && onLimitChange && (
          <Select
            size="sm"
            value={limit.toString()}
            onChange={(value) => onLimitChange(parseInt(value || '20'))}
            data={sizeOptions}
            disabled={loading}
            w={150}
          />
        )}
      </Group>

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={page}
            onChange={onPageChange}
            total={totalPages}
            disabled={loading}
            size="sm"
            boundaries={1}
            siblings={1}
          />
        </Group>
      )}
    </Stack>
  );
};
