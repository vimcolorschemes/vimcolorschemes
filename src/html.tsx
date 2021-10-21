import React from 'react';

import { Background, BACKGROUND_KEY } from '@/lib/background';

const spatialNavigation = require('!!raw-loader!/node_modules/spatial-navigation-polyfill/polyfill/spatial-navigation-polyfill.js');

declare global {
  interface Window {
    __background: Background;
    __onBackgroundChange: () => void;
    __setPreferredBackground: (background: Background) => void;
  }

  interface EventTarget {
    spatialNavigationSearch: (
      direction: 'left' | 'down' | 'up' | 'right',
      options?: { candidates?: Element[]; container?: Element },
    ) => HTMLElement | null;
  }
}

interface Props {
  htmlAttributes: Object;
  headComponents: Object[];
  bodyAttributes: Object;
  preBodyComponents: Object[];
  body: string;
  postBodyComponents: Object[];
}

function HTML(props: Props) {
  const backgroundScript = `
    (function() {
      window.__onBackgroundChange = function() {};
      function setBackground(newBackground) {
        window.__background = newBackground;
        preferredBackground = newBackground;
        document.body.className = newBackground;
        window.__onBackgroundChange(newBackground);
      }
      var preferredBackground;
      try {
        preferredBackground = localStorage.getItem("${BACKGROUND_KEY}");
      } catch (err) {}
      window.__setPreferredBackground = function(newBackground) {
        setBackground(newBackground);
        try {
          localStorage.setItem("${BACKGROUND_KEY}", newBackground);
        } catch (err) {}
      }
      var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkQuery.addListener(function(event) {
        window.__setPreferredBackground(e.matches ? "${Background.Dark}" : "${Background.Light}")
      });
      setBackground(preferredBackground || (darkQuery.matches ? "${Background.Dark}" : "${Background.Light}"));
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
      <body {...props.bodyAttributes} className={Background.Light}>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: spatialNavigation.default.toString(),
          }}
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: backgroundScript }}
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
}

export default HTML;
