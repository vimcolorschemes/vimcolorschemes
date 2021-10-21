import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import HomeLink from '@/components/homeLink';

import './index.scss';
import ExternalLink from '../externalLink';

interface Props {
  isHome?: boolean;
}

function Footer({ isHome }: Props) {
  return (
    <footer className="footer">
      <div className="footer__links">
        <HomeLink isHome={isHome} isFooter />
      </div>
      <div className="footer__links">
        <Link to={Routes.About} data-focusable data-testid="footer__about">
          About
        </Link>
        <ExternalLink to={Routes.Github} data-focusable>
          Github
        </ExternalLink>
        <ExternalLink to={Routes.Contact} data-focusable>
          Contact
        </ExternalLink>
      </div>
    </footer>
  );
}

export default Footer;
