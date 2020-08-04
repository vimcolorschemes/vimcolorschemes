import React from "react";
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
