import React from 'react';
import classnames from 'classnames';

import Footer from '@/components/footer';
import Header from '@/components/header';

import './index.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function Page({ children, className }: Props) {
  return (
    <>
      <Header />
      <main className={classnames('main', className)}>{children}</main>
      <Footer />
    </>
  );
}

export default Page;
