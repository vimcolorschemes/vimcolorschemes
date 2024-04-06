import cn from 'classnames';
import type { Metadata } from 'next';
import { Source_Sans_3, Ubuntu_Mono } from 'next/font/google';
import { ReactNode } from 'react';

import Footer from '@/app/_components/footer';
import Header from '@/app/_components/header';

import '@/styles/reset.css';
import '@/styles/global.css';

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
    'Check out the Trending vim color schemes! | vimcolorschemes is the ultimate resource for vim users to find the perfect color scheme for their favorite development environment. Come for the hundreds of vim color schemes, stay for the awesome hjkl spatial navigation.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={cn(fontStandard.variable, fontMono.variable)}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
