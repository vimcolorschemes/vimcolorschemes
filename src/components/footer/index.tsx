import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import './index.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__links">
        <Link to={Routes.Home} data-focusable>
          vimcolorschemes
        </Link>
      </div>
      <div className="footer__links">
        <Link to={Routes.About} data-focusable data-testid="footer__about">
          About
        </Link>
        <a href={Routes.Github} rel="noopener" target="_blank" data-focusable>
          Github
        </a>
        <a href={Routes.Contact} rel="noopener" target="_blank" data-focusable>
          Contact
        </a>
      </div>
    </footer>
  );
}

export default Footer;
