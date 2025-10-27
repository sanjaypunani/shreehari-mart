import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
} from '@mantine/core';
import { colors } from '../../theme/colors';

export interface ButtonProps extends MantineButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
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

  return <MantineButton {...getVariantProps()} {...props} />;
}
