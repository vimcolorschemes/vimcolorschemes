import React from "react";
import PropTypes from "prop-types";

import Header from "../header";
import Footer from "../footer";

import "./index.scss";

const Layout = ({ children }) => (
  <>
    <Header />
    <main className="main">{children}</main>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
