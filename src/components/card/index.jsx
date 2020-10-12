import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";
import classnames from "classnames";

import { RepositoryType } from "src/types";

import { LAYOUTS, SECTIONS } from "src/constants";

import { URLify } from "src/utils/string";
import { getFirstProcessedImage } from "src/utils/repository";

import RepositoryMeta from "src/components/repositoryMeta";

import "./index.scss";

const Card = ({ repository, linkId, linkTabIndex, linkState, className }) => {
  const {
    owner: { name: ownerName },
    name,
    featuredImage,
    images,
  } = repository;

  const fluidImage = getFirstProcessedImage(featuredImage, images);

  const imageStyle = {
    objectFit: "contain",
    maxHeight: "100%",
    width: "100%",
  };

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
          {!!fluidImage &&
            (fluidImage.base64 ? (
              <Img
                fluid={fluidImage}
                alt={`${ownerName} ${name}`}
                imgStyle={imageStyle}
              />
            ) : (
              <img
                src={fluidImage.src}
                alt={`${ownerName} ${name}`}
                style={imageStyle}
              />
            ))}
        </div>
        <RepositoryMeta repository={repository} tag="h3" />
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
