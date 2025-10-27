import { Box, BoxProps } from '@mantine/core';
import { ReactNode } from 'react';
import { radius } from '../../theme/spacing';

export interface IconWrapperProps extends BoxProps {
  children: ReactNode;
  size?: number | string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function IconWrapper({
  children,
  size = 40,
  variant = 'primary',
  ...props
}: IconWrapperProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--mantine-color-primary-6)',
          color: 'white',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--mantine-color-secondary-4)',
          color: 'var(--mantine-color-black)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--mantine-color-primary-6)',
          border: '1px solid var(--mantine-color-primary-6)',
        };
      default:
        return {
          backgroundColor: 'var(--mantine-color-primary-6)',
          color: 'white',
        };
    }
  };

  return (
    <Box
      display="inline-flex"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        ...getVariantStyles(),
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
