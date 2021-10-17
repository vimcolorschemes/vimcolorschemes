import React from 'react';
import { Link } from 'gatsby';

import { Repository } from '@/models/repository';

import Meta from '@/components/meta';
import Preview from '@/components/preview';

import './index.scss';

interface Props {
  repository: Repository;
}

function Card({ repository }: Props) {
  const linkLabel = `Go to page: ${repository.title}`;
  return (
    <article className="card">
      <Link to={repository.route} data-focusable className="card__ghost-link">
        {linkLabel}
      </Link>
      <Preview vimColorSchemes={repository.vimColorSchemes} />
      <Link to={repository.route} tabIndex={-1} aria-label={linkLabel}>
        <Meta repository={repository} />
      </Link>
    </article>
  );
}

export default Card;
