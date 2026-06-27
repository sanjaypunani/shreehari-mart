'use client';

import React from 'react';
import { AppShell, Box } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { MobileHeader } from './MobileHeader';
import { CartFab } from './cart';
import { useCartStore } from '../store';
import { BottomTabNavigation } from './BottomTabNavigation';
import { useScrollDirection } from '../hooks/useScrollDirection';

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const hasCartItems = useCartStore((state) => state.items.length > 0);

  const isAccountFlow = pathname?.startsWith('/account');
  const isAuthEntryPage =
    pathname?.startsWith('/account/signup') ||
    pathname?.startsWith('/account/verify') ||
    pathname === '/login';
  const isCategoryPage = pathname?.startsWith('/category/');
  const isCartPage = pathname === '/cart';
  const isCheckoutPage = pathname === '/checkout';
  const isProductPage = pathname?.startsWith('/product/');
  const isSearchPage = pathname === '/search';
  const isReferPage = pathname === '/refer';
  const isSplashPage = pathname === '/splash';
  const isOrderSuccessPage = pathname?.startsWith('/order-success');
  const isOrdersPage = pathname?.startsWith('/orders');

  const shouldHideHeader =
    isAccountFlow ||
    isAuthEntryPage ||
    isCategoryPage ||
    isCartPage ||
    isCheckoutPage ||
    isProductPage ||
    isSearchPage ||
    isReferPage ||
    isSplashPage ||
    isOrderSuccessPage ||
    isOrdersPage;
  const shouldHideCart =
    isAccountFlow || isOrderSuccessPage || isCheckoutPage || isSplashPage;
  const shouldShowBottomTabs =
    !isCartPage &&
    !isAuthEntryPage &&
    !isOrderSuccessPage &&
    !isCheckoutPage &&
    !isProductPage &&
    !isReferPage &&
    !isSplashPage;
  const shouldShowCartFab = !isCartPage && !shouldHideCart && hasCartItems;
  const shouldShowHeader = !shouldHideHeader;

  // Scroll-driven auto-hide
  const { scrollDirection, isAtTop, scrollRef } = useScrollDirection();
  const chromeVisible = isAtTop || scrollDirection === 'up' || scrollDirection === null;

  // Compact tab bar is ~56px total (36px inner + padding + safe area)
  const mainBottomPadding = isAccountFlow
    ? 0
    : shouldShowBottomTabs
      ? '64px'
      : 0;

  return (
    <AppShell
      header={{ height: 'auto' }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      <AppShell.Main>
        <Box
          style={{
            height: 'var(--app-viewport-height)',
            background: 'var(--brand-bg)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {shouldShowHeader && <MobileHeader headerVisible={chromeVisible} />}
          <Box
            ref={scrollRef}
            pb={mainBottomPadding}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {children}
          </Box>
        </Box>
      </AppShell.Main>

      {shouldShowCartFab && (
        <CartFab
          visible={chromeVisible}
          bottomOffset={shouldShowBottomTabs ? '56px' : '0px'}
        />
      )}
      {shouldShowBottomTabs && <BottomTabNavigation visible={chromeVisible} />}
    </AppShell>
  );
}
