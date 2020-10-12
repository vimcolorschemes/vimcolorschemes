import { useEventListener } from "src/hooks/useEventListener";

const isInput = element => {
  if (!(element instanceof HTMLElement)) return false;

  const { tagName, type } = element;
  return (
    (tagName === "INPUT" &&
      ["submit", "reset", "checkbox", "radio"].indexOf(type) < 0) ||
    tagName === "TEXTAREA"
  );
};

export const useKeyboardShortcuts = shortcuts => {
  useEventListener("keydown", event => {
    const { key, target } = event;

    if (!shortcuts || !Object.keys(shortcuts).includes(key) || isInput(target))
      return;

    shortcuts[key]();
  });
};
