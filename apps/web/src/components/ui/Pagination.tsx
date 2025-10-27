import {
  Pagination as MantinePagination,
  PaginationProps as MantinePaginationProps,
} from '@mantine/core';

export interface PaginationProps extends MantinePaginationProps {
  variant?: 'default' | 'filled' | 'light';
}

export function Pagination({ variant = 'default', ...props }: PaginationProps) {
  return <MantinePagination color="primary" {...props} />;
}
