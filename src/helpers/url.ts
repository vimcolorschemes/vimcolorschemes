/**
 * Make a string value safe to use as a URL
 * @param {string} value The string value to use as a URL
 * @returns {string} The URLified string value
 */
function urlify(value: string): string {
  if (!value) {
    return '';
  }

  return value.trim().replace(/\s/g, '%20').toLowerCase();
}

const URLHelper = { urlify };
export default URLHelper;
