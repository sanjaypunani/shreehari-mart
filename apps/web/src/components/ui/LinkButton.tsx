import { Anchor, AnchorProps } from '@mantine/core';
import { ReactNode } from 'react';

export interface LinkButtonProps extends AnchorProps {
  variant?: 'primary' | 'secondary';
  children?: ReactNode;
}

export function LinkButton({
  variant = 'primary',
  children,
  ...props
}: LinkButtonProps) {
  const color = variant === 'primary' ? 'primary' : 'secondary';

  return (
    <Anchor c={color} underline="hover" {...props}>
      {children}
    </Anchor>
  );
}
