import {
  Badge as MantineBadge,
  BadgeProps as MantineBadgeProps,
} from '@mantine/core';

export interface BadgeProps extends MantineBadgeProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'outline';
}

export function Badge({ variant = 'primary', ...props }: BadgeProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          color: 'primary',
          variant: 'filled' as const,
        };
      case 'secondary':
        return {
          color: 'secondary',
          variant: 'filled' as const,
        };
      case 'success':
        return {
          color: 'green',
          variant: 'filled' as const,
        };
      case 'error':
        return {
          color: 'red',
          variant: 'filled' as const,
        };
      case 'warning':
        return {
          color: 'yellow',
          variant: 'filled' as const,
        };
      case 'outline':
        return {
          color: 'primary',
          variant: 'outline' as const,
        };
      default:
        return {
          color: 'primary',
          variant: 'filled' as const,
        };
    }
  };

  return <MantineBadge {...getVariantProps()} {...props} />;
}
