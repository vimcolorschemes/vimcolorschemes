import DOMHelper from '@/helpers/dom';

import useEvent from '@/hooks/useEventListener';

type KeyboardShortcuts = { [key: string]: (event: KeyboardEvent) => void };

/**
 * Hook to configure keyboard shortcuts.
 *
 * @example
 * useKeyboardShortcut({ b: () => toggleBackground(), c: () => toggleColor() });
 *
 * @param shortcuts The object configuring various shortcuts
 */
function useKeyboardShortcut(shortcuts: KeyboardShortcuts) {
  useEvent<KeyboardEvent>('keydown', event => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      DOMHelper.isInput(event.target)
    ) {
      return;
    }

    shortcuts?.[event.key]?.(event);
  });
}

export default useKeyboardShortcut;
