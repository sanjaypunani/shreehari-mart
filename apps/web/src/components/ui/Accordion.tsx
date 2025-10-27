import {
  Accordion as MantineAccordion,
  AccordionProps as MantineAccordionProps,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface AccordionItem {
  value: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

export interface AccordionProps
  extends Omit<
    MantineAccordionProps,
    'children' | 'defaultValue' | 'onChange' | 'multiple'
  > {
  items: AccordionItem[];
  variant?: 'default' | 'contained' | 'separated' | 'filled';
  multiple?: boolean;
  defaultValue?: string | string[];
  onChange?: (value: string | string[] | null) => void;
}

export function Accordion({
  items,
  variant = 'default',
  multiple = false,
  defaultValue,
  onChange,
  ...props
}: AccordionProps) {
  return (
    <MantineAccordion
      variant={variant}
      multiple={multiple as any}
      defaultValue={defaultValue as any}
      onChange={onChange as any}
      styles={{
        item: {
          borderColor: colors.border,
        },
        control: {
          '&:hover': {
            backgroundColor: colors.surface,
          },
        },
        label: {
          color: colors.text.primary,
          fontWeight: 500,
        },
        content: {
          color: colors.text.primary,
        },
      }}
      {...props}
    >
      {items.map((item) => (
        <MantineAccordion.Item key={item.value} value={item.value}>
          <MantineAccordion.Control icon={item.icon}>
            {item.label}
          </MantineAccordion.Control>
          <MantineAccordion.Panel>{item.content}</MantineAccordion.Panel>
        </MantineAccordion.Item>
      ))}
    </MantineAccordion>
  );
}
