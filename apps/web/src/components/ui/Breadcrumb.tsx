import { Breadcrumbs as MantineBreadcrumbs, Anchor, Box } from '@mantine/core';
import { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export function Breadcrumb({ items, separator, onItemClick }: BreadcrumbProps) {
  return (
    <MantineBreadcrumbs separator={separator}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Box
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {item.icon && (
              <span style={{ display: 'inline-flex' }}>{item.icon}</span>
            )}
            {isLast ? (
              <span style={{ color: 'var(--mantine-color-dimmed)' }}>
                {item.label}
              </span>
            ) : (
              <Anchor
                href={item.href || '#'}
                onClick={(e) => {
                  if (onItemClick) {
                    e.preventDefault();
                    onItemClick(item, index);
                  }
                }}
                c="primary"
              >
                {item.label}
              </Anchor>
            )}
          </Box>
        );
      })}
    </MantineBreadcrumbs>
  );
}
