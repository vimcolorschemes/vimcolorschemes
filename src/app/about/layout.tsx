import { ReactNode } from 'react';

import Header from '@/components/ui/header';

type AboutPageLayoutProps = {
  children: ReactNode;
};

export default function AboutPageLayout({ children }: AboutPageLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
