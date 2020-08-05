import React from "react";

import { SECTIONS, LAYOUTS } from "../../constants";

import { useNavigation } from "../../hooks/useNavigation";

import Layout from "../../components/layout";
import SEO from "../../components/seo";

import "./index.scss";

const AboutPage = () => {
  useNavigation();
  return (
    <Layout>
      <SEO title="About" />
      <div className="about">
        <h1 className="title">About vimcolorschemes</h1>
        <h2 className="subtitle" id="what-is-it">
          <a
            href="#what-is-it"
            data-section={SECTIONS.ABOUT_TITLE}
            data-layout={LAYOUTS.BLOCK}
          >
            What is it?
          </a>
        </h2>
        <p>
          <strong>vimcoloschemes</strong> solves an old problem of mine, which
          is to find the perfect vim color scheme. <strong>Syntax color</strong>{" "}
          in a coding environment is <strong>a big part</strong> of what makes
          and IDE <strong>yours and yours only</strong>.
        </p>
        <p>
          GitHub is an awesome source for vim color schemes. There are literally
          thousands of vim color schemes available on the platform. It is not
          easy to navigate through them, though. Checking out a couple to find a
          nice one can take a while.
        </p>
        <p>
          This is where <strong>vimcolorschemes</strong> comes in. It creates a{" "}
          <strong>fast</strong> and <strong>fun</strong> gallery to navigate vim
          color schemes.
        </p>
        <h2 className="subtitle" id="key-features">
          <a
            href="#key-features"
            data-section={SECTIONS.ABOUT_TITLE}
            data-layout={LAYOUTS.BLOCK}
          >
            Key features{" "}
            <span role="img" aria-label="rocket">
              🚀
            </span>
          </a>
        </h2>
        <ul>
          <li>
            Thousands of <strong>daily updated</strong> vim color scheme
            repositories
          </li>
          <li>
            <strong>Awesome vim key bindings</strong> to navigate quickly
            through the whole site
          </li>
        </ul>
        <h2 className="subtitle" id="get-involved">
          <a
            href="#get-involved"
            data-section={SECTIONS.ABOUT_TITLE}
            data-layout={LAYOUTS.BLOCK}
          >
            Get Involved
          </a>
        </h2>
        <p>
          <strong>vimcolorschemes</strong> is aimed to be a collaborative
          project, and you are invited to help. All types of involvement are
          welcome!
        </p>
        <p>
          Developers, check out the development guide to start writing code.
        </p>
        <h2 className="subtitle" id="issues">
          <a
            href="#issues"
            data-section={SECTIONS.ABOUT_TITLE}
            data-layout={LAYOUTS.BLOCK}
          >
            Issues
          </a>
        </h2>
        <p>
          Having issues with this website? Or do you have a game changing
          feature idea?
        </p>
        <p>
          Bugs and feature requests are welcome. Make sure to follow the issue
          template before posting.
        </p>
        <h2 className="subtitle" id="credits">
          <a
            href="#credits"
            data-section={SECTIONS.ABOUT_TITLE}
            data-layout={LAYOUTS.BLOCK}
          >
            Credits
          </a>
        </h2>
        <p>
          Credit goes to all the creators of vim color schemes around GitHub{" "}
          <span role="img" aria-label="celebration">
            🎉
          </span>
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;
