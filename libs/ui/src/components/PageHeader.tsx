import React, { ReactNode } from 'react';
import { Stack, Group, Title, Text, Box } from '@mantine/core';
import { Button } from './Button';

export interface PageHeaderAction {
  label: string;
  variant?:
    | 'filled'
    | 'outline'
    | 'light'
    | 'subtle'
    | 'default'
    | 'white'
    | 'gradient'
    | 'brand';
  color?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: PageHeaderAction[];
  children?: ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions = [],
  children,
  spacing = 'md',
}) => {
  return (
    <Stack gap={spacing}>
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title order={1}>{title}</Title>
          {subtitle && (
            <Text size="lg" c="dimmed" mt="xs">
              {subtitle}
            </Text>
          )}
        </Box>

        {actions.length > 0 && (
          <Group gap="sm">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'brand'}
                color={action.color}
                leftSection={action.leftSection}
                rightSection={action.rightSection}
                onClick={action.onClick}
                loading={action.loading}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </Group>
        )}
      </Group>

      {children}
    </Stack>
  );
};
