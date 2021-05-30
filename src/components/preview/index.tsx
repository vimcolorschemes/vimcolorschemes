import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';

import { VimColorScheme, Background } from '@/models';

import codeSample from './codeSample';

import './index.scss';

interface IProps {
  vimColorSchemes: VimColorScheme[];
}

function Preview({ vimColorSchemes }: IProps) {
  const defaultVimColorScheme = vimColorSchemes[0];
  const [index, setIndex] = useState<number>(0);

  const defaultBackground = Background.Light;
  const initialBackground =
    defaultVimColorScheme.backgrounds.length === 2
      ? defaultBackground
      : defaultVimColorScheme.backgrounds[0];
  const [background, setBackground] = useState<Background>(initialBackground);

  const preview = useRef<HTMLDivElement>(null);

  const vimColorScheme = useMemo(() => vimColorSchemes[index], [index]);

  useEffect(() => {
    const groups = vimColorScheme.data[background];
    if (!groups?.length) {
      return;
    }

    groups.forEach(group => {
      preview.current?.style.setProperty(`--vim-${group.name}`, group.hexCode);
    });
  }, [background, vimColorScheme, preview]);

  function changeVimColorScheme() {
    if (vimColorSchemes.length < 2) {
      return;
    }

    const nextIndex = index + 1;
    if (nextIndex >= vimColorSchemes.length) {
      setIndex(0);
      return;
    }

    setIndex(nextIndex);
  }

  function toggleBackground() {
    if (vimColorScheme.backgrounds.length < 2) {
      return;
    }

    setBackground(
      background === Background.Light ? Background.Dark : Background.Light,
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <div className="preview" ref={preview}>
      {vimColorSchemes.length > 1 && (
        <button type="button" onClick={changeVimColorScheme}>
          change vim color scheme
        </button>
      )}
      {vimColorScheme.backgrounds.length > 1 && (
        <button type="button" onClick={toggleBackground}>
          toggle background
        </button>
      )}
      <p>{vimColorScheme.name}</p>
      <pre
        className={classnames('preview__code', {
          'preview__code--light': background === Background.Light,
          'preview__code--dark': background === Background.Dark,
        })}
      >
        <code dangerouslySetInnerHTML={{ __html: codeSample }} />
      </pre>
    </div>
  );
}

export default Preview;
