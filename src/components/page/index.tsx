import React from 'react';
import classnames from 'classnames';

import useNavigation from '@/hooks/navigation';
import usePointerEvents from '@/hooks/pointerEvents';

import Footer from '@/components/footer';
import Header from '@/components/header';

import './index.scss';

interface Props {
  isHome?: boolean;
  children?: React.ReactNode;
  className?: string;
  onHomeLinkClick?: () => void;
}

function Page({ isHome, children, className, onHomeLinkClick }: Props) {
  useNavigation();
  usePointerEvents();

  return (
    <>
      <Header isHome={isHome} onHomeLinkClick={onHomeLinkClick} />
      <main className={classnames('main', className)}>{children}</main>
      <Footer isHome={isHome} onHomeLinkClick={onHomeLinkClick} />
    </>
  );
}

export default Page;
