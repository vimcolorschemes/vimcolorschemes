'use client';

import { CSSProperties, useEffect, useRef } from 'react';

type RepositoryPageThemeScopeProps = {
  style: CSSProperties | undefined;
};

export default function RepositoryPageThemeScope({
  style,
}: RepositoryPageThemeScopeProps) {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!style) {
      return;
    }

    const marker = markerRef.current;
    const scope =
      marker?.closest('dialog') ??
      marker?.closest('.repositoryDetailsPage') ??
      marker?.parentElement;

    if (!(scope instanceof HTMLElement)) {
      return;
    }

    const entries = Object.entries(style).filter(([key]) =>
      key.startsWith('--colorscheme-'),
    );
    const previousValues = new Map(
      entries.map(([key]) => [key, scope.style.getPropertyValue(key)]),
    );

    entries.forEach(([key, value]) => {
      scope.style.setProperty(key, String(value));
    });

    return () => {
      entries.forEach(([key]) => {
        const previousValue = previousValues.get(key);

        if (previousValue) {
          scope.style.setProperty(key, previousValue);
        } else {
          scope.style.removeProperty(key);
        }
      });
    };
  }, [style]);

  return <span ref={markerRef} hidden />;
}
