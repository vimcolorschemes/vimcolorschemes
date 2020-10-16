import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import classnames from "classnames";

import { SECTIONS, LAYOUTS } from "src/constants";

import { SEARCH_INPUT_LOCAL_STORAGE_KEY } from "src/hooks/useSearchRepositories";

import logo from "src/images/logo.svg";

import "./index.scss";

const SiteTitle = ({
  section = SECTIONS.NAV,
  layout = LAYOUTS.LIST,
  vertical = false,
  isHome,
  onLogoClick,
}) => {
  const Heading = isHome ? "h1" : "h2";

  return (
    <Link
      to="/"
      className={classnames("site-title", { "site-title--vertical": vertical })}
      data-section={section}
      data-layout={layout}
      onClick={() => {
        localStorage.removeItem(SEARCH_INPUT_LOCAL_STORAGE_KEY);
        if (onLogoClick) onLogoClick();
        if (document.activeElement) document.activeElement.blur();
      }}
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
  onLogoClick: PropTypes.func,
};

export default SiteTitle;
