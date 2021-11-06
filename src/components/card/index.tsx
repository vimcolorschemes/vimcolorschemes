import React, { useEffect, useMemo } from 'react';
import { Link } from 'gatsby';

import Background from '@/lib/background';
import useForceUpdate from '@/hooks/update';
import { Repository } from '@/models/repository';

import Meta from '@/components/meta';
import Preview from '@/components/preview';

import './index.scss';

interface Props {
  repository: Repository;
  activeFilters: Background[];
  onClick?: () => void;
}

function Card({ repository, activeFilters, onClick }: Props) {
  const forceUpdate = useForceUpdate();

  const linkLabel = `Go to page: ${repository.title}`;

  const isDarkFilterChecked = useMemo(
    () => activeFilters.includes(Background.Dark),
    [activeFilters],
  );

  const defaultBackground: Background = useMemo(() => {
    if (isDarkFilterChecked) {
      return Background.Dark;
    }
    return Background.Light;
  }, [isDarkFilterChecked]);

  useEffect(() => {
    repository.defaultBackground = defaultBackground;
    forceUpdate();
  }, [repository, defaultBackground]);

  return (
    <article className="card">
      <Link
        to={repository.route}
        data-focusable
        className="card__ghost-link"
        onClick={onClick}
      >
        {linkLabel}
      </Link>
      <Preview vimColorSchemes={repository.vimColorSchemes} />
      <Link
        to={repository.route}
        aria-label={linkLabel}
        className="card__link"
        onClick={onClick}
      >
        <Meta repository={repository} />
      </Link>
    </article>
  );
}

export default Card;
