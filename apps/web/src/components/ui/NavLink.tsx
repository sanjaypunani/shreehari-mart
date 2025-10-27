import {
  NavLink as MantineNavLink,
  NavLinkProps as MantineNavLinkProps,
} from '@mantine/core';
import { ReactNode } from 'react';

export interface NavLinkProps extends MantineNavLinkProps {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  badge?: string | number;
  variant?: 'default' | 'filled' | 'light' | 'subtle';
}

export function NavLink({
  label,
  icon,
  active,
  badge,
  variant = 'light',
  ...props
}: NavLinkProps) {
  return (
    <MantineNavLink
      label={label}
      leftSection={icon}
      rightSection={
        badge ? (
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
            {badge}
          </span>
        ) : undefined
      }
      active={active}
      variant={variant}
      color="primary"
      {...props}
    />
  );
}
