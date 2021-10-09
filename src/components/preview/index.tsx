import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';

import { VimColorScheme, Background } from '@/models/vimColorScheme';

import Code from './code';
import VimRC from './vimRC';

import codeSample from './codeSample';

import './index.scss';

interface IProps {
  vimColorSchemes: VimColorScheme[];
}

function Preview({ vimColorSchemes }: IProps) {
  const defaultVimColorScheme = vimColorSchemes[0];
  const [index, setIndex] = useState<number>(0);

  const [background, setBackground] = useState<Background>(
    defaultVimColorScheme.defaultBackground,
  );

  const preview = useRef<HTMLDivElement>(null);

  const vimColorScheme = useMemo(() => vimColorSchemes[index], [index]);

  const canChangeVimColorScheme = useMemo(() => vimColorSchemes.length > 1, [
    vimColorSchemes,
  ]);

  const canToggleBackground = useMemo(
    () => vimColorScheme.backgrounds.length > 1,
    [vimColorScheme],
  );

  useEffect(() => {
    const groups = vimColorScheme.data[background];
    if (!groups?.length) {
      toggleBackground();
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
    const nextBackground =
      background === Background.Light ? Background.Dark : Background.Light;

    if (vimColorScheme.data[nextBackground]) {
      setBackground(nextBackground);
    }
  }

  if (!preview) {
    return null;
  }

  return (
    <div
      className={classnames('preview', {
        'preview--light': background === Background.Light,
        'preview--dark': background === Background.Dark,
      })}
      ref={preview}
    >
      <VimRC
        vimColorScheme={vimColorScheme}
        background={background}
        onChangeVimColorScheme={
          canChangeVimColorScheme ? changeVimColorScheme : undefined
        }
        onToggleBackground={canToggleBackground ? toggleBackground : undefined}
      />
      <Code
        fileName="code.vim"
        cursorLine={6}
        lineCount={16}
        className="preview__code"
      >
        <span dangerouslySetInnerHTML={{ __html: codeSample }} />
      </Code>
    </div>
  );
}

export default Preview;
