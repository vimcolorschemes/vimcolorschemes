import React, { useMemo } from 'react';
import classnames from 'classnames';

import DateHelper from '@/helpers/date';
import { Repository } from '@/models/repository';

import IconStar from '@/components/icons/star';
import IconTrendingUp from '@/components/icons/trendingUp';

import './index.scss';

interface Props {
  repository: Repository;
  isRepositoryPage?: boolean;
  className?: string;
}

export function MetaHeader({ repository, isRepositoryPage, className }: Props) {
  const TitleTag = useMemo(
    () => (isRepositoryPage ? 'h1' : 'h2'),
    [isRepositoryPage],
  );

  return (
    <header className={classnames('meta-header', className)}>
      <div className="meta-header__row">
        <div className="subtitle">{repository.owner.name}</div>
        <div className="meta-header__statistic">
          <IconStar className="meta-header__icon" />
          <b>{repository.stargazersCount}</b>
        </div>
      </div>
      <div className="meta-header__row">
        <TitleTag aria-label={repository.title} className="title">
          {repository.name}
        </TitleTag>
        {repository.weekStargazersCount > 0 && (
          <div className="meta-header__statistic">
            <IconTrendingUp className="meta-header__icon" />
            <span>
              <b>{repository.weekStargazersCount}</b>/week
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export function MetaDescription({ repository, className }: Props) {
  return (
    <div className={classnames('meta-description', className)}>
      {repository.description}
    </div>
  );
}

export function MetaFooter({ repository, className }: Props) {
  return (
    <footer className={classnames('meta-footer', className)}>
      <p className="meta-footer__row">
        Created{' '}
        <b>
          <time dateTime={repository.githubCreatedAt}>
            {DateHelper.fromNow(repository.githubCreatedAt)}
          </time>
        </b>
      </p>
      <p className="meta-footer__row">
        Last commit{' '}
        <b>
          <time dateTime={repository.lastCommitAt}>
            {DateHelper.fromNow(repository.lastCommitAt)}
          </time>
        </b>
      </p>
    </footer>
  );
}

function Meta({ repository, isRepositoryPage, className }: Props) {
  return (
    <section className={classnames('meta', className)}>
      <MetaHeader repository={repository} isRepositoryPage={isRepositoryPage} />
      <MetaDescription repository={repository} />
      <MetaFooter repository={repository} />
    </section>
  );
}

export default Meta;
