import { useEventListener } from "src/hooks/useEventListener";

/**
 * Hook to configure keyboard shortcuts
 *
 * @example
 * const shortcuts = {
 *   b: () => toggleTheme(),
 * }
 * useKeyboardShortcuts(shortcuts);
 *
 * @param {object} shortcuts The object configuring various shortcuts
 */
export const useKeyboardShortcuts = shortcuts => {
  useEventListener("keydown", event => {
    const { key, target } = event;

    if (!shortcuts || !Object.keys(shortcuts).includes(key) || isInput(target))
      return;

    shortcuts[key](event);
  });
};

const isInput = element => {
  if (!(element instanceof HTMLElement)) return false;

  const { tagName, type } = element;
  return (
    (tagName === "INPUT" &&
      ["submit", "reset", "checkbox", "radio"].indexOf(type) < 0) ||
    tagName === "TEXTAREA"
  );
};
