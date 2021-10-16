import DOMHelper from '@/helpers/dom';
import useShortcut from '@/hooks/shortcut';

enum Direction {
  Left = 'left',
  Down = 'down',
  Up = 'up',
  Right = 'right',
}

/**
 * Sets up keyboard spatial navigation
 * Uses: https://github.com/WICG/spatial-navigation
 */
function useNavigation() {
  function getFirstVisible(candidates: HTMLElement[]): HTMLElement {
    return candidates.find(DOMHelper.isInViewport) || candidates[0];
  }

  function focus(element: HTMLElement) {
    if (!DOMHelper.isInViewport(element)) {
      element.scrollIntoView({ block: 'center' });
    }
    element.focus({ preventScroll: true });
  }

  function go(direction: Direction, event: KeyboardEvent) {
    event.preventDefault();
    try {
      const candidates = DOMHelper.getExplicitelyFocusableElements().filter(
        element => element != document.activeElement,
      );

      if (!candidates.length) {
        return;
      }

      if (
        event.target == null ||
        event.target === document.getElementById('gatsby-focus-wrapper')
      ) {
        focus(getFirstVisible(candidates));
        return;
      }

      let next = event.target.spatialNavigationSearch(direction, {
        candidates,
      });
      if (!next) {
        return;
      }

      if (!candidates.includes(next)) {
        next = getFirstVisible(candidates);
      }

      focus(next);
    } catch {}
  }

  useShortcut({
    h: event => go(Direction.Left, event),
    j: event => go(Direction.Down, event),
    k: event => go(Direction.Up, event),
    l: event => go(Direction.Right, event),
  });
}

export default useNavigation;
