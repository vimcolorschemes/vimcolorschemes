import React from 'react';

import BackgroundSwitch from '@/components/backgroundSwitch';
import HomeLink from '@/components/homeLink';

import './index.scss';

interface Props {
  isHome?: boolean;
}

function Header({ isHome }: Props) {
  return (
    <header className="header">
      <HomeLink isHome={isHome} />
      <BackgroundSwitch />
    </header>
  );
}

export default Header;
