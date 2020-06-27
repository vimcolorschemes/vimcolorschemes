import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";

import RepositoryTitle from "../repositoryTitle";

import "./index.scss";

const Card = ({
  ownerName,
  name,
  description,
  image,
  metaContent,
  linkTo = null,
  linkState = null,
}) => {
  const CardContainer = ({
    className = "",
    linkTo = null,
    linkState = null,
    children,
  }) =>
    !!linkTo ? (
      <Link
        to={linkTo}
        state={!!linkState ? linkState : undefined}
        className={className}
      >
        {children}
      </Link>
    ) : (
      <div className={className}>{children}</div>
    );

  return (
    <CardContainer className="card" linkTo={linkTo} linkState={linkState}>
      <div className="card__image-container">
        {!!image && (
          <Img
            fluid={image.childImageSharp.fluid}
            alt={`${ownerName} ${name}`}
            className="card__image"
          />
        )}
      </div>
      <RepositoryTitle
        ownerName={ownerName}
        name={name}
        className="card__repository-title"
      />
      <p className="card__description">{description}</p>
      {!!metaContent && metaContent}
    </CardContainer>
  );
};

Card.propTypes = {
  ownerName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.shape({
    childImageSharp: PropTypes.shape({
      fluid: PropTypes.shape({}).isRequired,
    }).isRequired,
  }),
  metaContent: PropTypes.node,
  linkTo: PropTypes.string,
  linkState: PropTypes.object,
};

export default Card;
