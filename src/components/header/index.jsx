import React from "react";
import PropTypes from "prop-types";

import { LAYOUTS, SECTIONS } from "src/constants";

import SiteTitle from "src/components/siteTitle";
import ThemeSwitch from "src/components/themeSwitch";

import "./index.scss";

const Header = ({ isHome }) => (
  <header className="header">
    <div className="header__content">
      <SiteTitle isHome={isHome} />
      <div className="header__sub-content">
        <ThemeSwitch data-section={SECTIONS.NAV} data-layout={LAYOUTS.LIST} />
      </div>
    </div>
  </header>
);

Header.propTypes = {
  isHome: PropTypes.bool,
};

export default Header;
