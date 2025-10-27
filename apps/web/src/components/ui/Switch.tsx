import {
  Switch as MantineSwitch,
  SwitchProps as MantineSwitchProps,
} from '@mantine/core';

export interface SwitchProps extends MantineSwitchProps {
  variant?: 'default';
}

export function Switch({ variant = 'default', ...props }: SwitchProps) {
  return <MantineSwitch color="primary" {...props} />;
}
