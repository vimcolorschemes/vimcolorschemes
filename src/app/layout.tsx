import cn from 'classnames';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { ReactNode } from 'react';

import QueryProvider from '@/components/providers/queryProvider';
import Footer from '@/components/ui/footer';

import './reset.css';
import './globals.css';
import './vim.css';

const fontStandard = Geist({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-standard',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    template: '%s | vimcolorschemes',
    default: 'vimcolorschemes',
  },
  description:
    'Check out the Trending vim and neovim color schemes! | vimcolorschemes is the ultimate resource for vim and nvim users to find the perfect color scheme for their favorite editor.',
  icons: {
    icon: '/assets/v.svg',
    shortcut: '/assets/v.svg',
    apple: '/assets/v.svg',
  },
  openGraph: {
    url: process.env.APP_URL,
    type: 'website',
    images: [
      {
        url: `${process.env.APP_URL}/assets/opengraph.png`,
        type: 'image/png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@reobindotdev',
  },
};

interface LayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function Layout({ children, modal }: LayoutProps) {
  return (
    <html lang="en">
      <body className={cn(fontStandard.variable, fontMono.variable)}>
        <QueryProvider>
          <Script
            src="https://analytics.us.umami.is/script.js"
            data-website-id="0408b924-a714-4a4a-82e6-8bd9c2d3706e"
            strategy="afterInteractive"
          />
          {children}
          {modal}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
