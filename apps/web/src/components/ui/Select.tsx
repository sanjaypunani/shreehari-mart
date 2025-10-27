import {
  Select as MantineSelect,
  SelectProps as MantineSelectProps,
} from '@mantine/core';

export interface SelectProps extends MantineSelectProps {
  variant?: 'default' | 'filled' | 'unstyled';
}

export function Select({ variant = 'default', ...props }: SelectProps) {
  return <MantineSelect variant={variant} {...props} />;
}
