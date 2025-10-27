import { Stack, Group, Text, Box } from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface DataListItem {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export interface DataListProps {
  items: DataListItem[];
  orientation?: 'horizontal' | 'vertical';
  labelWidth?: string | number;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withDivider?: boolean;
  striped?: boolean;
}

export function DataList({
  items,
  orientation = 'horizontal',
  labelWidth = 150,
  spacing = 'sm',
  withDivider = false,
  striped = false,
}: DataListProps) {
  return (
    <Stack gap={spacing}>
      {items.map((item, index) => (
        <Box
          key={index}
          style={{
            padding: '12px',
            backgroundColor:
              striped && index % 2 === 1 ? colors.surface : 'transparent',
            borderRadius: '4px',
            borderBottom:
              withDivider && index < items.length - 1
                ? `1px solid ${colors.border}`
                : undefined,
          }}
        >
          {orientation === 'horizontal' ? (
            <Group wrap="nowrap" gap="md" align="flex-start">
              {item.icon && (
                <Box style={{ color: colors.text.secondary, flexShrink: 0 }}>
                  {item.icon}
                </Box>
              )}
              <Text
                fw={600}
                c={colors.text.secondary}
                style={{
                  width: labelWidth,
                  flexShrink: 0,
                }}
              >
                {item.label}:
              </Text>
              <Box style={{ flex: 1, color: colors.text.primary }}>
                {typeof item.value === 'string' ? (
                  <Text>{item.value}</Text>
                ) : (
                  item.value
                )}
              </Box>
            </Group>
          ) : (
            <Stack gap="xs">
              <Group gap="xs">
                {item.icon && (
                  <Box style={{ color: colors.text.secondary }}>
                    {item.icon}
                  </Box>
                )}
                <Text fw={600} c={colors.text.secondary}>
                  {item.label}
                </Text>
              </Group>
              <Box style={{ color: colors.text.primary }}>
                {typeof item.value === 'string' ? (
                  <Text>{item.value}</Text>
                ) : (
                  item.value
                )}
              </Box>
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  );
}
