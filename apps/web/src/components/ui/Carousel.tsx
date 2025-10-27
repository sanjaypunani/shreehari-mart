import {
  Carousel as MantineCarousel,
  CarouselProps as MantineCarouselProps,
} from '@mantine/carousel';
import { Box } from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface CarouselSlide {
  content: ReactNode;
  key?: string | number;
}

export interface CarouselProps extends Omit<MantineCarouselProps, 'children'> {
  slides: CarouselSlide[];
  height?: number | string;
  slideSize?: string | number;
  slideGap?: string | number;
  withIndicators?: boolean;
  withControls?: boolean;
  draggable?: boolean;
}

export function Carousel({
  slides,
  height = 300,
  slideSize = '100%',
  slideGap = 'md',
  withIndicators = true,
  withControls = true,
  draggable = true,
  ...props
}: CarouselProps) {
  return (
    <MantineCarousel
      height={height}
      slideSize={slideSize}
      slideGap={slideGap}
      withIndicators={withIndicators}
      withControls={withControls}
      draggable={draggable}
      styles={{
        control: {
          backgroundColor: 'white',
          border: `1px solid ${colors.border}`,
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.surface,
          },
        },
        indicator: {
          backgroundColor: colors.border,
          '&[data-active]': {
            backgroundColor: colors.primary,
          },
        },
      }}
      {...props}
    >
      {slides.map((slide, index) => (
        <MantineCarousel.Slide key={slide.key || index}>
          <Box h="100%" w="100%">
            {slide.content}
          </Box>
        </MantineCarousel.Slide>
      ))}
    </MantineCarousel>
  );
}

// Alias
export const Slider = Carousel;
