import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";
import classnames from "classnames";

import { RepositoryType } from "src/types";

import { LAYOUTS, SECTIONS } from "src/constants";

import { URLify } from "src/utils/string";
import { format } from "src/utils/date";
import { getFirstProcessedFluidImage } from "src/utils/repository";

import { Star, TrendingUp } from "src/components/icons";

import RepositoryTitle from "src/components/repositoryTitle";

import "./index.scss";

const Card = ({ repository, linkId, linkTabIndex, linkState, className }) => {
  const {
    owner: { name: ownerName },
    name,
    description,
    featuredImage,
    images,
    stargazersCount,
    weekStargazersCount,
    lastCommitAt,
    createdAt,
  } = repository;

  const fluidImage = getFirstProcessedFluidImage(featuredImage, images);

  return (
    <li className={classnames("card", className)}>
      <Link
        to={`/${URLify(`${ownerName}/${name}`)}`}
        state={linkState}
        id={linkId}
        tabIndex={linkTabIndex}
        data-section={SECTIONS.REPOSITORIES}
        data-layout={LAYOUTS.GRID}
        aria-label={`${name}, by ${ownerName}`}
      >
        <div className="card__image">
          {!!fluidImage && (
            <Img
              fluid={fluidImage}
              alt={`${ownerName} ${name}`}
              imgStyle={{ objectFit: "contain" }}
            />
          )}
        </div>
        <div className="card__header">
          <h3 className="card__title">
            <RepositoryTitle ownerName={ownerName} name={name} />
          </h3>
          <div className="card__meta">
            <div className="card__stargazers">
              <Star className="card__icon" />
              <span className="card__stargazers-count">
                <strong>{stargazersCount}</strong>
              </span>
            </div>
            {!!weekStargazersCount && (
              <div className="card__trending-stargazers-count">
                <TrendingUp className="card__icon" />
                <span>
                  <strong>{weekStargazersCount}</strong>/week
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="card__infos">{description}</p>
        <p className="card__infos">
          Created <strong>{format(createdAt)}</strong>
        </p>
        <p className="card__infos">
          Last commit <strong>{format(lastCommitAt)}</strong>
        </p>
      </Link>
    </li>
  );
};

Card.propTypes = {
  repository: RepositoryType.isRequired,
  linkState: PropTypes.object,
  className: PropTypes.string,
};

export default Card;
