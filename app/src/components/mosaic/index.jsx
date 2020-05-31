import React from "react";
import Img from "gatsby-image";
import PropTypes from "prop-types";

import "./index.scss";

const Mosaic = ({ images }) => {
  return (
    <div className="mosaic">
      {images.map(image => {
        if (!image.childImageSharp?.fluid) return;
        const Image = () => (
          <Img
            fluid={image.childImageSharp.fluid}
            alt="TODO"
            className="mosaic__image"
            imgStyle={{ objectFit: "contain" }}
          />
        );
        return (
          <label
            key={`repository-image-${image.childImageSharp.fluid.src}`}
            className="mosaic__item"
          >
            <input
              type="checkbox"
              name="mosaic-image"
              className="mosaic__image-toggler"
            />
            <div className="mosaic__image-container">
              <Image />
            </div>
            <div className="mosaic__image-modal">
              <Image />
            </div>
          </label>
        );
      })}
    </div>
  );
};

Mosaic.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.shape({}),
      }),
    }),
  ).isRequired,
};

export default Mosaic;
