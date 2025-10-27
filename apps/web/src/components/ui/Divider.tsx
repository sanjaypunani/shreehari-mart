import {
  Divider as MantineDivider,
  DividerProps as MantineDividerProps,
} from '@mantine/core';

export interface DividerProps extends MantineDividerProps {
  variant?: 'solid' | 'dashed' | 'dotted';
}

export function Divider({ variant = 'solid', ...props }: DividerProps) {
  return <MantineDivider variant={variant} {...props} />;
}
