import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import { LAYOUTS, SECTIONS } from "../../constants";

import ThemeSwitch from "../themeSwitch";

import logo from "../../images/logo.svg";

import "./index.scss";

const Header = () => (
  <header className="header">
    <div className="header__content">
      <Link
        to="/"
        className="header__logo"
        data-section={SECTIONS.NAV}
        data-layout={LAYOUTS.LIST}
      >
        <img src={logo} alt="Vim color schemes logo" />
        <span>vim</span>
        <span>colorschemes</span>
      </Link>
      <ThemeSwitch />
      <nav className="header__nav">
        <ul>
          <li>
            <Link
              to="/about/"
              className="header__link"
              data-section={SECTIONS.NAV}
              data-layout={LAYOUTS.LIST}
            >
              About VimCS
            </Link>
          </li>
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
