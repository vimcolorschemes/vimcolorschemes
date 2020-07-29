import React, { useState, useEffect } from "react";

import { THEMES } from "../../constants";

import "./index.scss";

const ThemeSwitch = inputArgs => {
  const [theme, setTheme] = useState(window?.__theme);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(window.__theme);
      window.__onThemeChange = () => setTheme(window.__theme);
    }
  }, []);

  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        className="theme-switch__input"
        aria-label="Switch between light and dark mode"
        checked={theme === THEMES.DARK}
        onChange={event =>
          window.__setPreferredTheme(
            event.target.checked ? THEMES.DARK : THEMES.LIGHT,
          )
        }
        {...inputArgs}
      />
      <span>
        dark theme: <strong>{theme === THEMES.DARK ? "on" : "off"}</strong>
      </span>
    </label>
  );
};

export default ThemeSwitch;
