import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import ExternalLink from '@/components/externalLink';
import HomeLink from '@/components/homeLink';

import './index.scss';

interface Props {
  isHome?: boolean;
  onHomeLinkClick?: () => void;
}

function Footer({ isHome, onHomeLinkClick }: Props) {
  return (
    <footer className="footer">
      <div className="footer__links">
        <HomeLink isHome={isHome} onClick={onHomeLinkClick} isFooter />
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
