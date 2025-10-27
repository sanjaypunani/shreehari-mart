import {
  Text as MantineText,
  TextProps as MantineTextProps,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors, typography } from '../../theme';

export interface ParagraphProps extends Omit<MantineTextProps, 'color'> {
  variant?: 'primary' | 'secondary';
  children?: ReactNode;
}

export function Paragraph({
  variant = 'primary',
  children,
  ...props
}: ParagraphProps) {
  const colorMap = {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
  };

  return (
    <MantineText
      c={colorMap[variant]}
      style={{ lineHeight: typography.lineHeight.relaxed }}
      {...props}
    >
      {children}
    </MantineText>
  );
}
