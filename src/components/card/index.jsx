import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";
import classnames from "classnames";

import RepositoryTitle from "../repositoryTitle";

import "./index.scss";

const Card = ({
  ownerName,
  name,
  description,
  image,
  metaContent,
  linkId,
  linkTabIndex,
  linkTo,
  linkState,
  className,
}) => {
  return (
    <li className={classnames("card", className)}>
      <div className="card__image">
        {!!image && (
          <Img
            fluid={image.childImageSharp.fluid}
            alt={`${ownerName} ${name}`}
          />
        )}
      </div>
      <h2 className="card__title">
        <Link to={linkTo} state={linkState} id={linkId} tabIndex={linkTabIndex}>
          <RepositoryTitle ownerName={ownerName} name={name} tag="div" />
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
  linkId: PropTypes.string.isRequired,
  linkTabIndex: PropTypes.number.isRequired,
  linkTo: PropTypes.string,
  linkState: PropTypes.object,
  className: PropTypes.string,
};

export default Card;
