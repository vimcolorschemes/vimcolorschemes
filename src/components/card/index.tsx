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
  return (
    <article className="card">
      <Link to={repository.route} data-focusable className="card__ghost-link">
        Go to page: {repository.title}
      </Link>
      <Preview vimColorSchemes={repository.vimColorSchemes} />
      <Meta repository={repository} />
    </article>
  );
}

export default Card;
