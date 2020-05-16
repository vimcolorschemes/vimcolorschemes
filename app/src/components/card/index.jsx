import React from "react";
import Img from "gatsby-image";
import PropTypes from "prop-types";

import "./index.scss";

const Card = ({ title, description, image, metaContent }) => (
  <div className="card">
    <h1>{title}</h1>
    <p>{description}</p>
    {!!image && <Img fluid={image.childImageSharp.fluid} alt={`${title}`} />}
    {!!metaContent && metaContent}
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.shape({
    childImageSharp: PropTypes.shape({
      fluid: PropTypes.shape({}).isRequired,
    }).isRequired,
  }),
  metaContent: PropTypes.node,
};

export default Card;
