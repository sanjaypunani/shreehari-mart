import {
  Tabs as MantineTabs,
  TabsProps as MantineTabsProps,
} from '@mantine/core';
import { ReactNode } from 'react';

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<MantineTabsProps, 'children'> {
  items: TabItem[];
  variant?: 'default' | 'outline' | 'pills';
}

export function Tabs({ items, variant = 'default', ...props }: TabsProps) {
  return (
    <MantineTabs variant={variant} color="primary" {...props}>
      <MantineTabs.List>
        {items.map((item) => (
          <MantineTabs.Tab
            key={item.value}
            value={item.value}
            leftSection={item.icon}
            disabled={item.disabled}
          >
            {item.label}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>

      {items.map(
        (item) =>
          item.content && (
            <MantineTabs.Panel key={item.value} value={item.value} pt="md">
              {item.content}
            </MantineTabs.Panel>
          )
      )}
    </MantineTabs>
  );
}
