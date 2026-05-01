'use client';

import cn from 'classnames';
import { CSSProperties, useState } from 'react';

import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import type { PageContext } from '@/lib/pageContext';

import { cardCodePreviewClassName } from '@/components/card';

import { CodeSnippetLines } from '../../preview/codeSnippet';
import { ColorschemeConfigLines } from '../../preview/colorschemeConfig';
import Code from '../../ui/code';

type InteractiveTerminalPreviewProps = {
  repositoryDTO: RepositoryDTO;
  pageContext: PageContext;
  className?: string;
};

export default function RepositoryCardInteractiveTerminalPreview({
  repositoryDTO,
  pageContext,
  className,
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
    const index = repository.colorschemes.findIndex(
      c => c.name === colorscheme.name,
    );
    const nextIndex = (index + 1) % repository.colorschemes.length;
    const newColorscheme = repository.colorschemes[nextIndex];
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
    <Code
      fileName={colorscheme.name}
      lineCount={15}
      activeLine={9}
      hideStatusLine
      className={cn(cardCodePreviewClassName, className)}
      style={style}
    >
      <ColorschemeConfigLines
        colorscheme={colorscheme}
        background={background}
        onToggleColorscheme={
          repository.colorschemes.length > 1 ? onToggleColorscheme : undefined
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
