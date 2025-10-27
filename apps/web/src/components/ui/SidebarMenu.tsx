import { NavLink as MantineNavLink, Stack } from '@mantine/core';
import { ReactNode, useState } from 'react';

export interface SidebarMenuItem {
  label: string;
  icon?: ReactNode;
  href?: string;
  active?: boolean;
  badge?: string | number;
  children?: SidebarMenuItem[];
  onClick?: () => void;
  disabled?: boolean;
}

export interface SidebarMenuProps {
  items: SidebarMenuItem[];
  variant?: 'default' | 'filled' | 'light' | 'subtle';
  onItemClick?: (item: SidebarMenuItem) => void;
}

function SidebarMenuItemComponent({
  item,
  variant = 'light',
  onItemClick,
  level = 0,
}: {
  item: SidebarMenuItem;
  variant?: string;
  onItemClick?: (item: SidebarMenuItem) => void;
  level?: number;
}) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    if (item.children && item.children.length > 0) {
      setOpened(!opened);
    }
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <>
      <MantineNavLink
        label={item.label}
        leftSection={item.icon}
        rightSection={
          item.badge ? (
            <span
              style={{
                backgroundColor: 'var(--mantine-color-primary-6)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {item.badge}
            </span>
          ) : item.children && item.children.length > 0 ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              style={{
                transform: opened ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path
                d="M4.5 3L7.5 6L4.5 9"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          ) : undefined
        }
        active={item.active}
        onClick={handleClick}
        disabled={item.disabled}
        variant={variant as any}
        color="primary"
        style={{
          paddingLeft: `${level * 16 + 12}px`,
        }}
      />
      {opened && item.children && (
        <Stack gap={0}>
          {item.children.map((child, index) => (
            <SidebarMenuItemComponent
              key={index}
              item={child}
              variant={variant}
              onItemClick={onItemClick}
              level={level + 1}
            />
          ))}
        </Stack>
      )}
    </>
  );
}

export function SidebarMenu({
  items,
  variant = 'light',
  onItemClick,
}: SidebarMenuProps) {
  return (
    <Stack gap={0}>
      {items.map((item, index) => (
        <SidebarMenuItemComponent
          key={index}
          item={item}
          variant={variant}
          onItemClick={onItemClick}
        />
      ))}
    </Stack>
  );
}
