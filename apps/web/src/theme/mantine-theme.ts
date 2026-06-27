import { createTheme, MantineColorsTuple } from '@mantine/core';
import { colors } from './colors';
import { typography } from './typography';
import { radius, shadow } from './spacing';

// Cropzo Forest green palette for Mantine
const primaryColor: MantineColorsTuple = [
  '#f0f4f0',
  '#d9e3d8',
  '#b4c8b2',
  '#8ead8b',
  '#6a9367',
  '#2D4A2B', // main - deep forest
  '#274024',
  '#1f351d',
  '#182a17',
  '#101e10',
];

// Terracotta secondary palette
const secondaryColor: MantineColorsTuple = [
  '#fef3ed',
  '#fce4d6',
  '#f9c8ab',
  '#f5aa7e',
  '#f08c53',
  '#C85A2C', // main - terracotta
  '#b44f26',
  '#9e4420',
  '#87391a',
  '#702e14',
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
    sm: typography.lineHeight.snug.toString(),
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
    fontWeight: typography.fontWeight.regular.toString(),
    sizes: {
      h1: {
        fontSize: typography.fontSize['4xl'],
        lineHeight: typography.lineHeight.tight.toString(),
      },
      h2: {
        fontSize: typography.fontSize['3xl'],
        lineHeight: typography.lineHeight.tight.toString(),
      },
      h3: {
        fontSize: typography.fontSize['2xl'],
        lineHeight: typography.lineHeight.snug.toString(),
      },
      h4: {
        fontSize: typography.fontSize.xl,
        lineHeight: typography.lineHeight.normal.toString(),
      },
      h5: {
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.normal.toString(),
      },
      h6: {
        fontSize: typography.fontSize.base,
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
