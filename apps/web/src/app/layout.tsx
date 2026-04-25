import './global.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import type { Metadata, Viewport } from 'next';
import { mantineHtmlProps } from '@mantine/core';
import { Rubik, Nunito_Sans } from 'next/font/google';

import { Providers } from './providers';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shreehari Mart - Your One-Stop Shop',
  description: 'Quality products at affordable prices for all your daily needs',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F5F8FC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const htmlClassName = `${rubik.variable} ${nunitoSans.variable}`;

  return (
    <html lang="en" {...mantineHtmlProps} className={htmlClassName}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
