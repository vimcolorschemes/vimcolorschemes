/**
 * Returns a list of all elements that were manually designed to be focusable
 * within the page
 *
 * @returns {array} The focusable HTML elements
 */
function getExplicitelyFocusableElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll('*[data-focusable=true]'));
}

/**
 * Returns true if the HTML element is an input
 *
 * @param {Object} element - The element to verify
 * @returns {boolean} True if the element is an input, false otherwise
 */
function isTextInput(element: EventTarget | null): boolean {
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

/**
 * Returns true if the element is visible in the current viewport
 *
 * source: https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/
 *
 * @param {Object} element - The HTML element to check
 * @returns {boolean} True if the element is visible
 */
function isInViewport(element: HTMLElement): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  const bounding = element.getBoundingClientRect();
  const clientHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const clientWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= clientHeight &&
    bounding.right <= clientWidth
  );
}

const DOMHelper = {
  getExplicitelyFocusableElements,
  isTextInput,
  isInViewport,
};

export default DOMHelper;
