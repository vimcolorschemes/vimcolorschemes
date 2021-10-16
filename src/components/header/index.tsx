import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import ThemeSwitch from '@/components/themeSwitch';

import './index.scss';

interface Props {
  isHome?: boolean;
}

function Header({ isHome }: Props) {
  const Title = isHome ? 'h1' : 'h2';
  return (
    <header className="header">
      <Link to={Routes.Home} data-focusable>
        <Title>vimcolorschemes</Title>
      </Link>
      <ThemeSwitch />
    </header>
  );
}

export default Header;
