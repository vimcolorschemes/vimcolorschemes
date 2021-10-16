import React, { useMemo } from 'react';
import { Link } from 'gatsby';

import { Repository } from '@/models/repository';

import './index.scss';

interface Props {
  repository: Repository;
  isRepositoryPage?: boolean;
}

function Meta({ repository, isRepositoryPage }: Props) {
  const TitleTag = useMemo(() => (isRepositoryPage ? 'h1' : 'h2'), [
    isRepositoryPage,
  ]);

  const Title = ({ children }) =>
    !isRepositoryPage ? (
      <Link to={`/${repository.key.toLowerCase()}`} data-focusable>
        <TitleTag>{children}</TitleTag>
      </Link>
    ) : (
      <TitleTag>{children}</TitleTag>
    );

  return (
    <div className="meta">
      <div className="meta__header">
        <div className="meta__header-row">
          <div>{repository.owner.name}</div>
          <div>{repository.stargazersCount}</div>
        </div>
        <div className="meta__header-row">
          <Title>{repository.name}</Title>
          <div>{repository.weekStargazersCount}</div>
        </div>
      </div>
      <div className="meta__description">{repository.description}</div>
      <div className="meta__footer">
        <p>{repository.githubCreatedAt}</p>
        <p>{repository.lastCommitAt}</p>
      </div>
    </div>
  );
}

export default Meta;
