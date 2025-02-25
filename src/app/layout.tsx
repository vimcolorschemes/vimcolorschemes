import { SpeedInsights } from '@vercel/speed-insights/next';
import cn from 'classnames';
import type { Metadata } from 'next';
import { Source_Sans_3, Ubuntu_Mono } from 'next/font/google';
import { ReactNode } from 'react';

import Footer from '@/components/ui/footer';

import './reset.css';
import './globals.css';
import './vim.css';

const fontStandard = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-standard',
});

const fontMono = Ubuntu_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    template: '%s | vimcolorschemes',
    default: 'vimcolorschemes',
  },
  description:
    'Check out the Trending vim and neovim color schemes! | vimcolorschemes is the ultimate resource for vim and nvim users to find the perfect color scheme for their favorite editor.',
  openGraph: {
    url: process.env.APP_URL,
    type: 'website',
    images: [
      {
        url: `${process.env.APP_URL}/assets/og-image.png`,
        type: 'image/png',
        width: 400,
        height: 200,
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
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://analytics.us.umami.is/script.js"
          data-website-id="0408b924-a714-4a4a-82e6-8bd9c2d3706e"
        />
      </head>
      <body className={cn(fontStandard.variable, fontMono.variable)}>
        {children}
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
