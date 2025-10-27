import { createTheme, MantineColorsTuple } from '@mantine/core';
import { colors } from './colors';
import { typography } from './typography';
import { radius, shadow } from './spacing';

// Define primary color palette for Mantine
const primaryColor: MantineColorsTuple = [
  '#e6f4f0',
  '#cce9e1',
  '#99d3c3',
  '#66bda5',
  '#33a687',
  '#247c62', // main color
  '#1d634e',
  '#164a3b',
  '#0f3127',
  '#071914',
];

// Define secondary color palette for Mantine
const secondaryColor: MantineColorsTuple = [
  '#fffceb',
  '#fff9d6',
  '#fef3ad',
  '#fded84',
  '#fde35a', // main color
  '#e4ca51',
  '#cab148',
  '#b0983f',
  '#967f36',
  '#7c662d',
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
    fontFamily: typography.fontFamily,
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
});
