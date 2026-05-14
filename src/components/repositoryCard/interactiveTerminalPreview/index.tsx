'use client';

import cn from 'classnames';
import { CSSProperties, useState } from 'react';

import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import { Background } from '@/lib/backgrounds';
import type { PageContext } from '@/lib/pageContext';

import { cardCodePreviewClassName } from '@/components/card';

import { CodeSnippetLines } from '../../preview/codeSnippet';
import { ColorschemeConfigLines } from '../../preview/colorschemeConfig';
import Code from '../../ui/code';

type InteractiveTerminalPreviewProps = {
  repositoryDTO: RepositoryDTO;
  pageContext: PageContext;
  className?: string;
  onVariantChange?: (variant: {
    colorscheme: string;
    background: Background;
  }) => void;
};

export default function RepositoryCardInteractiveTerminalPreview({
  repositoryDTO,
  pageContext,
  className,
  onVariantChange,
}: InteractiveTerminalPreviewProps) {
  const repository = new Repository(repositoryDTO);

  const prioritizedBackground =
    pageContext.filter?.background === 'both'
      ? undefined
      : pageContext.filter?.background;
  const defaultColorscheme = repository.getDefaultColorscheme(
    prioritizedBackground,
  );
  const defaultBackground = defaultColorscheme.getDefaultBackground(
    prioritizedBackground,
  );

  const [colorscheme, setColorscheme] = useState(defaultColorscheme);
  const [background, setBackground] = useState(defaultBackground);

  const style = colorscheme.data[background]?.reduce(
    (acc, group) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  ) as CSSProperties | undefined;

  function onToggleColorscheme() {
    const colorschemes = repository.getOrderedColorschemes();
    const index = colorschemes.findIndex(c => c.name === colorscheme.name);
    const nextIndex = (index + 1) % colorschemes.length;
    const newColorscheme = colorschemes[nextIndex];
    const newBackground = newColorscheme.backgrounds.includes(background)
      ? background
      : newColorscheme.backgrounds[0];

    setColorscheme(newColorscheme);
    setBackground(newBackground);
    onVariantChange?.({
      colorscheme: newColorscheme.name,
      background: newBackground,
    });
  }

  function onToggleBackground() {
    const index = colorscheme.backgrounds.indexOf(background);
    const nextIndex = (index + 1) % colorscheme.backgrounds.length;
    const newBackground = colorscheme.backgrounds[nextIndex];

    setBackground(newBackground);
    onVariantChange?.({
      colorscheme: colorscheme.name,
      background: newBackground,
    });
  }

  return (
    <Code
      fileName={colorscheme.name}
      lineCount={15}
      activeLine={9}
      data-background={background}
      hideStatusLine
      className={cn(cardCodePreviewClassName, className)}
      style={style}
    >
      <ColorschemeConfigLines
        colorscheme={colorscheme}
        background={background}
        onToggleColorscheme={
          repository.getOrderedColorschemes().length > 1
            ? onToggleColorscheme
            : undefined
        }
        onToggleBackground={
          colorscheme.backgrounds.length > 1 ? onToggleBackground : undefined
        }
      />
      <div />
      <CodeSnippetLines />
    </Code>
  );
}
