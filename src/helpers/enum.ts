/**
 * Returns all keys of an enum
 *
 * @param {Object} enum - The enum
 * @returns {string[]} The enum keys
 */
function getKeys(enumeration: Object): string[] {
  return Object.keys(enumeration).filter(key => isNaN(parseInt(key)));
}

const EnumHelper = {
  getKeys,
};

export default EnumHelper;
