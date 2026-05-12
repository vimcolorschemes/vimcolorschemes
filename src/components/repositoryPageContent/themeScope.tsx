'use client';

import { CSSProperties, useEffect } from 'react';

type RepositoryPageThemeScopeProps = {
  style: CSSProperties | undefined;
};

export default function RepositoryPageThemeScope({
  style,
}: RepositoryPageThemeScopeProps) {
  useEffect(() => {
    if (!style) {
      return;
    }

    const root = document.documentElement;
    const entries = Object.entries(style).filter(([key]) =>
      key.startsWith('--colorscheme-'),
    );

    entries.forEach(([key, value]) => {
      root.style.setProperty(key, String(value));
    });

    return () => {
      entries.forEach(([key]) => {
        root.style.removeProperty(key);
      });
    };
  }, [style]);

  return null;
}
