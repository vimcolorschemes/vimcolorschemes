import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { ExternalLink as ExternalLinkIcon } from "src/components/icons";

import "./index.scss";

const ExternalLink = ({ to, className, children, noIcon, icon, ...args }) => {
  const Icon = icon || ExternalLinkIcon;

  return (
    <a
      href={to}
      className={classnames(
        "external-link",
        { "external-link--inline": noIcon },
        className,
      )}
      // eslint-disable-next-line react/jsx-no-target-blank
      target="_blank"
      rel="noopener"
      {...args}
    >
      {children}
      {!noIcon && <Icon className="external-link__icon" />}
    </a>
  );
};

ExternalLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  noIcon: PropTypes.bool,
  icon: PropTypes.func,
  args: PropTypes.object,
};

export default ExternalLink;
