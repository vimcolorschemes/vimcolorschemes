import React from 'react';
import { Link } from 'gatsby';

import { Repository } from '@/models';

import Preview from '@/components/preview';

import './index.scss';

interface IProps {
  repository: Repository;
}

function Card({ repository }: IProps) {
  return (
    <article className="card">
      <Link to={repository.route}>
        <h3 className="card__title">{repository.key}</h3>
      </Link>
      <p className="card__description">{repository.description}</p>
      <Preview vimColorSchemes={repository.vimColorSchemes} />
    </article>
  );
}

export default Card;
