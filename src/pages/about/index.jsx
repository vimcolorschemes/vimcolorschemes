import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import { SECTIONS, LAYOUTS } from "../../constants";

import { useNavigation } from "../../hooks/useNavigation";

import ExternalLink from "../../components/externalLink";
import Layout from "../../components/layout";
import SEO from "../../components/seo";

import "./index.scss";

const AboutPage = ({
  data: {
    site: {
      siteMetadata: { platform },
    },
  },
}) => {
  useNavigation();
  return (
    <Layout>
      <SEO title={`About ${platform}colorschemes`} path="/about" />
      <div className="about">
        <h1 className="title" id="about">
          <a
            href="#about"
            data-section={`${SECTIONS.ABOUT_LINK}-1`}
            data-layout={LAYOUTS.BLOCK}
          >
            About {platform}colorschemes
          </a>
        </h1>
        <p>
          <strong>{platform}colorschemes</strong> solves an old problem of mine
          which is to find the perfect color scheme. The project started with
          vim only but was expanded to any platform.{" "}
          <strong>Syntax color</strong> in a coding environment is{" "}
          <strong>a big part</strong> of what makes and IDE{" "}
          <strong>yours and yours only</strong>.
        </p>
        <p>
          GitHub is an awesome source for color schemes. There are literally
          thousands available on the platform. It is not easy to navigate
          through them, though. Checking out a couple to find a nice one can
          take a while.
        </p>
        <p>
          This is where <strong>{platform}colorschemes</strong> comes in. It
          creates a <strong>fast</strong> and <strong>fun</strong> gallery to
          navigate through tons of color schemes.
        </p>
        <h2 className="subtitle" id="key-features">
          <a
            href="#key-features"
            data-section={`${SECTIONS.ABOUT_LINK}-2`}
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
            <strong>Daily updated</strong> list of thousands of color scheme
            repositories
          </li>
          <li>
            <strong>Awesome vim key (or arrows) bindings</strong> to navigate
            quickly through the whole site
          </li>
        </ul>
        <h2 className="subtitle" id="get-involved">
          <a
            href="#get-involved"
            data-section={`${SECTIONS.ABOUT_LINK}-3`}
            data-layout={LAYOUTS.BLOCK}
          >
            Get Involved
          </a>
        </h2>
        <p>
          <strong>{platform}colorschemes</strong> is aimed to be a collaborative
          project, and you are invited to help. All types of involvement are
          welcome!
        </p>
        <p>
          Developers, check out
          <ExternalLink
            to="https://github.com/reobin/colorschemes/wiki/Development-guide"
            data-section={`${SECTIONS.ABOUT_LINK}-4`}
            data-layout={LAYOUTS.BLOCK}
            noIcon
            className="inline-link"
          >
            {" "}
            the development guide{" "}
          </ExternalLink>
          to start writing code.
        </p>
        <h2 className="subtitle" id="issues">
          <a
            href="#issues"
            data-section={`${SECTIONS.ABOUT_LINK}-5`}
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
          <ExternalLink
            to="https://github.com/reobin/colorschemes/issues"
            data-section={`${SECTIONS.ABOUT_LINK}-6`}
            data-layout={LAYOUTS.BLOCK}
            noIcon
            className="inline-link"
          >
            Bugs and feature requests{" "}
          </ExternalLink>
          are welcome. Make sure to follow the issue template before posting.
        </p>
        <h2 className="subtitle" id="credits">
          <a
            href="#credits"
            data-section={`${SECTIONS.ABOUT_LINK}-7`}
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

AboutPage.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        platform: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export const query = graphql`
  query {
    site {
      siteMetadata {
        platform
      }
    }
  }
`;

export default AboutPage;
