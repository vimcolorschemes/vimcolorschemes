import React from 'react';
import { Theme, THEME_KEY } from './lib/themes';

interface Props {
  htmlAttributes: Object;
  headComponents: Object[];
  bodyAttributes: Object;
  preBodyComponents: Object[];
  body: string;
  postBodyComponents: Object[];
}

function HTML(props: Props) {
  const themeScript = `
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
      } catch (err) {}
      window.__setPreferredTheme = function(newTheme) {
        setTheme(newTheme);
        try {
          localStorage.setItem("${THEME_KEY}", newTheme);
        } catch (err) {}
      }
      var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkQuery.addListener(function(event) {
        window.__setPreferredTheme(e.matches ? "${Theme.Dark}" : "${Theme.Light}")
      });
      setTheme(preferredTheme || (darkQuery.matches ? "${Theme.Dark}" : "${Theme.Light}"));
    })();`;

  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes} className={Theme.Light}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
}

export default HTML;
