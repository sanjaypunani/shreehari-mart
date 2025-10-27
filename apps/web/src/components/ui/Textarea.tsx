import {
  Textarea as MantineTextarea,
  TextareaProps as MantineTextareaProps,
} from '@mantine/core';

export interface TextareaProps extends MantineTextareaProps {
  variant?: 'default' | 'filled' | 'unstyled';
}

export function Textarea({ variant = 'default', ...props }: TextareaProps) {
  return <MantineTextarea variant={variant} autosize minRows={3} {...props} />;
}
