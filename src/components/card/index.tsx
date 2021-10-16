import React from 'react';

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
      <Preview vimColorSchemes={repository.vimColorSchemes} />
      <Meta repository={repository} />
    </article>
  );
}

export default Card;
