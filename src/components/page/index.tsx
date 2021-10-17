import React from 'react';
import classnames from 'classnames';

import useNavigation from '@/hooks/navigation';

import Footer from '@/components/footer';
import Header from '@/components/header';

import './index.scss';

interface Props {
  isHome?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function Page({ isHome, children, className }: Props) {
  useNavigation();

  return (
    <>
      <Header isHome={isHome} />
      <main className={classnames('main', className)}>{children}</main>
      <Footer isHome={isHome} />
    </>
  );
}

export default Page;
