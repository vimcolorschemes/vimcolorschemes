import React, { useEffect, useState } from 'react';

import { Theme } from '@/lib/themes';

import './index.scss';

function ThemeSwitch() {
  const isBrowser = typeof window !== 'undefined';

  const [theme, setTheme] = useState<Theme>();

  useEffect(() => {
    if (isBrowser) {
      setTheme(window['__theme']);

      window['__onThemeChange'] = function () {
        setTheme(window['__theme']);
      };
    }
  }, [isBrowser]);

  function updateTheme(theme: Theme) {
    window['__setPreferredTheme'](theme);
  }

  return (
    <label className="theme-switch" data-testid="theme-switch">
      <input
        type="checkbox"
        className="theme-switch__input"
        aria-label="Switch between light and dark mode"
        checked={theme === Theme.Dark}
        onChange={event => {
          updateTheme(event.target.checked ? Theme.Dark : Theme.Light);
        }}
      />
      {!!theme && (
        <span data-testid="theme-switch-label">
          theme: <strong>{theme}</strong>
        </span>
      )}
    </label>
  );
}

export default ThemeSwitch;
