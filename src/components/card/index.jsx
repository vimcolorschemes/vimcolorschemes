import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";
import classnames from "classnames";

import { LAYOUTS, SECTIONS } from "src/constants";

import { URLify } from "src/utils/string";
import { getRepositoryInfos } from "src/utils/repository";

import RepositoryTitle from "src/components/repositoryTitle";
import { Star } from "src/components/icons";

import "./index.scss";

const Card = ({ repository, linkId, linkTabIndex, linkState, className }) => {
  const {
    ownerName,
    name,
    description,
    featuredImage,
    stargazersCount,
    lastCommitAt,
    createdAt,
  } = getRepositoryInfos(repository);

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
          {!!featuredImage && (
            <Img
              fluid={featuredImage.childImageSharp.fluid}
              alt={`${ownerName} ${name}`}
              imgStyle={{ objectFit: "contain" }}
            />
          )}
        </div>
        <div className="card__header">
          <h3 className="card__title">
            <RepositoryTitle ownerName={ownerName} name={name} />
          </h3>
          <div className="card__stargazers">
            <Star className="card__stargazers-icon" />
            <span className="card__stargazers-count">{stargazersCount}</span>
          </div>
        </div>
        <p className="card__infos">{description}</p>
        <p className="card__infos">
          Created <strong>{createdAt}</strong>
        </p>
        <p className="card__infos">
          Last commit <strong>{lastCommitAt}</strong>
        </p>
      </Link>
    </li>
  );
};

Card.propTypes = {
  repository: PropTypes.shape({
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    featuredImage: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.shape({}).isRequired,
      }).isRequired,
    }),
    stargazersCount: PropTypes.number.isRequired,
    lastCommitAt: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  linkState: PropTypes.object,
  className: PropTypes.string,
};

export default Card;
