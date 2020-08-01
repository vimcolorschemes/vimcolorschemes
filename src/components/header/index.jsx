import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import { LAYOUTS, SECTIONS } from "../../constants";

import SiteTitle from "../siteTitle";
import ThemeSwitch from "../themeSwitch";

import "./index.scss";

const Header = () => (
  <header className="header">
    <div className="header__content">
      <SiteTitle />
      <div className="header__sub-content">
        <ThemeSwitch data-section={SECTIONS.NAV} data-layout={LAYOUTS.LIST} />
        <nav className="header__nav">
          <Link
            to="/about/"
            className="header__link"
            data-section={SECTIONS.NAV}
            data-layout={LAYOUTS.LIST}
          >
            About VimCS
          </Link>
        </nav>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
