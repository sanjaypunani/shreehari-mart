import {
  Title as MantineTitle,
  TitleProps as MantineTitleProps,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme/colors';

export interface HeadingProps extends Omit<MantineTitleProps, 'color'> {
  variant?: 'primary' | 'secondary' | 'inverse';
  children?: ReactNode;
}

export function Heading({
  variant = 'primary',
  order = 1,
  children,
  ...props
}: HeadingProps) {
  const colorMap = {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    inverse: colors.text.inverse,
  };

  return (
    <MantineTitle order={order} c={colorMap[variant]} {...props}>
      {children}
    </MantineTitle>
  );
}
