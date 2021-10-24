import React from 'react';

import BackgroundSwitch from '@/components/backgroundSwitch';
import HomeLink from '@/components/homeLink';

import './index.scss';

interface Props {
  isHome?: boolean;
  onHomeLinkClick?: () => void;
}

function Header({ isHome, onHomeLinkClick }: Props) {
  return (
    <header className="header">
      <HomeLink isHome={isHome} onClick={onHomeLinkClick} />
      <BackgroundSwitch />
    </header>
  );
}

export default Header;
