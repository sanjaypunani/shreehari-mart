import {
  Slider as MantineSlider,
  SliderProps as MantineSliderProps,
} from '@mantine/core';

export interface SliderProps extends MantineSliderProps {
  variant?: 'default';
}

export function Slider({ variant = 'default', ...props }: SliderProps) {
  return <MantineSlider color="primary" {...props} />;
}
