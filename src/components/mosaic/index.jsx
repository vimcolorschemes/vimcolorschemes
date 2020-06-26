import React from "react";
import PropTypes from "prop-types";

import ZoomableImage from "../zoomableImage";

import "./index.scss";

const Mosaic = ({ images }) => (
  <div className="mosaic">
    {images.map(image => (
      <ZoomableImage
        key={`repository-image-${image.childImageSharp.fluid.src}`}
        image={image}
        className=""
      />
    ))}
  </div>
);

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
