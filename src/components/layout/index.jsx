import React from "react";
import PropTypes from "prop-types";

import { useTogglePointerEvents } from "src/hooks/useTogglePointerEvents";

import Header from "src/components/header";
import Footer from "src/components/footer";

import "./index.scss";

const Layout = ({ children, isHome, onLogoClick }) => {
  useTogglePointerEvents();

  return (
    <>
      <Header isHome={isHome} onLogoClick={onLogoClick} />
      <main className="main">{children}</main>
      <Footer onLogoClick={onLogoClick} />
    </>
  );
};

Layout.defaultProps = {
  isHome: false,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  isHome: PropTypes.bool,
  onLogoClick: PropTypes.func,
};

export default Layout;
