import { Stack, StackProps } from '@mantine/core';
import { FormEvent, ReactNode } from 'react';

export interface FormProps extends Omit<StackProps, 'onSubmit'> {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function Form({ onSubmit, children, gap = 'md', ...props }: FormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack gap={gap} {...props}>
        {children}
      </Stack>
    </form>
  );
}
