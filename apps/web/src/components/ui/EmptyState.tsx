import { Stack, Text, Button, Box } from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  image?: string;
  imageHeight?: number;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  image,
  imageHeight = 200,
}: EmptyStateProps) {
  return (
    <Stack align="center" gap="md" py="xl" px="md">
      {image ? (
        <Box
          component="img"
          src={image}
          alt={title}
          style={{
            height: imageHeight,
            objectFit: 'contain',
            opacity: 0.6,
          }}
        />
      ) : (
        icon && (
          <Box
            style={{
              fontSize: 64,
              color: colors.text.secondary,
              opacity: 0.5,
            }}
          >
            {icon}
          </Box>
        )
      )}

      <Stack gap="xs" align="center" maw={400}>
        <Text size="lg" fw={600} c={colors.text.primary} ta="center">
          {title}
        </Text>
        {description && (
          <Text size="sm" c={colors.text.secondary} ta="center">
            {description}
          </Text>
        )}
      </Stack>

      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          mt="sm"
        >
          {action.label}
        </Button>
      )}
    </Stack>
  );
}
