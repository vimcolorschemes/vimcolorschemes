import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";

import { SECTIONS, LAYOUTS } from "../../constants";

import logo from "../../images/logo.svg";

import "./index.scss";

const SiteTitle = ({
  section = SECTIONS.NAV,
  layout = LAYOUTS.LIST,
  vertical = false,
}) => (
  <Link
    to="/"
    className={classnames("site-title", { "site-title--vertical": vertical })}
    data-section={section}
    data-layout={layout}
  >
    <img src={logo} alt="Vim color schemes logo" className="site-title__logo" />
    <div className="site-title__name">
      <span className="site-title__name-part">vim</span>
      <span className="site-title__name-part">colorschemes</span>
    </div>
  </Link>
);

export default SiteTitle;
