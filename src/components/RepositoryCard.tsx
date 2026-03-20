import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import Preview from '#/components/preview/Preview';
import type Repository from '#/models/repository';

type RepositoryCardProps = {
  repository: Repository;
};

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const initialColorscheme =
    repository.colorschemes.find(colorscheme =>
      colorscheme.backgrounds.includes('dark'),
    ) ?? repository.colorschemes.at(0);
  const initialBackground = initialColorscheme?.getDefaultBackground();

  const [colorscheme, setColorscheme] = useState(initialColorscheme);
  const [background, setBackground] = useState(initialBackground);

  function onToggleColorscheme() {
    if (!colorscheme) {
      return;
    }

    const index = repository.colorschemes.findIndex(
      current => current.name === colorscheme.name,
    );
    const nextIndex = (index + 1) % repository.colorschemes.length;
    const nextColorscheme = repository.colorschemes[nextIndex];

    setColorscheme(nextColorscheme);

    if (!background || !nextColorscheme.backgrounds.includes(background)) {
      setBackground(nextColorscheme.getDefaultBackground());
    }
  }

  function onToggleBackground() {
    if (!colorscheme || !background) {
      return;
    }

    const index = colorscheme.backgrounds.indexOf(background);
    const nextIndex = (index + 1) % colorscheme.backgrounds.length;
    setBackground(colorscheme.backgrounds[nextIndex]);
  }

  return (
    <article className="space-y-3">
      <h2 className="text-xl font-semibold">
        <Link
          to="/$owner/$name"
          params={{ owner: repository.owner.name, name: repository.name }}
        >
          {repository.title}
        </Link>
      </h2>
      {repository.description ? (
        <p className="text-sm text-muted-foreground">
          {repository.description}
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">
        {repository.stargazersCount.toLocaleString()} stars -{' '}
        {repository.weekStargazersCount.toLocaleString()}/week
      </p>
      {colorscheme && background ? (
        <div className="overflow-hidden rounded-md">
          <Preview
            colorscheme={colorscheme}
            background={background}
            onToggleColorscheme={
              repository.colorschemes.length > 1
                ? onToggleColorscheme
                : undefined
            }
            onToggleBackground={
              colorscheme.backgrounds.length > 1
                ? onToggleBackground
                : undefined
            }
          />
        </div>
      ) : null}
    </article>
  );
}
