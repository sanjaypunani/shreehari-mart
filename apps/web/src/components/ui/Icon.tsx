import { Box, BoxProps } from '@mantine/core';
import { ReactNode } from 'react';

export interface IconProps extends BoxProps {
  children: ReactNode;
  size?: number | string;
}

export function Icon({ children, size = 20, ...props }: IconProps) {
  return (
    <Box
      component="span"
      display="inline-flex"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
