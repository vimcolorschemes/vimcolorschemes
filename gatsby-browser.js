import 'typeface-source-sans-pro';
import 'typeface-ubuntu-mono';

import './src/styles/reset.scss';
import './src/styles/variables.scss';
import './src/styles/global.scss';

export function onPreRouteUpdate() {
  // Adds a previousPath property that is available on all pages
  window.locations = window.locations || [document.referrer];
  window.locations.push(window.location.href);
  window.previousPath = window.locations[window.locations.length - 2];
}
