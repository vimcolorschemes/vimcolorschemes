import 'typeface-source-sans-pro';
import 'typeface-ubuntu-mono';

import './src/styles/reset.scss';
import './src/styles/variables.scss';
import './src/styles/global.scss';

export function onPreRouteUpdate() {
  addPreviousPath();
}

export function onRouteUpdate(location) {
  focus(location);
}

/*
 * Adds a previousPath property that is available on all pages
 */
function addPreviousPath() {
  window.locations = window.locations || [document.referrer];
  window.locations.push(window.location.href);
  window.previousPath = window.locations[window.locations.length - 2];
}

/*
 * Focuses on an element if a selector is provided in the location state
 *
 * @param {Location} location
 */
function focus({ location }) {
  if (location.state && location.state.focusSelector != null) {
    const element = document.querySelector(location.state.focusSelector);
    if (element) {
      element.focus();
    }
  }
}
