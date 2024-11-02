/**
 * Make a string value safe to use as a URL
 * @param value The string value to use as a URL
 * @returns The URLified string value
 */
function encode(value: string): string {
  return encodeURIComponent(value.replaceAll(/[^\w]/g, ' '));
}

/**
 * Decode a URLified string value
 * @param value The URLified string value
 * @returns The decoded string value
 */
function decode(value: string): string {
  return decodeURIComponent(value);
}

const URLHelper = { encode, decode };
export default URLHelper;
