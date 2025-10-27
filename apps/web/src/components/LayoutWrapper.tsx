'use client';

import React from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MobileHeader } from './MobileHeader';
import { Footer } from './Footer';

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 'auto' }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      {/* <AppShell.Header> */}
      <MobileHeader />
      {/* </AppShell.Header> */}

      <AppShell.Main>{children}</AppShell.Main>

      {/* <Footer /> */}
    </AppShell>
  );
}
