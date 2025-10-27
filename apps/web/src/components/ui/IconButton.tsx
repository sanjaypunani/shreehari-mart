import { ActionIcon, ActionIconProps } from '@mantine/core';

export interface IconButtonProps extends ActionIconProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export function IconButton({ variant = 'primary', ...props }: IconButtonProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'filled' as const,
          color: 'primary',
        };
      case 'secondary':
        return {
          variant: 'filled' as const,
          color: 'secondary',
        };
      case 'outline':
        return {
          variant: 'outline' as const,
          color: 'primary',
        };
      case 'ghost':
        return {
          variant: 'subtle' as const,
          color: 'primary',
        };
      default:
        return {
          variant: 'filled' as const,
          color: 'primary',
        };
    }
  };

  return <ActionIcon {...getVariantProps()} {...props} />;
}
