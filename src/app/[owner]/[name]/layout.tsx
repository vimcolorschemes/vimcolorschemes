import { ReactNode } from 'react';

import Header from '@/components/ui/header';

type RepositoryPageLayoutProps = {
  children: ReactNode;
};

export default function RepositoryPageLayout({
  children,
}: RepositoryPageLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
