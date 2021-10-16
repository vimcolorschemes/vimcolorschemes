import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import BackgroundSwitch from '@/components/backgroundSwitch';

import './index.scss';

interface Props {
  isHome?: boolean;
}

function Header({ isHome }: Props) {
  const Title = isHome ? 'h1' : 'h2';
  return (
    <header className="header">
      <Link to={Routes.Home} data-focusable data-testid="header__title">
        <Title>vimcolorschemes</Title>
      </Link>
      <BackgroundSwitch />
    </header>
  );
}

export default Header;
