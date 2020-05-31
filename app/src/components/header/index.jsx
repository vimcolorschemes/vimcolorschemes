import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

import "./index.scss";

const Header = ({ siteTitle }) => (
  <header className="header">
    <div className="header__content">
      <Link to="/" className="header__title">
        {siteTitle}
      </Link>
      <nav>
        <ul>
          <Link to="/about/" className="header__link">
            About vimcs
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
