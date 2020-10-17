import { useEffect, useCallback, useRef } from "react";

import { LAYOUTS, KEYS, SECTIONS, NON_NAVIGATION_KEYS } from "src/constants";
import {
  isInViewport,
  isAtPageTop,
  isBrowserActive,
} from "src/utils/navigation";

/**
 * Hook that listens for navigation keys and navigates by focusing to configured elements
 *
 * All focusable elements must have the data-section attribute.
 *
 * @example
 * const [resetNavigation] = useNavigation();
 *
 * @param {string} defaultSection Section to focus on when nothing was focused before
 *
 * @returns {array} Utility functions to control navigation
 */
export const useNavigation = defaultSection => {
  const isBrowser = isBrowserActive();

  const eventListener = useRef({ callback: null });

  const resetNavigation = useCallback(() => {
    if (!isBrowser) return;

    window.removeEventListener("keydown", eventListener.current.callback);

    const focusables = document.querySelectorAll("*[data-section]");

    const callback = event =>
      Object.values(KEYS).includes(event.key) &&
      handleKeyPress(event, focusables, defaultSection);

    window.addEventListener("keydown", callback);

    eventListener.current.callback = callback;
  }, [isBrowser, defaultSection]);

  const disableNavigation = useCallback(() => {
    if (!isBrowser) return;

    window.removeEventListener("keydown", eventListener.current.callback);
    eventListener.current.callback = null;
  }, [isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;

    resetNavigation();
    return () => disableNavigation();
  }, [isBrowser, resetNavigation, disableNavigation]);

  return [resetNavigation];
};

const handleKeyPress = (event, focusables, defaultSection) => {
  const { key, metaKey } = event;

  const { activeElement } = document;

  const isTextInput =
    activeElement.tagName === "INPUT" && activeElement.type === "text";

  if (NON_NAVIGATION_KEYS.includes(key) || isTextInput) return;

  if (
    [
      KEYS.ARROW_UP,
      KEYS.ARROW_RIGHT,
      KEYS.ARROW_DOWN,
      KEYS.ARROW_LEFT,
    ].includes(key) &&
    !metaKey
  ) {
    event.preventDefault();
  }

  const currentTabIndex = Array.prototype.indexOf.call(
    focusables,
    activeElement,
  );

  const { section, layout } = activeElement.dataset;

  let nextTabIndex;

  if (metaKey) {
    if ([KEYS.UP, KEYS.ARROW_UP].includes(key)) {
      nextTabIndex = 0;
    } else if ([KEYS.DOWN, KEYS.ARROW_DOWN].includes(key)) {
      nextTabIndex = focusables.length - 1;
    }
  } else if (key === KEYS.TOP) {
    nextTabIndex = getFirstTabIndexOfSection(focusables, SECTIONS.REPOSITORIES);
  } else if (key === KEYS.BOTTOM) {
    nextTabIndex = getLastTabIndexOfSection(focusables, SECTIONS.REPOSITORIES);
  } else {
    if (currentTabIndex === -1) {
      nextTabIndex = getFirstVisibleTabIndexOfSection(
        focusables,
        defaultSection,
      );
    } else {
      switch (layout) {
        case LAYOUTS.BLOCK:
          nextTabIndex = Block.move(focusables, currentTabIndex, section, key);
          break;
        case LAYOUTS.LIST:
          nextTabIndex = List.move(focusables, currentTabIndex, section, key);
          break;
        case LAYOUTS.GRID:
          nextTabIndex = Grid.move(focusables, currentTabIndex, section, key);
          break;
        default:
          break;
      }
    }
  }

  if (nextTabIndex === -1) nextTabIndex = 0;

  if (nextTabIndex == null) return;

  focus(focusables, nextTabIndex);
};

// 1 per row
const Block = {
  move: (focusables, currentTabIndex, currentSection, key) => {
    switch (key) {
      case KEYS.RIGHT:
      case KEYS.ARROW_RIGHT:
        return Grid.right(currentTabIndex);
      case KEYS.LEFT:
      case KEYS.ARROW_LEFT:
        return Grid.left(currentTabIndex);
      case KEYS.DOWN:
      case KEYS.ARROW_DOWN:
        return Grid.down(focusables, currentTabIndex, currentSection);
      case KEYS.UP:
      case KEYS.ARROW_UP:
        return Grid.up(focusables, currentTabIndex, currentSection);
      default:
        return null;
    }
  },
  // to previous section
  up: (focusables, index, currentSection) =>
    getNextTabIndexOfPreviousSection(focusables, index, currentSection),
  // go right
  right: index => index + 1,
  // to next section
  down: (focusables, index, currentSection) =>
    getFirstTabIndexOfNextSection(focusables, index, currentSection),
  // go left
  left: index => index - 1,
};

// n per row
const List = {
  move: (focusables, currentTabIndex, currentSection, key) => {
    switch (key) {
      case KEYS.RIGHT:
      case KEYS.ARROW_RIGHT:
        return List.right(currentTabIndex);
      case KEYS.LEFT:
      case KEYS.ARROW_LEFT:
        return List.left(currentTabIndex);
      case KEYS.DOWN:
      case KEYS.ARROW_DOWN:
        return List.down(focusables, currentTabIndex, currentSection);
      case KEYS.UP:
      case KEYS.ARROW_UP:
        return List.up(focusables, currentTabIndex, currentSection);
      default:
        return null;
    }
  },
  // to previous section
  up: (focusables, index, currentSection) =>
    getNextTabIndexOfPreviousSection(focusables, index, currentSection),
  // go right
  right: index => index + 1,
  // to next section
  down: (focusables, index, currentSection) =>
    getFirstTabIndexOfNextSection(focusables, index, currentSection),
  // go left
  left: index => index - 1,
};

const Grid = {
  move: (focusables, currentTabIndex, currentSection, key) => {
    switch (key) {
      case KEYS.RIGHT:
      case KEYS.ARROW_RIGHT:
        return Grid.right(currentTabIndex);
      case KEYS.LEFT:
      case KEYS.ARROW_LEFT:
        return Grid.left(currentTabIndex);
      case KEYS.UP:
      case KEYS.ARROW_UP:
        return Grid.up(focusables, currentTabIndex, currentSection);
      case KEYS.DOWN:
      case KEYS.ARROW_DOWN:
        return Grid.down(focusables, currentTabIndex, currentSection);
      default:
        return null;
    }
  },
  // to previous section
  up: (focusables, index, currentSection) => {
    if (isOnFirstGridRow(focusables, index, currentSection))
      return getNextTabIndexOfPreviousSection(
        focusables,
        index,
        currentSection,
      );
    else return index - 2;
  },
  // go right
  right: index => index + 1,
  // to next section
  down: (focusables, index, currentSection) => {
    if (isGridOddAndOnNextToLast(focusables, index, currentSection))
      return index + 1;
    else {
      if (isOnLastGridRow(focusables, index, currentSection))
        return getFirstTabIndexOfNextSection(focusables, index, currentSection);
      else return index + 2;
    }
  },
  // go left
  left: index => index - 1,
};

// When grid is odd, if the index is next to the last, it means that it is not on the last row.
// On down key press, the next focus should be on the last index.
const isGridOddAndOnNextToLast = (focusables, index, currentSection) =>
  getCurrentSectionItems(focusables, index).length % 2 !== 0 &&
  focusables[index + 1]?.dataset.section === currentSection &&
  focusables[index + 2]?.dataset.section !== currentSection;

// return true if the given index is on the first row
const isOnFirstGridRow = (focusables, index, currentSection) =>
  !focusables[index - 1] ||
  !focusables[index - 2] ||
  focusables[index - 1].dataset.section !== currentSection ||
  focusables[index - 2].dataset.section !== currentSection;

// assuming the grid count is even, return true if the given index is on the last row
const isOnLastGridRow = (focusables, index, currentSection) =>
  !focusables[index + 1] ||
  !focusables[index + 2] ||
  focusables[index + 1].dataset.section !== currentSection ||
  focusables[index + 2].dataset.section !== currentSection;

// get the first focusable element index of the next section starting from an index
const getFirstTabIndexOfNextSection = (focusables, index, currentSection) => {
  for (let i = index + 1; i < focusables.length; i++) {
    if (focusables[i].dataset.section !== currentSection) {
      return getFirstTabIndexOfSection(
        focusables,
        focusables[i].dataset.section,
      );
    }
  }
  return null;
};

// get either the first tab index of the previous section, or the last one if it's a grid
const getNextTabIndexOfPreviousSection = (
  focusables,
  index,
  currentSection,
) => {
  for (let i = index - 1; i >= 0; i--) {
    const { section, layout } = focusables[i].dataset;
    if (section !== currentSection) {
      return layout === LAYOUTS.GRID
        ? i
        : getFirstTabIndexOfSection(focusables, focusables[i].dataset.section);
    }
  }
  return null;
};

// focus on a tab index if the element exists
const focus = (focusables, index) => {
  const nextElement = focusables[index];
  if (nextElement) {
    if (!isInViewport(nextElement)) {
      nextElement.scrollIntoView({ block: "center" });
    }
    nextElement.focus({ preventScroll: true });
  }
};

// get all focusable elements of the current tab index's section
const getCurrentSectionItems = (focusables, index) => {
  const { section } = focusables[index].dataset;
  let startIndex, endIndex;

  // going up from current
  for (let i = index; i < focusables.length; i++) {
    if (focusables[i].dataset.section !== section) {
      endIndex = i - 1;
      break;
    }
  }

  // going down from current
  for (let i = index; i >= 0; i--) {
    if (focusables[i].dataset.section !== section) {
      startIndex = i;
      break;
    }
  }

  return Array.prototype.slice.call(focusables, startIndex, endIndex);
};

// sort by priority if it exists
const prioritize = (elements, focusables) =>
  elements.sort((a, b) => {
    const priorityA = parseInt(focusables[a].dataset.priority) || Infinity;
    const priorityB = parseInt(focusables[b].dataset.priority) || Infinity;
    return priorityA - priorityB;
  });

// get all possible tab indexes of a given section
const getSectionTabIndexes = (focusables, section) =>
  Array.prototype.reduce.call(
    focusables,
    (indexes, focusable, index) =>
      focusable.dataset.section === section ? [...indexes, index] : indexes,
    [],
  );

// get the first visible tab index of a specified section, and defaults to
// simply first visible tab index of any sections
const getFirstVisibleTabIndexOfSection = (focusables, section) => {
  const getFirstVisibleTabIndex = () =>
    Array.prototype.findIndex.call(focusables, focusable =>
      isInViewport(focusable),
    );

  if (!section) return getFirstVisibleTabIndex();

  const elements = prioritize(
    getSectionTabIndexes(focusables, section),
    focusables,
  );

  if (isAtPageTop()) return elements[0];

  const firstVisibleIndex = elements.find(index =>
    isInViewport(focusables[index]),
  );

  return firstVisibleIndex == null
    ? getFirstVisibleTabIndex()
    : firstVisibleIndex;
};

// get the first tab index of a given section
// if an element within the section has priority, it will be returned first
const getFirstTabIndexOfSection = (focusables, section) => {
  const firstIndex = prioritize(
    getSectionTabIndexes(focusables, section),
    focusables,
  )[0];
  return firstIndex == null ? -1 : firstIndex;
};

// get the last possible tab index of a given section
const getLastTabIndexOfSection = (focusables, section) => {
  const sectionIndexes = getSectionTabIndexes(focusables, section);
  const lastIndex = sectionIndexes[sectionIndexes.length - 1];
  return lastIndex == null ? -1 : lastIndex;
};
