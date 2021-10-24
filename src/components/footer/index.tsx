import React from 'react';
import { Link } from 'gatsby';

import Routes from '@/lib/routes';

import ExternalLink from '@/components/externalLink';
import HomeLink from '@/components/homeLink';
import IconGithub from '@/components/icons/github';

import './index.scss';

interface Props {
  isHome?: boolean;
  onHomeLinkClick?: () => void;
}

function Footer({ isHome, onHomeLinkClick }: Props) {
  return (
    <footer className="footer">
      <nav className="footer__content" arial-label="footer navigation links">
        <div className="footer__links">
          <HomeLink isHome={isHome} onClick={onHomeLinkClick} isFooter />
        </div>
        <div aria-label="footer links" className="footer__links">
          <Link
            to={Routes.About}
            data-focusable
            data-testid="footer__about"
            className="footer__link"
          >
            About
          </Link>
          <ExternalLink
            to={Routes.Github}
            data-focusable
            className="footer__link footer__link--accent"
          >
            <span>
              Follow{' '}
              <span className="footer__link-extension">vimcolorshemes</span> on
              Github
            </span>
            <IconGithub />
          </ExternalLink>
          <ExternalLink
            to={Routes.Contact}
            data-focusable
            className="footer__link"
          >
            Contact
          </ExternalLink>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
