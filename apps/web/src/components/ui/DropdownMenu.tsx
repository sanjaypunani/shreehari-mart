import { Menu, Button, ActionIcon } from '@mantine/core';
import { ReactNode } from 'react';

export interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  divider?: boolean;
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  trigger?: ReactNode;
  position?:
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'top'
    | 'top-start'
    | 'top-end';
  width?: number | string;
  label?: string;
}

export function DropdownMenu({
  items,
  trigger,
  position = 'bottom-start',
  width = 200,
  label = 'Menu',
}: DropdownMenuProps) {
  return (
    <Menu position={position} width={width}>
      <Menu.Target>
        {trigger || (
          <Button variant="subtle" color="gray">
            {label}
          </Button>
        )}
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item, index) => {
          if (item.divider) {
            return <Menu.Divider key={`divider-${index}`} />;
          }

          return (
            <Menu.Item
              key={index}
              leftSection={item.icon}
              onClick={item.onClick}
              disabled={item.disabled}
              color={item.color}
            >
              {item.label}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}
