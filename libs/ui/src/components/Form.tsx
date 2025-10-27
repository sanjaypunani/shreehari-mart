import React, { ReactNode } from 'react';
import { Paper, Stack, Group, Title, Divider, Box } from '@mantine/core';
import { Button } from './Button';

export interface FormAction {
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
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface FormProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  actions?: FormAction[];
  loading?: boolean;
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withBorder?: boolean;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  actionsPosition?: 'left' | 'center' | 'right' | 'apart';
}

export const Form: React.FC<FormProps> = ({
  children,
  title,
  subtitle,
  onSubmit,
  actions = [],
  loading = false,
  shadow = 'sm',
  padding = 'lg',
  radius = 'md',
  withBorder = true,
  spacing = 'md',
  actionsPosition = 'right',
}) => {
  const defaultActions: FormAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: () => {},
    },
    {
      label: 'Save',
      variant: 'brand',
      type: 'submit',
      onClick: () => {},
    },
  ];

  const formActions = actions.length > 0 ? actions : defaultActions;

  const getActionsJustify = () => {
    switch (actionsPosition) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      case 'apart':
        return 'space-between';
      default:
        return 'flex-end';
    }
  };

  return (
    <Paper shadow={shadow} p={padding} radius={radius} withBorder={withBorder}>
      <form onSubmit={onSubmit}>
        <Stack gap={spacing}>
          {(title || subtitle) && (
            <Box>
              {title && (
                <Title order={2} mb={subtitle ? 'xs' : 0}>
                  {title}
                </Title>
              )}
              {subtitle && (
                <Title order={4} fw={400} c="dimmed">
                  {subtitle}
                </Title>
              )}
              <Divider mt="md" />
            </Box>
          )}

          <Stack gap={spacing}>{children}</Stack>

          {formActions.length > 0 && (
            <>
              <Divider />
              <Group justify={getActionsJustify()}>
                {formActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    color={action.color}
                    loading={action.loading || loading}
                    disabled={action.disabled}
                    onClick={action.onClick}
                    type={action.type}
                  >
                    {action.label}
                  </Button>
                ))}
              </Group>
            </>
          )}
        </Stack>
      </form>
    </Paper>
  );
};

// Form Field wrapper for consistent spacing and layout
export interface FormFieldProps {
  children: ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  spacing = 'sm',
}) => {
  return <Box mb={spacing}>{children}</Box>;
};
