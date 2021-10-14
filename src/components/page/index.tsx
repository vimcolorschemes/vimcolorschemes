import React from 'react';
import classnames from 'classnames';

import useNavigation from '@/hooks/navigation';

import Footer from '@/components/footer';
import Header from '@/components/header';

import './index.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function Page({ children, className }: Props) {
  useNavigation();

  return (
    <>
      <Header />
      <main className={classnames('main', className)}>{children}</main>
      <Footer />
    </>
  );
}

export default Page;
