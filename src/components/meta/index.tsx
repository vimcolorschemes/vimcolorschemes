import React, { useMemo } from 'react';

import DateHelper from '@/helpers/date';
import { Repository } from '@/models/repository';

import './index.scss';

interface Props {
  repository: Repository;
  isRepositoryPage?: boolean;
}

function Meta({ repository, isRepositoryPage }: Props) {
  const TitleTag = useMemo(
    () => (isRepositoryPage ? 'h1' : 'h2'),
    [isRepositoryPage],
  );

  return (
    <div className="meta">
      <div className="meta__header">
        <div className="meta__header-row">
          <div>{repository.owner.name}</div>
          <div>{repository.stargazersCount}</div>
        </div>
        <div className="meta__header-row">
          <TitleTag aria-label={repository.title}>{repository.name}</TitleTag>
          <div>{repository.weekStargazersCount}</div>
        </div>
      </div>
      <div className="meta__description">{repository.description}</div>
      <div className="meta__footer">
        <p>{DateHelper.fromNow(repository.githubCreatedAt)}</p>
        <p>{DateHelper.fromNow(repository.lastCommitAt)}</p>
      </div>
    </div>
  );
}

export default Meta;
