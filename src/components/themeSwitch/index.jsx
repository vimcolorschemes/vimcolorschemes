import React, { useState, useEffect } from "react";

import { THEMES, KEYS } from "src/constants";

import { useKeyboardShortcuts } from "src/hooks/useKeyboardShortcuts";

import "./index.scss";

const ThemeSwitch = inputArgs => {
  const isBrowser = typeof window !== "undefined";

  const [theme, setTheme] = useState();

  useKeyboardShortcuts({
    [KEYS.BACKGROUND]: () =>
      updateTheme(theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT),
  });

  useEffect(() => {
    if (isBrowser) {
      setTheme(window.__theme);
      window.__onThemeChange = () => setTheme(window.__theme);
    }
  }, [isBrowser]);

  const updateTheme = theme => window.__setPreferredTheme(theme);

  return (
    <label className="theme-switch" data-testid="theme-switch">
      <input
        type="checkbox"
        className="theme-switch__input"
        aria-label="Switch between light and dark mode"
        checked={theme === THEMES.DARK}
        onChange={event => {
          updateTheme(event.target.checked ? THEMES.DARK : THEMES.LIGHT);
        }}
        onKeyDown={event => {
          const { key, target } = event;
          if (KEYS.ENTER === key) {
            event.preventDefault();
            target.checked = !target.checked;
            updateTheme(target.checked ? THEMES.DARK : THEMES.LIGHT);
          }
        }}
        {...inputArgs}
      />
      {!!theme && (
        <span data-testid="theme-switch-label">
          theme: <strong>{theme}</strong>
        </span>
      )}
    </label>
  );
};

export default ThemeSwitch;
