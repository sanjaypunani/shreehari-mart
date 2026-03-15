import './global.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import type { Metadata, Viewport } from 'next';
import { mantineHtmlProps } from '@mantine/core';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Shreehari Mart - Your One-Stop Shop',
  description: 'Quality products at affordable prices for all your daily needs',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
