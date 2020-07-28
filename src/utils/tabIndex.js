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

const prioritize = (elements, focusables) =>
  elements.sort((a, b) => {
    const priorityA = parseInt(focusables[a].dataset.priority) || Infinity;
    const priorityB = parseInt(focusables[b].dataset.priority) || Infinity;
    return priorityA - priorityB;
  });

const getSectionIndexes = (focusables, section) =>
  Array.prototype.reduce.call(
    focusables,
    (indexes, focusable, index) =>
      focusable.dataset.section === section ? [...indexes, index] : indexes,
    [],
  );

export const getFirstTabIndexOfSection = (focusables, section) => {
  const firstIndex = prioritize(
    getSectionIndexes(focusables, section),
    focusables,
  )[0];
  return firstIndex == null ? -1 : firstIndex;
};

export const getLastTabIndexOfSection = (focusables, section) => {
  const sectionIndexes = getSectionIndexes(focusables, section);
  const lastIndex = prioritize(sectionIndexes, focusables)[
    sectionIndexes.length - 1
  ];
  return lastIndex == null ? -1 : lastIndex;
};
