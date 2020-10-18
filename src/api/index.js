/**
 * Sends a post request and returns the json response
 *
 * @param {string} url The full URL to send the request to
 * @param {object} body The data to post
 *
 * @returns {object} response The json response
 */
export const post = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
};
