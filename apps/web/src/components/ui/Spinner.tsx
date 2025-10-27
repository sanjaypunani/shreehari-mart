import {
  Loader as MantineLoader,
  LoaderProps as MantineLoaderProps,
  Box,
  Stack,
  Text,
  Center,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface SpinnerProps extends MantineLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'default' | 'primary' | 'white';
  label?: string;
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  label,
  ...props
}: SpinnerProps) {
  const getVariantColor = () => {
    switch (variant) {
      case 'white':
        return 'white';
      case 'primary':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  if (label) {
    return (
      <Stack align="center" gap="sm">
        <MantineLoader size={size} color={getVariantColor()} {...props} />
        <Text size="sm" c={colors.text.secondary}>
          {label}
        </Text>
      </Stack>
    );
  }

  return <MantineLoader size={size} color={getVariantColor()} {...props} />;
}

// Loader alias
export const Loader = Spinner;

// Full page loader overlay
export interface LoaderOverlayProps {
  visible: boolean;
  label?: string;
  blur?: number;
}

export function LoaderOverlay({
  visible,
  label = 'Loading...',
  blur = 3,
}: LoaderOverlayProps) {
  if (!visible) return null;

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: `blur(${blur}px)`,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner size="lg" label={label} />
    </Box>
  );
}

// Inline loader for content areas
export interface InlineLoaderProps {
  loading: boolean;
  children: ReactNode;
  minHeight?: number | string;
  label?: string;
}

export function InlineLoader({
  loading,
  children,
  minHeight = 200,
  label = 'Loading...',
}: InlineLoaderProps) {
  if (loading) {
    return (
      <Center style={{ minHeight }}>
        <Spinner label={label} />
      </Center>
    );
  }

  return <>{children}</>;
}
