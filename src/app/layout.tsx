import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/reset.css';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | vimcolorschemes',
    default: 'vimcolorschemes',
  },
  description:
    'Check out the Trending vim color schemes! | vimcolorschemes is the ultimate resource for vim users to find the perfect color scheme for their favorite development environment. Come for the hundreds of vim color schemes, stay for the awesome hjkl spatial navigation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
