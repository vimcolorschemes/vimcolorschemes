import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { ExternalLink as ExternalLinkLinkIcon } from "../icons";

import "./index.scss";

const ExternalLink = ({ to, className, children, noIcon, ...args }) => (
  <a
    href={to}
    className={classnames(
      "external-link",
      { "external-link--inline": noIcon },
      className,
    )}
    target="_blank"
    rel="noopener noreferrer"
    {...args}
  >
    {children}
    {!noIcon && <ExternalLinkLinkIcon className="external-link__icon" />}
  </a>
);

ExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  noIcon: PropTypes.bool,
  args: PropTypes.object,
};

export default ExternalLink;
