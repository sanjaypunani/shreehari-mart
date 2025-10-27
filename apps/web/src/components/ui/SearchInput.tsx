import { TextInput, TextInputProps } from '@mantine/core';
import { ReactNode } from 'react';
import { colors, radius, typography } from '../../theme';

export interface SearchInputProps extends Omit<TextInputProps, 'leftSection'> {
  variant?: 'default' | 'filled' | 'unstyled';
  onSearch?: (value: string) => void;
  searchIcon?: ReactNode;
}

export function SearchInput({
  variant = 'default',
  onSearch,
  searchIcon,
  onChange,
  styles,
  radius: radiusProp,
  ...props
}: SearchInputProps) {
  const defaultSearchIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
    </svg>
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onSearch?.(event.currentTarget.value);
  };

  // Default theme-based styles
  const defaultStyles = {
    input: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      color: colors.text.primary,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily,
      '&::placeholder': {
        color: colors.text.secondary,
        opacity: 0.6,
      },
      '&:focus': {
        borderColor: colors.primary,
        backgroundColor: colors.background,
        boxShadow: `0 0 0 2px ${colors.primary}20`,
      },
    },
  };

  // Merge user-provided styles with defaults
  const mergedStyles = styles
    ? {
        input: {
          ...defaultStyles.input,
          ...(typeof styles === 'function' ? {} : styles.input || {}),
        },
      }
    : defaultStyles;

  return (
    <TextInput
      variant={variant}
      leftSection={searchIcon || defaultSearchIcon}
      placeholder="Search..."
      onChange={handleChange}
      radius={radiusProp || radius.md}
      styles={mergedStyles}
      {...props}
    />
  );
}
