import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import ThemeSwitch from '@/components/themeSwitch';

import './index.scss';

function Header() {
  return (
    <header className="header">
      <Link to={Routes.Home}>vimcolorschemes</Link>
      <ThemeSwitch />
    </header>
  );
}

export default Header;
