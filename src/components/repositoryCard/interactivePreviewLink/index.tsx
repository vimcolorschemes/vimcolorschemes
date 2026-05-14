'use client';

import { useCallback, useState } from 'react';

import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import { Background } from '@/lib/backgrounds';
import type { PageContext } from '@/lib/pageContext';

import Card from '@/components/card';

import RepositoryCardInteractiveTerminalPreview from '../interactiveTerminalPreview';

type RepositoryCardInteractivePreviewLinkProps = {
  repositoryDTO: RepositoryDTO;
  pageContext: PageContext;
};

export default function RepositoryCardInteractivePreviewLink({
  repositoryDTO,
  pageContext,
}: RepositoryCardInteractivePreviewLinkProps) {
  const repository = new Repository(repositoryDTO);
  const prioritizedBackground =
    pageContext.filter?.background === 'both'
      ? undefined
      : pageContext.filter?.background;
  const colorscheme = repository.getDefaultColorscheme(prioritizedBackground);
  const background = colorscheme.getDefaultBackground(prioritizedBackground);
  const defaultVariant = repository.defaultVariant;
  const [selectedVariant, setSelectedVariant] = useState({
    colorscheme: colorscheme.name,
    background,
  });
  const isDefaultVariant =
    selectedVariant.colorscheme === defaultVariant?.name &&
    selectedVariant.background === defaultVariant.backgrounds[0];
  const href = isDefaultVariant
    ? repository.route
    : `${repository.route}?colorscheme=${encodeURIComponent(
        selectedVariant.colorscheme,
      )}&background=${encodeURIComponent(selectedVariant.background)}`;

  const onVariantChange = useCallback(
    (variant: { colorscheme: string; background: Background }) => {
      setSelectedVariant(variant);
    },
    [],
  );

  return (
    <>
      <Card.Link href={href} label={repository.title} />
      <Card.Preview flush interactiveControls>
        <RepositoryCardInteractiveTerminalPreview
          repositoryDTO={repositoryDTO}
          pageContext={pageContext}
          onVariantChange={onVariantChange}
        />
      </Card.Preview>
    </>
  );
}
