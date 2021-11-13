import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';

import Background from '@/lib/background';
import { VimColorScheme } from '@/models/vimColorScheme';

import Code from './code';
import VimRC from './vimRC';

import codeSample from './codeSample';

import './index.scss';

interface Props {
  vimColorSchemes: VimColorScheme[];
  title?: React.ReactNode;
  className?: string;
  onLoad?: () => void;
}

function Preview({ vimColorSchemes, title, className, onLoad }: Props) {
  const [index, setIndex] = useState<number>(0);

  const [background, setBackground] = useState<Background>(
    vimColorSchemes[0].defaultBackground,
  );

  const preview = useRef<HTMLDivElement>(null);

  const vimColorScheme = useMemo(
    () => vimColorSchemes[index],
    [vimColorSchemes, index],
  );

  const canChangeVimColorScheme = useMemo(
    () => vimColorSchemes.length > 1,
    [vimColorSchemes],
  );

  const canToggleBackground = useMemo(
    () => vimColorScheme.backgrounds.length > 1,
    [vimColorScheme],
  );

  useEffect(() => {
    setBackground(vimColorSchemes[0].defaultBackground);
    setIndex(0);
  }, [vimColorSchemes]);

  useEffect(() => {
    const groups = vimColorScheme.data[background];
    if (!groups?.length) {
      toggleBackground();
      return;
    }

    groups.forEach(group => {
      preview.current?.style.setProperty(`--vim-${group.name}`, group.hexCode);
    });

    if (onLoad) {
      onLoad();
    }
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
      className={classnames('preview', className, {
        'preview--light': background === Background.Light,
        'preview--dark': background === Background.Dark,
      })}
      ref={preview}
    >
      <header className="preview__header">
        <div />
        <div />
        <div />
        <code data-ignore-a11y>{title || vimColorScheme.name}</code>
      </header>
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
        lineCount={12}
        className="preview__code"
      >
        <span dangerouslySetInnerHTML={{ __html: codeSample }} />
      </Code>
    </div>
  );
}

export default Preview;
