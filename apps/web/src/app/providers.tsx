'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { mantineTheme } from '../theme';
import { LayoutWrapper } from '../components/LayoutWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={mantineTheme}>
      <Notifications position="top-right" zIndex={10000} />
      <LayoutWrapper>{children}</LayoutWrapper>
    </MantineProvider>
  );
}
