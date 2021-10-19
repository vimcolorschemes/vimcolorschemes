import React, { useMemo } from 'react';

import DateHelper from '@/helpers/date';
import { Repository } from '@/models/repository';

import IconStar from '@/components/icons/star';
import IconTrendingUp from '@/components/icons/trendingUp';

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
          <div className="subtitle">{repository.owner.name}</div>
          <div className="meta__statistic">
            <IconStar className="meta__icon" />
            <b>{repository.stargazersCount}</b>
          </div>
        </div>
        <div className="meta__header-row">
          <TitleTag aria-label={repository.title} className="title">
            {repository.name}
          </TitleTag>
          {repository.weekStargazersCount > 0 && (
            <div className="meta__statistic">
              <IconTrendingUp className="meta__icon" />
              <span>
                <b>{repository.weekStargazersCount}</b>/week
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="meta__description">{repository.description}</div>
      <div className="meta__footer">
        <p className="meta__footer-row">
          Created{' '}
          <b>
            <time dateTime={repository.githubCreatedAt}>
              {DateHelper.fromNow(repository.githubCreatedAt)}
            </time>
          </b>
        </p>
        <p className="meta__footer-row">
          Last commit{' '}
          <b>
            <time dateTime={repository.lastCommitAt}>
              {DateHelper.fromNow(repository.lastCommitAt)}
            </time>
          </b>
        </p>
      </div>
    </div>
  );
}

export default Meta;
