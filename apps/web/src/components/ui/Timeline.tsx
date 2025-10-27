import {
  Timeline as MantineTimeline,
  TimelineProps as MantineTimelineProps,
  Text,
  Box,
} from '@mantine/core';
import { ReactNode } from 'react';
import { colors } from '../../theme';

export interface TimelineItem {
  title: string;
  description?: ReactNode;
  timestamp?: string;
  icon?: ReactNode;
  color?: string;
  lineVariant?: 'solid' | 'dashed' | 'dotted';
}

export interface TimelineProps extends Omit<MantineTimelineProps, 'children'> {
  items: TimelineItem[];
  active?: number;
  variant?: 'default' | 'compact';
}

export function Timeline({
  items,
  active = items.length - 1,
  variant = 'default',
  ...props
}: TimelineProps) {
  return (
    <MantineTimeline
      active={active}
      bulletSize={variant === 'compact' ? 16 : 20}
      lineWidth={2}
      {...props}
    >
      {items.map((item, index) => (
        <MantineTimeline.Item
          key={index}
          title={
            <Box>
              <Text fw={500} size={variant === 'compact' ? 'sm' : 'md'}>
                {item.title}
              </Text>
              {item.timestamp && (
                <Text size="xs" c={colors.text.secondary} mt={2}>
                  {item.timestamp}
                </Text>
              )}
            </Box>
          }
          bullet={item.icon}
          color={item.color || 'primary'}
          lineVariant={item.lineVariant || 'solid'}
        >
          {item.description && (
            <Box mt="xs">
              {typeof item.description === 'string' ? (
                <Text size="sm" c={colors.text.secondary}>
                  {item.description}
                </Text>
              ) : (
                item.description
              )}
            </Box>
          )}
        </MantineTimeline.Item>
      ))}
    </MantineTimeline>
  );
}
