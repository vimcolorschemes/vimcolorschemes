import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link, useStaticQuery, graphql } from "gatsby";

import { SECTIONS, LAYOUTS } from "src/constants";

import logo from "src/images/logo.svg";

import "./index.scss";

const SiteTitle = ({
  section = SECTIONS.NAV,
  layout = LAYOUTS.LIST,
  vertical = false,
  isHome,
}) => {
  const Heading = isHome ? "h1" : "h2";

  return (
    <Link
      to="/"
      className={classnames("site-title", { "site-title--vertical": vertical })}
      data-section={section}
      data-layout={layout}
      onClick={() => document.activeElement?.blur()}
    >
      <img src={logo} alt="" className="site-title__logo" />
      <Heading className="site-title__name">
        <span className="site-title__name-part">vim</span>
        <span className="site-title__name-part">colorscheme</span>
      </Heading>
    </Link>
  );
};

SiteTitle.propTypes = {
  section: PropTypes.string,
  layout: PropTypes.string,
  vertical: PropTypes.bool,
  isHome: PropTypes.bool,
};

export default SiteTitle;
