import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

import "./index.scss";

const Header = ({ siteTitle }) => (
  <header className="header">
    <div className="header__content">
      <h1 className="header__title">
        <Link to="/" className="header__title-link">
          {siteTitle}
        </Link>
      </h1>
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
