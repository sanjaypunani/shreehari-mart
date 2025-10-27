import {
  Badge as MantineBadge,
  BadgeProps as MantineBadgeProps,
} from '@mantine/core';

export interface ChipProps extends MantineBadgeProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'outline';
  removable?: boolean;
  onRemove?: () => void;
}

export function Chip({
  variant = 'primary',
  removable,
  onRemove,
  children,
  ...props
}: ChipProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          color: 'primary',
          variant: 'light' as const,
        };
      case 'secondary':
        return {
          color: 'secondary',
          variant: 'light' as const,
        };
      case 'success':
        return {
          color: 'green',
          variant: 'light' as const,
        };
      case 'error':
        return {
          color: 'red',
          variant: 'light' as const,
        };
      case 'warning':
        return {
          color: 'yellow',
          variant: 'light' as const,
        };
      case 'outline':
        return {
          color: 'primary',
          variant: 'outline' as const,
        };
      default:
        return {
          color: 'primary',
          variant: 'light' as const,
        };
    }
  };

  return (
    <MantineBadge
      {...getVariantProps()}
      rightSection={
        removable ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            style={{ cursor: 'pointer', marginLeft: 4 }}
          >
            ×
          </span>
        ) : undefined
      }
      {...props}
    >
      {children}
    </MantineBadge>
  );
}
