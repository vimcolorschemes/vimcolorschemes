import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import './index.scss';

function Header() {
  return (
    <header className="header">
      <Link to={Routes.Home}>vimcolorschemes</Link>
    </header>
  );
}

export default Header;
