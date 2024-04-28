'use client';

import { useState } from 'react';

import RepositoryDTO from '@/models/DTO/repository';
import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import Preview from '@/components/preview';

type InteractivePreviewProps = {
  repositoryDTO: RepositoryDTO;
  pageContext: PageContext;
};

export default function InteractivePreview({
  repositoryDTO,
  pageContext,
}: InteractivePreviewProps) {
  const repository = new Repository(repositoryDTO);

  const defaultColorscheme = repository.colorschemes[0];
  const defaultBackground = defaultColorscheme.getDefaultBackground(
    pageContext.filter?.background,
  );

  const [colorscheme, setColorscheme] = useState(defaultColorscheme);
  const [background, setBackground] = useState(defaultBackground);

  function onToggleColorscheme() {
    const index = repository.colorschemes.findIndex(
      c => c.name === colorscheme.name,
    );
    const nextIndex = (index + 1) % repository.colorschemes.length;
    setColorscheme(repository.colorschemes[nextIndex]);
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
        repository.colorschemes.length > 1 ? onToggleColorscheme : undefined
      }
      onToggleBackground={
        colorscheme.backgrounds.length > 1 ? onToggleBackground : undefined
      }
    />
  );
}
