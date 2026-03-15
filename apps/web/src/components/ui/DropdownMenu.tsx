import { Menu, Button } from '@mantine/core';
import { ReactNode } from 'react';

interface DropdownMenuActionItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  divider?: false;
}

interface DropdownMenuDividerItem {
  divider: true;
}

export type DropdownMenuItem = DropdownMenuActionItem | DropdownMenuDividerItem;

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
          if ('divider' in item && item.divider) {
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
