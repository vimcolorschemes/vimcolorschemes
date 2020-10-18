import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { SECTIONS, LAYOUTS } from "src/constants";

import { GitHub } from "src/components/icons";

import ExternalLink from "src/components/externalLink";
import SiteTitle from "src/components/siteTitle";

import "./index.scss";

const Footer = ({ onLogoClick }) => (
  <footer className="footer">
    <SiteTitle
      section={SECTIONS.FOOTER_NAV}
      isFooter
      onLogoClick={onLogoClick}
    />
    <nav className="footer__nav">
      <Link
        to="/about"
        data-testid="footer-link-about"
        data-section={SECTIONS.FOOTER_NAV}
        data-layout={LAYOUTS.LIST}
        data-priority={1}
      >
        About
      </Link>
      <ExternalLink
        to="https://github.com/vimcolorschemes/vimcolorschemes"
        data-section={SECTIONS.FOOTER_NAV}
        data-layout={LAYOUTS.LIST}
        className="accent"
        icon={GitHub}
      >
        Follow on GitHub
      </ExternalLink>
      <a
        href="mailto:contact@reobin.dev"
        target="_blank"
        rel="noreferrer noopener"
        data-section={SECTIONS.FOOTER_NAV}
        data-layout={LAYOUTS.LIST}
      >
        Contact
      </a>
    </nav>
  </footer>
);

Footer.propTypes = {
  onLogoClick: PropTypes.func,
};

export default Footer;
