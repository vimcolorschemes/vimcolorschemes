/**
 * Make a string value safe to use as a URL
 * @param {string} value The string value to use as a URL
 * @returns {string} The URLified string value
 */
function encode(value: string): string {
  if (!value) {
    return '';
  }

  return value.trim().replace(/\s/g, '%20').toLowerCase();
}

const URLHelper = { encode };
export default URLHelper;
