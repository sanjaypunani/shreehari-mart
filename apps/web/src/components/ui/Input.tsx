import { TextInput, TextInputProps } from '@mantine/core';
import { ReactNode } from 'react';

export interface InputProps extends TextInputProps {
  variant?: 'default' | 'filled' | 'unstyled';
  icon?: ReactNode;
}

export function Input({ variant = 'default', icon, ...props }: InputProps) {
  return <TextInput variant={variant} leftSection={icon} {...props} />;
}
