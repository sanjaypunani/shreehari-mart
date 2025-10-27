import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  Loader,
} from '@mantine/core';
import { colors } from '../../theme/colors';

export interface LoadingButtonProps extends MantineButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export function LoadingButton({
  variant = 'primary',
  loading,
  children,
  ...props
}: LoadingButtonProps) {
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
          c: colors.text.primary,
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

  return (
    <MantineButton
      {...getVariantProps()}
      loading={loading}
      loaderProps={{ type: 'dots' }}
      {...props}
    >
      {children}
    </MantineButton>
  );
}
