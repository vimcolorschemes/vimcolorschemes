import 'typeface-source-sans-pro';
import 'typeface-ubuntu-mono';

export function onPreRouteUpdate() {
  // Adds a previousPath property that is available on all pages
  window.locations = window.locations || [document.referrer];
  window.locations.push(window.location.href);
  window.previousPath = window.locations[window.locations.length - 2];
}
