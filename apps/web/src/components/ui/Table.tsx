import {
  Table as MantineTable,
  TableProps as MantineTableProps,
  ScrollArea,
  Box,
  Text,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  width?: string | number;
  render?: (value: any, row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableProps<T = any> extends Omit<MantineTableProps, 'data'> {
  columns: TableColumn<T>[];
  data: T[];
  striped?: boolean;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  withColumnBorders?: boolean;
  verticalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  horizontalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  maxHeight?: number | string;
  emptyState?: ReactNode;
  onRowClick?: (row: T, index: number) => void;
}

export function Table<T = any>({
  columns,
  data,
  striped = false,
  highlightOnHover = true,
  withBorder = true,
  withColumnBorders = false,
  verticalSpacing = 'sm',
  horizontalSpacing = 'md',
  fontSize = 'sm',
  maxHeight,
  emptyState,
  onRowClick,
  ...props
}: TableProps<T>) {
  const renderCell = (column: TableColumn<T>, row: T, index: number) => {
    const value = (row as any)[column.key];

    if (column.render) {
      return column.render(value, row, index);
    }

    return value !== null && value !== undefined ? String(value) : '-';
  };

  const tableContent = (
    <MantineTable
      striped={striped}
      highlightOnHover={highlightOnHover}
      withTableBorder={withBorder}
      withColumnBorders={withColumnBorders}
      verticalSpacing={verticalSpacing}
      horizontalSpacing={horizontalSpacing}
      {...props}
    >
      <MantineTable.Thead>
        <MantineTable.Tr>
          {columns.map((column) => (
            <MantineTable.Th
              key={column.key}
              style={{
                width: column.width,
                textAlign: column.align || 'left',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              {column.label}
            </MantineTable.Th>
          ))}
        </MantineTable.Tr>
      </MantineTable.Thead>
      <MantineTable.Tbody>
        {data.length === 0 ? (
          <MantineTable.Tr>
            <MantineTable.Td colSpan={columns.length}>
              {emptyState || (
                <Box ta="center" py="xl">
                  <Text c={colors.text.secondary}>No data available</Text>
                </Box>
              )}
            </MantineTable.Td>
          </MantineTable.Tr>
        ) : (
          data.map((row, index) => (
            <MantineTable.Tr
              key={index}
              onClick={() => onRowClick?.(row, index)}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              {columns.map((column) => (
                <MantineTable.Td
                  key={column.key}
                  style={{
                    textAlign: column.align || 'left',
                  }}
                >
                  {renderCell(column, row, index)}
                </MantineTable.Td>
              ))}
            </MantineTable.Tr>
          ))
        )}
      </MantineTable.Tbody>
    </MantineTable>
  );

  if (maxHeight) {
    return (
      <ScrollArea h={maxHeight} type="auto">
        {tableContent}
      </ScrollArea>
    );
  }

  return tableContent;
}
