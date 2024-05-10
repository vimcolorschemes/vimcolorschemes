/**
 * Returns true if the HTML element is an input.
 * @param element The HTML element to verify
 * @returns True if the element is an input, false otherwise
 */
function isInput(element: EventTarget | null): boolean {
  if (element == null || !(element instanceof HTMLElement)) {
    return false;
  }

  const { tagName, type } = element as HTMLInputElement;

  return (
    (tagName === 'INPUT' &&
      ['submit', 'reset', 'checkbox', 'radio'].indexOf(type) < 0) ||
    tagName === 'TEXTAREA'
  );
}

const DOMHelper = { isInput };
export default DOMHelper;
