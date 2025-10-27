import {
  Checkbox as MantineCheckbox,
  CheckboxProps as MantineCheckboxProps,
} from '@mantine/core';

export interface CheckboxProps extends MantineCheckboxProps {
  variant?: 'filled' | 'outline';
}

export function Checkbox({ variant = 'filled', ...props }: CheckboxProps) {
  return <MantineCheckbox color="primary" variant={variant} {...props} />;
}
