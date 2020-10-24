import React, { useRef } from "react";
import classnames from "classnames";
import { GatsbyImage } from "gatsby-plugin-image/compat";
import PropTypes from "prop-types";

import { KEYS } from "src/constants";

import "./index.scss";

const ZoomableImage = ({ image, className, ...inputArgs }) => {
  const input = useRef(null);

  if (!image.childImageSharp?.fluid) return null;

  const renderedImage = (
    <GatsbyImage
      fluid={image.childImageSharp.fluid}
      alt="zoomable"
      className="zoomable__image"
      imgStyle={{ objectFit: "contain", cursor: "pointer" }}
    />
  );

  const onKeyDown = event => {
    const { key, target } = event;

    // pressed key is not handled by app.
    // Keeps doing what it was about to do.
    if (!Object.values(KEYS).includes(key)) return;

    // checkbox toggle keys
    if ([KEYS.SPACE, KEYS.ENTER].includes(event.key)) {
      event.preventDefault();
      target.checked = !target.checked;
      return;
    }

    // Anything else keeps doing what it was about to do,
    // but also unchecks the checkbox
    target.checked = false;
  };

  return (
    <label className="zoomable">
      <input
        ref={input}
        type="checkbox"
        className="zoomable__toggle"
        name="image-toggle"
        onKeyDown={onKeyDown}
        aria-label="Zoom on focused image"
        {...inputArgs}
      />
      <div className={classnames("zoomable__container", className)}>
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
