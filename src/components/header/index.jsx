import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import { LAYOUTS, SECTIONS } from "../../constants";

import "./index.scss";

const Header = () => (
  <header className="header">
    <div className="header__content">
      <Link
        to="/"
        className="header__title"
        data-section={SECTIONS.NAV}
        data-layout={LAYOUTS.LIST}
      >
        <span>Vim</span>
        <span>C</span>
        <span>S</span>
      </Link>
      <nav className="header__nav">
        <ul>
          <Link
            to="/about/"
            className="header__link"
            data-section={SECTIONS.NAV}
            data-layout={LAYOUTS.LIST}
          >
            About VimCS
          </Link>
        </ul>
      </nav>
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
