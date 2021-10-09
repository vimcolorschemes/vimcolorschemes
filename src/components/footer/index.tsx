import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/routes';

import './index.scss';

function Footer() {
  return (
    <footer className="footer">
      <Link to={Routes.Home}>vimcolorschemes</Link>
      <Link to={Routes.About}>About</Link>
      <a href={Routes.Github} rel="noopener" target="_blank">
        Github
      </a>
      <a href={Routes.Contact} rel="noopener" target="_blank">
        Contact
      </a>
    </footer>
  );
}

export default Footer;
