import React, { useEffect, useState } from 'react';

import Keys from '@/lib/keys';
import useShortcut from '@/hooks/shortcut';
import { Theme } from '@/lib/themes';

import './index.scss';

function ThemeSwitch() {
  const isBrowser = typeof window !== 'undefined';

  const [theme, setTheme] = useState<Theme>();

  useShortcut({
    [Keys.Background]: () => {
      updateTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
    },
  });

  useEffect(() => {
    if (isBrowser) {
      setTheme(window.__theme);

      window.__onThemeChange = function () {
        setTheme(window.__theme);
      };
    }
  }, [isBrowser]);

  function updateTheme(theme: Theme) {
    window.__setPreferredTheme(theme);
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
        data-focusable
      />
      {!!theme && (
        <span data-testid="theme-switch__label">
          theme: <strong>{theme}</strong>
        </span>
      )}
    </label>
  );
}

export default ThemeSwitch;
