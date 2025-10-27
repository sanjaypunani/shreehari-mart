import React, { ReactNode } from 'react';
import {
  Group,
  TextInput,
  Select,
  Button,
  Card,
  Stack,
  Collapse,
  ActionIcon,
} from '@mantine/core';
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: any;
}

export interface SearchFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onFilterChange?: (key: string, value: any) => void;
  onClearFilters?: () => void;
  onApplyFilters?: () => void;
  showFilterToggle?: boolean;
  filtersExpanded?: boolean;
  onToggleFilters?: (expanded: boolean) => void;
  children?: ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  showFilterToggle = true,
  filtersExpanded = false,
  onToggleFilters,
  children,
  spacing = 'md',
}) => {
  const hasActiveFilters = filters.some(
    (filter) => filter.value && filter.value !== ''
  );

  const handleClearFilters = () => {
    filters.forEach((filter) => {
      if (onFilterChange) {
        onFilterChange(filter.key, '');
      }
    });
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const renderFilterInput = (filter: FilterOption) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            key={filter.key}
            label={filter.label}
            placeholder={filter.placeholder}
            data={filter.options || []}
            value={filter.value}
            onChange={(value) => onFilterChange?.(filter.key, value)}
            clearable
          />
        );
      case 'text':
        return (
          <TextInput
            key={filter.key}
            label={filter.label}
            placeholder={filter.placeholder}
            value={filter.value || ''}
            onChange={(event) =>
              onFilterChange?.(filter.key, event.currentTarget.value)
            }
          />
        );
      case 'number':
        return (
          <TextInput
            key={filter.key}
            label={filter.label}
            placeholder={filter.placeholder}
            type="number"
            value={filter.value || ''}
            onChange={(event) =>
              onFilterChange?.(filter.key, event.currentTarget.value)
            }
          />
        );
      case 'date':
        return (
          <TextInput
            key={filter.key}
            label={filter.label}
            placeholder={filter.placeholder}
            type="date"
            value={filter.value || ''}
            onChange={(event) =>
              onFilterChange?.(filter.key, event.currentTarget.value)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack gap={spacing}>
      <Card withBorder padding="sm">
        <Stack gap="sm">
          <Group>
            <TextInput
              placeholder={searchPlaceholder}
              leftSection={<IconSearch size={16} />}
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.currentTarget.value)}
              style={{ flex: 1 }}
              rightSection={
                searchValue && (
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => onSearchChange?.('')}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                )
              }
            />

            {showFilterToggle && filters.length > 0 && (
              <Button
                variant="light"
                leftSection={<IconFilter size={16} />}
                onClick={() => onToggleFilters?.(!filtersExpanded)}
                color={hasActiveFilters ? 'blue' : 'gray'}
              >
                Filters{' '}
                {hasActiveFilters &&
                  `(${filters.filter((f) => f.value && f.value !== '').length})`}
              </Button>
            )}

            {children}
          </Group>

          {filters.length > 0 && (
            <Collapse in={filtersExpanded}>
              <Stack gap="sm">
                <Group grow>{filters.map(renderFilterInput)}</Group>

                <Group justify="flex-end">
                  <Button
                    variant="light"
                    color="gray"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Clear Filters
                  </Button>
                  {onApplyFilters && (
                    <Button variant="filled" onClick={onApplyFilters}>
                      Apply Filters
                    </Button>
                  )}
                </Group>
              </Stack>
            </Collapse>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

// Simple search component without filters
export interface SimpleSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  width?: string | number;
}

export const SimpleSearch: React.FC<SimpleSearchProps> = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  size = 'sm',
  width,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      size={size}
      style={{ width }}
      rightSection={
        value && (
          <ActionIcon variant="subtle" size="sm" onClick={() => onChange?.('')}>
            <IconX size={12} />
          </ActionIcon>
        )
      }
    />
  );
};
