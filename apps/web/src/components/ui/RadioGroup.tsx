import {
  Radio,
  RadioGroupProps as MantineRadioGroupProps,
  Stack,
} from '@mantine/core';
import { ReactNode } from 'react';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<MantineRadioGroupProps, 'children'> {
  options: RadioOption[];
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  options,
  orientation = 'vertical',
  ...props
}: RadioGroupProps) {
  return (
    <Radio.Group {...props}>
      <Stack gap={orientation === 'vertical' ? 'sm' : undefined}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            color="primary"
          />
        ))}
      </Stack>
    </Radio.Group>
  );
}
