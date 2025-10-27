import {
  Text as MantineText,
  TextProps as MantineTextProps,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme/colors';

export interface TextProps extends Omit<MantineTextProps, 'color'> {
  variant?: 'primary' | 'secondary' | 'inverse';
  children?: ReactNode;
}

export function Text({ variant = 'primary', children, ...props }: TextProps) {
  const colorMap = {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    inverse: colors.text.inverse,
  };

  return (
    <MantineText c={colorMap[variant]} {...props}>
      {children}
    </MantineText>
  );
}
