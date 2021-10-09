import React from 'react';

import Footer from '@/components/footer';
import Header from '@/components/header';

import './index.scss';

interface Props {
  children?: React.ReactNode;
}

function Page({ children }: Props) {
  return (
    <>
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}

export default Page;
