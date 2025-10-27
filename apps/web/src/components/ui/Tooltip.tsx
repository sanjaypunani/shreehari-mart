import {
  Tooltip as MantineTooltip,
  TooltipProps as MantineTooltipProps,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface TooltipProps extends Omit<MantineTooltipProps, 'label'> {
  label: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  withArrow?: boolean;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  multiline?: boolean;
  width?: number | 'auto';
}

export function Tooltip({
  label,
  children,
  position = 'top',
  withArrow = true,
  offset = 5,
  openDelay = 300,
  closeDelay = 0,
  multiline = false,
  width = 'auto',
  ...props
}: TooltipProps) {
  return (
    <MantineTooltip
      label={label}
      position={position}
      withArrow={withArrow}
      offset={offset}
      openDelay={openDelay}
      closeDelay={closeDelay}
      multiline={multiline}
      w={width}
      styles={{
        tooltip: {
          backgroundColor: colors.text.primary,
          color: colors.text.inverse,
          fontSize: '14px',
          padding: '8px 12px',
        },
      }}
      {...props}
    >
      {children}
    </MantineTooltip>
  );
}
