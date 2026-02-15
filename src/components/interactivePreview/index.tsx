'use client';

import { useState } from 'react';

import Colorscheme from '@/models/colorscheme';
import ColorschemeDTO from '@/models/DTO/colorscheme';

import PageContext from '@/lib/pageContext';

import Preview from '@/components/preview';

type InteractivePreviewProps = {
  colorschemes: ColorschemeDTO[];
  pageContext: PageContext;
  className?: string;
};

export default function InteractivePreview({
  colorschemes,
  pageContext,
  className,
}: InteractivePreviewProps) {
  const parsedColorschemes = colorschemes.map(dto => new Colorscheme(dto));
  const preferredBackground = pageContext.filter?.background;
  const defaultColorscheme = preferredBackground
    ? parsedColorschemes.find(colorscheme =>
        colorscheme.backgrounds.includes(preferredBackground),
      ) || parsedColorschemes[0]
    : parsedColorschemes[0];
  const defaultBackground =
    defaultColorscheme.getDefaultBackground(preferredBackground);

  const [colorscheme, setColorscheme] = useState(defaultColorscheme);
  const [background, setBackground] = useState(defaultBackground);

  function onToggleColorscheme() {
    const index = parsedColorschemes.findIndex(
      c => c.name === colorscheme.name,
    );
    const nextIndex = (index + 1) % parsedColorschemes.length;
    const newColorscheme = parsedColorschemes[nextIndex];
    setColorscheme(newColorscheme);

    if (!newColorscheme.backgrounds.includes(background)) {
      setBackground(newColorscheme.backgrounds[0]);
    }
  }

  function onToggleBackground() {
    const index = colorscheme.backgrounds.indexOf(background);
    const nextIndex = (index + 1) % colorscheme.backgrounds.length;
    setBackground(colorscheme.backgrounds[nextIndex]);
  }

  return (
    <Preview
      colorscheme={colorscheme}
      background={background}
      onToggleColorscheme={
        parsedColorschemes.length > 1 ? onToggleColorscheme : undefined
      }
      onToggleBackground={
        colorscheme.backgrounds.length > 1 ? onToggleBackground : undefined
      }
      className={className}
    />
  );
}
