import DOMHelper from '@/helpers/dom';
import useEvent from '@/hooks/event';

interface Shortcuts {
  [key: string]: (event: KeyboardEvent) => void;
}

/**
 * Hook to configure keyboard shortcuts
 *
 * @example
 * const shortcuts = {
 *   b: () => toggleBackground(),
 * }
 * useShortcut(shortcuts);
 *
 * @param {Object} shortcuts - The object configuring various shortcuts
 */
function useShortcut(shortcuts: Shortcuts) {
  useEvent<KeyboardEvent>('keydown', event => {
    const { key, target, ctrlKey, metaKey, altKey } = event;

    if (
      ctrlKey ||
      metaKey ||
      altKey ||
      !shortcuts ||
      !Object.keys(shortcuts).includes(key) ||
      DOMHelper.isTextInput(target)
    ) {
      return;
    }

    shortcuts[key](event);
  });
}

export default useShortcut;
