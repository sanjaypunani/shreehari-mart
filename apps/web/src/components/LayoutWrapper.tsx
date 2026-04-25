'use client';

import React from 'react';
import { AppShell, Box } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { MobileHeader } from './MobileHeader';
import { CartBar } from './cart';
import { useCartStore } from '../store';
import { BottomTabNavigation } from './BottomTabNavigation';

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const hasCartItems = useCartStore((state) => state.items.length > 0);

  const isAccountFlow = pathname?.startsWith('/account');
  const isAuthEntryPage =
    pathname?.startsWith('/account/signup') ||
    pathname?.startsWith('/account/verify');
  const isCategoryPage = pathname?.startsWith('/category/');
  const isCartPage = pathname === '/cart';
  const isOrderSuccessPage = pathname?.startsWith('/order-success');

  const shouldHideHeader =
    isAccountFlow || isCategoryPage || isCartPage || isOrderSuccessPage;
  const shouldHideCart = isAccountFlow || isOrderSuccessPage;
  const shouldShowBottomTabs =
    !isCartPage && !isAuthEntryPage && !isOrderSuccessPage;
  const shouldShowCartBar = !isCartPage && !shouldHideCart && hasCartItems;
  const shouldShowHeader = !shouldHideHeader;

  const mainBottomPadding = isAccountFlow
    ? 0
    : shouldShowCartBar && shouldShowBottomTabs
      ? 'calc(76px + var(--mobile-bottom-tabs-total-height))'
      : shouldShowCartBar
        ? 'calc(76px + var(--safe-area-bottom))'
        : shouldShowBottomTabs
          ? 'var(--mobile-bottom-tabs-total-height)'
          : 0;

  return (
    <AppShell
      header={{ height: 'auto' }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      {/* <AppShell.Header> */}
      {shouldShowHeader && <MobileHeader />}
      {/* </AppShell.Header> */}

      <AppShell.Main>
        <Box
          pb={mainBottomPadding}
          style={{
            minHeight: 'var(--app-viewport-height)',
            background:
              'radial-gradient(circle at 0% 0%, rgba(31,122,99,0.08), transparent 35%), var(--brand-bg)',
          }}
        >
          {children}
        </Box>
      </AppShell.Main>

      {/* Global Cart Bar - Fixed at bottom (hidden on cart page) */}
      {shouldShowCartBar && (
        <CartBar
          bottomOffset={
            shouldShowBottomTabs ? 'var(--mobile-bottom-tabs-total-height)' : '0px'
          }
          withSafeAreaInset={!shouldShowBottomTabs}
        />
      )}
      {shouldShowBottomTabs && <BottomTabNavigation />}

      {/* <Footer /> */}
    </AppShell>
  );
}
