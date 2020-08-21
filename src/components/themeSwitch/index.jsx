import React, { useState, useEffect } from "react";

import { THEMES, KEYS } from "src/constants";

import "./index.scss";

const ThemeSwitch = inputArgs => {
  const isBrowser = typeof window !== "undefined";

  const [theme, setTheme] = useState(isBrowser ? window.__theme : undefined);

  useEffect(() => {
    if (isBrowser) {
      setTheme(window.__theme);
      window.__onThemeChange = () => setTheme(window.__theme);
    }
  }, [isBrowser]);

  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        className="theme-switch__input"
        aria-label="Switch between light and dark mode"
        checked={theme === THEMES.DARK}
        onChange={event => {
          window.__setPreferredTheme(
            event.target.checked ? THEMES.DARK : THEMES.LIGHT,
          );
        }}
        onKeyDown={event => {
          const { key, target } = event;
          if (KEYS.ENTER === key) {
            event.preventDefault();
            target.checked = !target.checked;
            window.__setPreferredTheme(
              target.checked ? THEMES.DARK : THEMES.LIGHT,
            );
            return;
          }
        }}
        {...inputArgs}
      />
      <span>
        dark theme: <strong>{theme === THEMES.DARK ? "on" : "off"}</strong>
      </span>
    </label>
  );
};

export default ThemeSwitch;
