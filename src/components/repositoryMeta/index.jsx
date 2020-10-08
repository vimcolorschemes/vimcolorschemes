import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { format } from "src/utils/date";

import { RepositoryType } from "src/types";

import { Star, TrendingUp } from "src/components/icons";

import "./index.scss";

const Date = ({ name, value }) => (
  <p className="repository__infos">
    {`${name} `}
    <time className="repository__date" dateTime={value}>
      {format(value)}
    </time>
  </p>
);

const RepositoryMeta = ({ repository, tag, className }) => {
  const TitleTag = tag;

  const {
    owner: { name: ownerName },
    name,
    description,
    stargazersCount,
    weekStargazersCount,
    lastCommitAt,
    createdAt,
  } = repository;

  return (
    <>
      <div className="repository__header">
        <TitleTag className={classnames("repository-title", className)}>
          <span className="repository-title__owner-name">{ownerName} </span>
          <span className="repository-title__name title">{name}</span>
        </TitleTag>

        <div className="repository__meta">
          <div className="repository__stargazers">
            <Star className="repository__icon" />
            <span className="repository__stargazers-count">
              <strong>{stargazersCount}</strong>
            </span>
          </div>
          {!!weekStargazersCount && (
            <div className="repository__trending-stargazers-count">
              <TrendingUp className="repository__icon" />
              <span>
                <strong>{weekStargazersCount}</strong>/week
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="repository__infos">{description}</p>
      <Date name="Created" value={createdAt} />
      <Date name="Last commit" value={lastCommitAt} />
    </>
  );
};

RepositoryMeta.defaultProps = {
  tag: "span",
};

RepositoryMeta.propTypes = {
  repository: RepositoryType.isRequired,
  tag: PropTypes.string,
  className: PropTypes.string,
};

export default RepositoryMeta;
