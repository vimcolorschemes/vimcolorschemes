import React from "react";
import PropTypes from "prop-types";

import { THEMES, THEME_KEY } from "./constants";

const HTML = props => (
  <html {...props.htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {!!process.env.GATSBY_UMAMI_WEBSITE_ID &&
        !!process.env.GATSBY_UMAMI_SCRIPT_URL && (
          <script
            async
            defer
            data-website-id={process.env.GATSBY_UMAMI_WEBSITE_ID}
            src={process.env.GATSBY_UMAMI_SCRIPT_URL}
          />
        )}
      {props.headComponents}
    </head>
    <body {...props.bodyAttributes} className={`${THEMES.LIGHT}`}>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              window.__onThemeChange = function() {};
              function setTheme(newTheme) {
                window.__theme = newTheme;
                preferredTheme = newTheme;
                document.body.className = newTheme;
                window.__onThemeChange(newTheme);
              }
              var preferredTheme;
              try {
                preferredTheme = localStorage.getItem("${THEME_KEY}");
              } catch (err) { }
              window.__setPreferredTheme = function(newTheme) {
                setTheme(newTheme);
                try {
                  localStorage.setItem("${THEME_KEY}", newTheme);
                } catch (err) {}
              }
              var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
              darkQuery.addListener(function(event) {
                window.__setPreferredTheme(e.matches ? "${THEMES.DARK}" : "${THEMES.LIGHT}")
              });
              setTheme(preferredTheme || (darkQuery.matches ? "${THEMES.DARK}" : "${THEMES.LIGHT}"));
            })();
          `,
        }}
      />
      {props.preBodyComponents}
      <div
        key="body"
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: props.body }}
      />
      {props.postBodyComponents}
    </body>
  </html>
);

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};

export default HTML;
