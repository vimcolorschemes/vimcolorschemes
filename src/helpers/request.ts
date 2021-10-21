/**
 * Sends a post request and returns the JSON response
 *
 * @param {string} url - The full URL to send the request to
 * @param {Object} [body] - The data to post
 *
 * @returns {Object} The JSON response
 */
async function post<T>(url: string, body?: Record<string, any>): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

const RequestHelper = {
  post,
};

export default RequestHelper;
