import React from 'react';
import { Link } from 'gatsby';

import { Repository } from '@/models/repository';

import Meta from '@/components/meta';
import Preview from '@/components/preview';

import './index.scss';

interface Props {
  repository: Repository;
  onClick?: () => void;
}

function Card({ repository, onClick }: Props) {
  const linkLabel = `Go to page: ${repository.title}`;
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
