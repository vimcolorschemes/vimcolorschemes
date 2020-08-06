import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import "./index.scss";

const Intro = () => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            description
          }
        }
      }
    `,
  );

  return (
    <div className="intro">
      <h2 className="subtitle">{site.siteMetadata.description}</h2>
      <p className="intro__instruction">
        <strong>TIP:</strong> This website is best navigated with the keyboard.
      </p>
      <p className="intro__instruction">
        Use <strong className="intro__highlight">hjkl</strong> and{" "}
        <strong>enter</strong>
      </p>
    </div>
  );
};

export default Intro;
