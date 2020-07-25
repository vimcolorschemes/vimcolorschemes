import { SECTIONS } from "../constants";

export const getCurrentSectionItems = (focusables, index) => {
  const { section } = focusables[index].dataset;
  let startIndex, endIndex;

  for (let i = index; i < focusables.length; i++) {
    if (focusables[i].dataset.section !== section) {
      endIndex = i - 1;
      break;
    }
  }

  for (let i = index; i >= 0; i--) {
    if (focusables[i].dataset.section !== section) {
      startIndex = i;
      break;
    }
  }

  return Array.prototype.slice.call(focusables, startIndex, endIndex);
};

export const getTabIndexesOfSection = (focusables, section) =>
  Array.prototype.reduce.call(
    focusables,
    (acc, focusable, index) =>
      focusable.dataset.section === section ? [...acc, index] : acc,
    [],
  );

export const getFirstTabIndexOfSection = (focusables, section) =>
  Array.prototype.findIndex.call(
    focusables,
    focusable => focusable.dataset.section === section,
  );

export const getLastTabIndexOfSection = (focusables, section) =>
  Array.prototype.reduce.call(
    focusables,
    (acc, focusable, index) => {
      if (focusable.dataset.section === section) acc = index;
      return acc;
    },
    -1,
  );

export const getDownIndex = (currentTabIndex, currentSection, focusables) => {
  switch (currentSection) {
    case SECTIONS.NAV:
      return getFirstTabIndexOfSection(focusables, SECTIONS.ACTIONS);
    case SECTIONS.ACTIONS:
      return getFirstTabIndexOfSection(focusables, SECTIONS.REPOSITORIES);
    case SECTIONS.REPOSITORIES:
      const straightDownTabIndex = currentTabIndex + 2;
      if (
        focusables[straightDownTabIndex]?.dataset.section ===
        SECTIONS.REPOSITORIES
      )
        return straightDownTabIndex;

      const repositoryTabIndexes = getTabIndexesOfSection(
        focusables,
        SECTIONS.REPOSITORIES,
      );

      if (
        currentTabIndex ===
          repositoryTabIndexes[repositoryTabIndexes.length - 2] &&
        repositoryTabIndexes.length % 2 !== 0
      )
        return repositoryTabIndexes[repositoryTabIndexes.length - 1];

      return getFirstTabIndexOfSection(focusables, SECTIONS.PAGINATION);
    case SECTIONS.PAGINATION:
      // can't go down
      return null;
    default:
      return null;
  }
};

export const getUpIndex = (currentTabIndex, currentSection, focusables) => {
  switch (currentSection) {
    case SECTIONS.NAV:
      return null;
    case SECTIONS.ACTIONS:
      return getFirstTabIndexOfSection(focusables, SECTIONS.NAV);
    case SECTIONS.REPOSITORIES:
      const onFirstRow = getTabIndexesOfSection(
        focusables,
        SECTIONS.REPOSITORIES,
      )
        .slice(0, 2)
        .includes(currentTabIndex);
      if (onFirstRow)
        return getFirstTabIndexOfSection(focusables, SECTIONS.ACTIONS);
      return currentTabIndex - 2;
    case SECTIONS.PAGINATION:
      const repositoryTabIndexes = getTabIndexesOfSection(
        focusables,
        SECTIONS.REPOSITORIES,
      );
      return repositoryTabIndexes[repositoryTabIndexes.length - 1];
    default:
      return null;
  }
};
