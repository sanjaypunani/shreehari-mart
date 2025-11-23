'use client';

import React from 'react';
import { AppShell, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { MobileHeader } from './MobileHeader';
import { Footer } from './Footer';
import { CartBar } from './cart';

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  // Hide CartBar on cart page
  const shouldShowCartBar = pathname !== '/cart';

  return (
    <AppShell
      header={{ height: 'auto' }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      {/* <AppShell.Header> */}
      <MobileHeader />
      {/* </AppShell.Header> */}

      <AppShell.Main>
        <Box pb={80}>{children}</Box>
      </AppShell.Main>

      {/* Global Cart Bar - Fixed at bottom (hidden on cart page) */}
      {shouldShowCartBar && <CartBar />}

      {/* <Footer /> */}
    </AppShell>
  );
}
