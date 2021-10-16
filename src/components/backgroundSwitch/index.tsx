import React, { useEffect, useState } from 'react';

import Keys from '@/lib/keys';
import useShortcut from '@/hooks/shortcut';
import { Background } from '@/lib/background';

import './index.scss';

function BackgroundSwitch() {
  const isBrowser = typeof window !== 'undefined';

  const [background, setBackground] = useState<Background>();

  useShortcut({
    [Keys.Background]: () => {
      updateBackground(
        background === Background.Light ? Background.Dark : Background.Light,
      );
    },
  });

  useEffect(() => {
    if (isBrowser) {
      setBackground(window.__background);

      window.__onBackgroundChange = function () {
        setBackground(window.__background);
      };
    }
  }, [isBrowser]);

  function toggleBackground() {
    updateBackground(
      background === Background.Dark ? Background.Light : Background.Dark,
    );
  }

  function updateBackground(background: Background) {
    window.__setPreferredBackground(background);
  }

  return (
    <label className="background-switch" data-testid="background-switch">
      <input
        type="checkbox"
        className="background-switch__input"
        aria-label="Switch between light and dark background"
        checked={background === Background.Dark}
        onKeyDown={event => {
          if (event.key === Keys.Enter) {
            toggleBackground();
          }
        }}
        onChange={toggleBackground}
        data-focusable
      />
      {!!background && (
        <span data-testid="background-switch__label">
          <pre>
            <code>
              set background=
              <span className="background-switch__indicator">{background}</span>
            </code>
          </pre>
        </span>
      )}
    </label>
  );
}

export default BackgroundSwitch;
