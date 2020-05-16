import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";

import "./index.scss";

const Card = ({
  title,
  subtitle,
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
            alt={`${title}`}
            className="card__image"
          />
        )}
      </div>
      {!!subtitle && <h2 className="card__subtitle">{subtitle}</h2>}
      <h1 className="card__title">{title}</h1>
      <p className="card__description">{description}</p>
      {!!metaContent && metaContent}
    </CardContainer>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
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
