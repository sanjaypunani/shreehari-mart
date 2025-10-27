import {
  Popover as MantinePopover,
  PopoverProps as MantinePopoverProps,
  Box,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface PopoverProps extends Omit<MantinePopoverProps, 'children'> {
  trigger: ReactNode;
  content: ReactNode;
  position?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'right-start'
    | 'right-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end';
  withArrow?: boolean;
  width?: number | string;
  offset?: number;
  opened?: boolean;
  onChange?: (opened: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  clickOutsideEvents?: string[];
}

export function Popover({
  trigger,
  content,
  position = 'bottom',
  withArrow = true,
  width = 'auto',
  offset = 5,
  opened,
  onChange,
  closeOnClickOutside = true,
  closeOnEscape = true,
  clickOutsideEvents = ['mousedown', 'touchstart'],
  ...props
}: PopoverProps) {
  return (
    <MantinePopover
      position={position}
      withArrow={withArrow}
      width={width}
      offset={offset}
      opened={opened}
      onChange={onChange}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      clickOutsideEvents={clickOutsideEvents}
      styles={{
        dropdown: {
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        arrow: {
          borderColor: colors.border,
        },
      }}
      {...props}
    >
      <MantinePopover.Target>
        <Box style={{ display: 'inline-block' }}>{trigger}</Box>
      </MantinePopover.Target>
      <MantinePopover.Dropdown>{content}</MantinePopover.Dropdown>
    </MantinePopover>
  );
}
