import React from "react";
import Img from "gatsby-image";
import PropTypes from "prop-types";

import "./index.scss";

const ZoomableImage = ({ image, className }) => {
  if (!image.childImageSharp?.fluid) return null;

  const renderedImage = (
    <Img
      fluid={image.childImageSharp.fluid}
      alt="TODO"
      className="zoomable__image"
      imgStyle={{ objectFit: "contain" }}
    />
  );

  return (
    <label className="zoomable">
      <input type="checkbox" className="zoomable__toggle" name="image-toggle" />
      <div
        className={`zoomable__container${!!className ? ` ${className}` : ""}`}
      >
        {renderedImage}
      </div>
      <div className="zoomable__modal">{renderedImage}</div>
    </label>
  );
};

ZoomableImage.propTypes = {
  image: PropTypes.shape({
    childImageSharp: PropTypes.shape({
      fluid: PropTypes.shape({}),
    }),
  }).isRequired,
  className: PropTypes.string,
};

export default ZoomableImage;
