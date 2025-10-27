import { Stack, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme/colors';

export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  gap?: 'xs' | 'sm' | 'md';
}

export function FormField({
  label,
  hint,
  error,
  required,
  children,
  gap = 'xs',
}: FormFieldProps) {
  return (
    <Stack gap={gap}>
      {label && (
        <Text size="sm" fw={500} c={colors.text.primary}>
          {label}
          {required && (
            <span style={{ color: colors.error, marginLeft: '4px' }}>*</span>
          )}
        </Text>
      )}
      {hint && !error && (
        <Text size="xs" c={colors.text.secondary} mt={-4}>
          {hint}
        </Text>
      )}
      {children}
      {error && (
        <Text size="xs" c={colors.error}>
          {error}
        </Text>
      )}
    </Stack>
  );
}
