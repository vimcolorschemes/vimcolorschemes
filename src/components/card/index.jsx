import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";

import "./index.scss";

const Card = ({
  ownerName,
  name,
  description,
  image,
  metaContent,
  linkTo,
  linkState,
  linkRef,
}) => {
  return (
    <li className="card">
      <div className="card__image">
        {!!image && (
          <Img
            fluid={image.childImageSharp.fluid}
            alt={`${ownerName} ${name}`}
          />
        )}
      </div>
      <h2 className="card__title">
        <Link to={linkTo} state={linkState} ref={linkRef}>
          {ownerName}/{name}
        </Link>
      </h2>
      <p className="card__description">{description}</p>
      {!!metaContent && metaContent}
    </li>
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
