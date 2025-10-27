import { Button as MantineButton, ButtonProps } from '@mantine/core';
import { forwardRef } from 'react';

export interface CustomButtonProps extends ButtonProps {
  /** Custom variant for brand-specific styling */
  variant?:
    | 'filled'
    | 'outline'
    | 'light'
    | 'subtle'
    | 'default'
    | 'white'
    | 'gradient'
    | 'brand';
  /** Click handler */
  onClick?: () => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'filled', ...props }, ref) => {
    // Handle custom brand variant
    const buttonVariant = variant === 'brand' ? 'filled' : variant;
    const buttonColor = variant === 'brand' ? 'shreehari-brand' : props.color;

    return (
      <MantineButton
        ref={ref}
        variant={buttonVariant}
        color={buttonColor}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
