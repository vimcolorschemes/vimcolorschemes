import React from "react";
import PropTypes from "prop-types";

import { LAYOUTS, SECTIONS } from "src/constants";

import ZoomableImage from "src/components/zoomableImage";

import "./index.scss";

const Mosaic = ({ images }) => (
  <div className="mosaic">
    {images.map((image, index) => (
      <ZoomableImage
        key={`repository-image-${image.id}-${index}`}
        image={image}
        className=""
        data-section={SECTIONS.REPOSITORY_MOSAIC}
        data-layout={LAYOUTS.GRID}
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
