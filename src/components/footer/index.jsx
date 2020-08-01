import React from "react";
import { Link } from "gatsby";

import { SECTIONS, LAYOUTS } from "../../constants";

import SiteTitle from "../siteTitle";

import "./index.scss";

const Footer = () => (
  <footer className="footer">
    <SiteTitle section={SECTIONS.FOOTER_NAV} vertical />
    <nav className="footer__nav">
      <Link
        to="/about"
        data-section={SECTIONS.FOOTER_NAV}
        data-layout={LAYOUTS.LIST}
      >
        About
      </Link>
      <Link
        to="https://github.com/reobin/vimcolorschemes"
        target="_blank"
        rel="noreferrer noopener"
        data-section={SECTIONS.FOOTER_NAV}
        data-layout={LAYOUTS.LIST}
      >
        GitHub
      </Link>
      <Link
        to="https://github.com/reobin/vimcolorschemes/issues"
        target="_blank"
        rel="noreferrer noopener"
        data-section={SECTIONS.FOOTER_NAV}
        data-layout={LAYOUTS.LIST}
      >
        Issues
      </Link>
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
