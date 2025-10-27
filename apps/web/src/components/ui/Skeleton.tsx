import {
  Skeleton as MantineSkeleton,
  SkeletonProps as MantineSkeletonProps,
  Stack,
  Group,
  Box,
} from '@mantine/core';
import { ReactNode } from 'react';

export interface SkeletonProps extends MantineSkeletonProps {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  animate?: boolean;
}

export function Skeleton({
  width,
  height = 20,
  circle = false,
  radius = 'sm',
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <MantineSkeleton
      width={width}
      height={height}
      circle={circle}
      radius={radius}
      animate={animate}
      {...props}
    />
  );
}

// Skeleton Text - for text content
export interface SkeletonTextProps {
  lines?: number;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  lastLineWidth?: number | string;
  animate?: boolean;
}

export function SkeletonText({
  lines = 3,
  spacing = 'sm',
  lastLineWidth = '70%',
  animate = true,
}: SkeletonTextProps) {
  return (
    <Stack gap={spacing}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          animate={animate}
        />
      ))}
    </Stack>
  );
}

// Skeleton Card - for card layouts
export interface SkeletonCardProps {
  withImage?: boolean;
  imageHeight?: number;
  lines?: number;
  animate?: boolean;
}

export function SkeletonCard({
  withImage = true,
  imageHeight = 200,
  lines = 3,
  animate = true,
}: SkeletonCardProps) {
  return (
    <Stack gap="md">
      {withImage && (
        <Skeleton height={imageHeight} radius="md" animate={animate} />
      )}
      <Stack gap="sm">
        <Skeleton height={24} width="60%" animate={animate} />
        <SkeletonText lines={lines} animate={animate} />
      </Stack>
    </Stack>
  );
}

// Skeleton Table - for table layouts
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  animate?: boolean;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  animate = true,
}: SkeletonTableProps) {
  return (
    <Stack gap="sm">
      {/* Header */}
      <Group gap="md" wrap="nowrap">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} height={20} animate={animate} />
        ))}
      </Group>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Group key={`row-${rowIndex}`} gap="md" wrap="nowrap">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              height={16}
              animate={animate}
            />
          ))}
        </Group>
      ))}
    </Stack>
  );
}

// Skeleton Avatar - for avatar placeholders
export interface SkeletonAvatarProps {
  size?: number;
  animate?: boolean;
}

export function SkeletonAvatar({
  size = 40,
  animate = true,
}: SkeletonAvatarProps) {
  return <Skeleton width={size} height={size} circle animate={animate} />;
}

// Skeleton wrapper - shows skeleton while loading
export interface SkeletonWrapperProps {
  loading: boolean;
  children: ReactNode;
  skeleton?: ReactNode;
}

export function SkeletonWrapper({
  loading,
  children,
  skeleton = <SkeletonText />,
}: SkeletonWrapperProps) {
  if (loading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
}
