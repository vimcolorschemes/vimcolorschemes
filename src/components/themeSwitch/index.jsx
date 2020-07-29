import React, { useState, useEffect } from "react";

import { THEMES } from "../../constants";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(window.__theme);
      window.__onThemeChange = () => setTheme(window.__theme);
    }
  }, []);

  return (
    <div>
      <p>hello, theme is {theme}</p>
      <input
        type="checkbox"
        checked={theme === THEMES.DARK}
        onChange={event =>
          window.__setPreferredTheme(
            event.target.checked ? THEMES.DARK : THEMES.LIGHT,
          )
        }
      />
    </div>
  );
};

export default ThemeSwitch;
