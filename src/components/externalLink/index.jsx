import React from "react";
import classnames from "classnames";

import { ExternalLink as ExternalLinkLinkIcon } from "../icons";

import "./index.scss";

const ExternalLink = ({ to, className, children, ...args }) => {
  return (
    <a
      href={to}
      className={classnames("external-link", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...args}
    >
      {children}
      <ExternalLinkLinkIcon className="external-link__icon" />
    </a>
  );
};

export default ExternalLink;
