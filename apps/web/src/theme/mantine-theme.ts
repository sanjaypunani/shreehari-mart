import { createTheme, MantineColorsTuple } from '@mantine/core';
import { colors } from './colors';
import { typography } from './typography';
import { radius, shadow } from './spacing';

// Define primary color palette for Mantine
const primaryColor: MantineColorsTuple = [
  '#e7f6f2',
  '#ceece4',
  '#9ed7c8',
  '#6fc2ab',
  '#43ad8e',
  '#1f7a63', // main color
  '#1b6e59',
  '#165847',
  '#114236',
  '#0a2d24',
];

// Define secondary color palette for Mantine
const secondaryColor: MantineColorsTuple = [
  '#fff3e8',
  '#fee4cf',
  '#fdc89f',
  '#fcab6e',
  '#fb8f3f',
  '#f97316', // main color
  '#db6410',
  '#be550b',
  '#a04607',
  '#7f3704',
];

export const mantineTheme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
  },
  fontFamily: typography.fontFamily,
  fontSizes: {
    xs: typography.fontSize.xs,
    sm: typography.fontSize.sm,
    md: typography.fontSize.base,
    lg: typography.fontSize.lg,
    xl: typography.fontSize.xl,
  },
  lineHeights: {
    xs: typography.lineHeight.tight.toString(),
    sm: typography.lineHeight.normal.toString(),
    md: typography.lineHeight.normal.toString(),
    lg: typography.lineHeight.relaxed.toString(),
    xl: typography.lineHeight.relaxed.toString(),
  },
  radius: {
    xs: radius.sm,
    sm: radius.sm,
    md: radius.md,
    lg: radius.lg,
    xl: radius.xl,
  },
  shadows: {
    xs: shadow.sm,
    sm: shadow.sm,
    md: shadow.md,
    lg: shadow.lg,
    xl: shadow.lg,
  },
  headings: {
    fontFamily: typography.headingFontFamily,
    fontWeight: typography.fontWeight.bold.toString(),
    sizes: {
      h1: {
        fontSize: typography.fontSize['3xl'],
        lineHeight: typography.lineHeight.tight.toString(),
      },
      h2: {
        fontSize: typography.fontSize['2xl'],
        lineHeight: typography.lineHeight.tight.toString(),
      },
      h3: {
        fontSize: typography.fontSize.xl,
        lineHeight: typography.lineHeight.normal.toString(),
      },
      h4: {
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.normal.toString(),
      },
      h5: {
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.normal.toString(),
      },
      h6: {
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.normal.toString(),
      },
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  white: colors.background,
  black: colors.text.primary,
  other: {
    colors,
  },
  components: {
    Select: {
      defaultProps: {
        comboboxProps: {
          zIndex: 999999,
        },
      },
    },
    Popover: {
      defaultProps: {
        zIndex: 999999,
      },
    },
  },
});
