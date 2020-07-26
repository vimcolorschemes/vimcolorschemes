import { useEffect } from "react";

import { LAYOUTS, KEYS, SECTIONS } from "../constants";

import {
  getFirstTabIndexOfSection,
  getCurrentSectionItems,
  getLastTabIndexOfSection,
} from "../utils/tabIndex";

export const useNavigation = defaultSection => {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const focusables = document.querySelectorAll("*[data-section]");

      const eventListener = event =>
        Object.values(KEYS).includes(event.key) &&
        handleKeyPress(event.key, focusables, defaultSection);

      window.addEventListener("keydown", eventListener);
      return () => window.removeEventListener("keydown", eventListener);
    }
  }, [defaultSection]);
};

const handleKeyPress = (key, focusables, defaultSection) => {
  const { activeElement } = document;

  const currentTabIndex = Array.prototype.indexOf.call(
    focusables,
    activeElement,
  );

  const { section, layout } = activeElement.dataset;

  let nextTabIndex;

  if (key === KEYS.SPACE) {
    return;
  } else if (key === KEYS.TOP) {
    nextTabIndex = getFirstTabIndexOfSection(focusables, SECTIONS.REPOSITORIES);
  } else if (key === KEYS.BOTTOM) {
    nextTabIndex = getLastTabIndexOfSection(focusables, SECTIONS.REPOSITORIES);
  } else {
    if (currentTabIndex === -1) {
      let firstIndex = defaultSection
        ? getFirstTabIndexOfSection(focusables, defaultSection)
        : 0;
      if (firstIndex === -1) firstIndex = 0;
      nextTabIndex = firstIndex;
    }
    switch (layout) {
      case LAYOUTS.BLOCK:
        if ([KEYS.DOWN, KEYS.RIGHT].includes(key))
          nextTabIndex = currentTabIndex + 1;
        else nextTabIndex = currentTabIndex - 1;
        break;
      case LAYOUTS.LIST:
        switch (key) {
          case KEYS.RIGHT:
            nextTabIndex = currentTabIndex + 1;
            break;
          case KEYS.LEFT:
            nextTabIndex = currentTabIndex - 1;
            break;
          case KEYS.DOWN:
            for (let i = currentTabIndex + 1; i < focusables.length; i++) {
              if (focusables[i].dataset.section !== section) {
                nextTabIndex = i;
                break;
              }
            }
            break;
          case KEYS.UP:
            for (let i = currentTabIndex - 1; i >= 0; i--) {
              if (focusables[i].dataset.section !== section) {
                const nextLayout = focusables[i].dataset.layout;
                if (nextLayout === LAYOUTS.GRID) nextTabIndex = i;
                else
                  nextTabIndex = getFirstTabIndexOfSection(
                    focusables,
                    focusables[i].dataset.section,
                  );
                break;
              }
            }
            break;
          default:
            break;
        }
        break;
      case LAYOUTS.GRID:
        switch (key) {
          case KEYS.RIGHT:
            nextTabIndex = currentTabIndex + 1;
            break;
          case KEYS.LEFT:
            nextTabIndex = currentTabIndex - 1;
            break;
          case KEYS.UP:
            const isFirstRow =
              !focusables[currentTabIndex - 1] ||
              !focusables[currentTabIndex - 2] ||
              focusables[currentTabIndex - 1].dataset.section !== section ||
              focusables[currentTabIndex - 2].dataset.section !== section;
            if (isFirstRow) {
              for (let i = currentTabIndex - 1; i >= 0; i--) {
                if (focusables[i].dataset.section !== section) {
                  nextTabIndex = getFirstTabIndexOfSection(
                    focusables,
                    focusables[i].dataset.section,
                  );
                  break;
                }
              }
            } else nextTabIndex = currentTabIndex - 2;
            break;
          case KEYS.DOWN:
            const isGridCountOdd =
              getCurrentSectionItems(focusables, currentTabIndex).length % 2 !==
              0;
            if (
              isGridCountOdd &&
              focusables[currentTabIndex + 1]?.dataset.section === section &&
              focusables[currentTabIndex + 2]?.dataset.section !== section
            )
              nextTabIndex = currentTabIndex + 1;
            else {
              const isLastRow =
                !focusables[currentTabIndex + 1] ||
                !focusables[currentTabIndex + 2] ||
                focusables[currentTabIndex + 1].dataset.section !== section ||
                focusables[currentTabIndex + 2].dataset.section !== section;
              if (isLastRow) {
                for (let i = currentTabIndex + 1; i < focusables.length; i++) {
                  if (focusables[i].dataset.section !== section) {
                    nextTabIndex = getFirstTabIndexOfSection(
                      focusables,
                      focusables[i].dataset.section,
                    );
                    break;
                  }
                }
              } else nextTabIndex = currentTabIndex + 2;
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
  if (nextTabIndex == null) return;

  focus(focusables, nextTabIndex);
};

const focus = (focusables, index) => {
  const nextElement = focusables[index];
  nextElement && nextElement.focus();
};
