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
  function go(direction: Direction, event: KeyboardEvent) {
    event.preventDefault();
    try {
      const candidates = DOMHelper.getExplicitelyFocusableElements();
      const target = event.target || document.documentElement;
      const next = target.spatialNavigationSearch(direction, { candidates });

      if (!next) {
        return;
      }

      if (!DOMHelper.isInViewport(next)) {
        next.scrollIntoView({ block: 'center' });
      }
      next.focus({ preventScroll: true });
    } catch (error) {
      console.error(error);
    }
  }

  useShortcut({
    h: event => go(Direction.Left, event),
    j: event => go(Direction.Down, event),
    k: event => go(Direction.Up, event),
    l: event => go(Direction.Right, event),
  });
}

export default useNavigation;
