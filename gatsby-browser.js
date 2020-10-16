import "typeface-source-sans-pro";

import "./src/style/reset.css";
import "./src/style/index.scss";

export const onPreRouteUpdate = () => {
  window.locations = window.locations || [document.referrer];
  window.locations.push(window.location.href);
  window.previousPath = window.locations[window.locations.length - 2];
};
