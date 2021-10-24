/**
 * Gets an item from local storage
 *
 * @param {string} key - The key at which the item may be stored
 * @param {string} [defaultValue] - The value to return if the item does not
 * exist in local storage
 * @returns {string} The stored item
 */
function get(key: string, defaultValue?: string): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem(key) || defaultValue || '';
}

/**
 * Adds or updates an item to local storage
 * @param {string} key - The key at which to store the item
 * @param {string} value - The value to store
 */
function set(key: string, value: string) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(key, value);
}

/**
 * Removes an item from local storage
 * @param {string} key - The key to remove from local storage
 */
function remove(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(key);
}

const LocalStorageHelper = {
  get,
  set,
  remove,
};

export default LocalStorageHelper;
