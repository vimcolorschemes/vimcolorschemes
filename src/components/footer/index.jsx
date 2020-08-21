import React from "react";
import { Link } from "gatsby";

import { SECTIONS, LAYOUTS } from "src/constants";

import { GitHub } from "src/components/icons";

import ExternalLink from "src/components/externalLink";
import SiteTitle from "src/components/siteTitle";

import "./index.scss";

const Footer = () => (
  <footer className="footer">
    <SiteTitle section={SECTIONS.FOOTER_NAV} vertical />
    <nav className="footer__nav">
      <Link
        to="/about"
        data-section={SECTIONS.FOOTER_NAV}
        data-layout={LAYOUTS.LIST}
        data-priority={1}
      >
        About
      </Link>
      <ExternalLink
        to="https://github.com/reobin/vimcolorschemes"
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

export default Footer;
