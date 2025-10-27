import React, { ReactNode } from 'react';
import {
  Table,
  Card,
  LoadingOverlay,
  Group,
  ActionIcon,
  Text,
  ScrollArea,
} from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

export interface Column<T = any> {
  key: string;
  title: string;
  width?: string | number;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortable?: boolean;
}

export interface DataTableAction<T = any> {
  icon: ReactNode;
  label: string;
  color?: string;
  onClick: (record: T) => void;
  variant?:
    | 'subtle'
    | 'filled'
    | 'outline'
    | 'light'
    | 'default'
    | 'white'
    | 'gradient';
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  striped?: boolean;
  highlightOnHover?: boolean;
  withBorder?: boolean;
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  actions?: DataTableAction<T>[];
  emptyMessage?: string;
  maxHeight?: string | number;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  striped = true,
  highlightOnHover = true,
  withBorder = true,
  shadow = 'sm',
  padding = 'lg',
  radius = 'md',
  actions = [],
  emptyMessage = 'No data available',
  maxHeight,
}: DataTableProps<T>) => {
  const defaultActions: DataTableAction<T>[] = [
    {
      icon: <IconEye size={16} />,
      label: 'View',
      color: 'blue',
      onClick: () => {},
    },
    {
      icon: <IconEdit size={16} />,
      label: 'Edit',
      color: 'gray',
      onClick: () => {},
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Delete',
      color: 'red',
      onClick: () => {},
    },
  ];

  const tableActions = actions.length > 0 ? actions : defaultActions;
  const showActionsColumn = tableActions.length > 0;

  const renderCellValue = (column: Column<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(record[column.key], record, index);
    }
    return record[column.key];
  };

  return (
    <Card
      shadow={shadow}
      padding={padding}
      radius={radius}
      withBorder={withBorder}
    >
      <LoadingOverlay visible={loading} />

      <ScrollArea h={maxHeight}>
        <Table striped={striped} highlightOnHover={highlightOnHover}>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key} style={{ width: column.width }}>
                  {column.title}
                </Table.Th>
              ))}
              {showActionsColumn && <Table.Th>Actions</Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.length === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={columns.length + (showActionsColumn ? 1 : 0)}
                >
                  <Text ta="center" c="dimmed" py="xl">
                    {emptyMessage}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              data.map((record, index) => (
                <Table.Tr key={record['id'] || index}>
                  {columns.map((column) => (
                    <Table.Td key={column.key}>
                      {renderCellValue(column, record, index)}
                    </Table.Td>
                  ))}
                  {showActionsColumn && (
                    <Table.Td>
                      <Group gap="xs">
                        {tableActions.map((action, actionIndex) => (
                          <ActionIcon
                            key={actionIndex}
                            variant={action.variant || 'subtle'}
                            color={action.color}
                            onClick={() => action.onClick(record)}
                            title={action.label}
                          >
                            {action.icon}
                          </ActionIcon>
                        ))}
                      </Group>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
};
