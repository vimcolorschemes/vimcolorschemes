import nodeFetch from 'node-fetch';

import URLHelper from './url';

interface GetProps {
  url: string;
  queryParams?: Record<string, any>;
  headers?: Record<string, any>;
}

/**
 * Sends a GET request and returns the JSON response
 *
 * @param {Object} props - The full URL to send the request to, params, and headers
 * @returns {Object} The JSON response
 */
async function get<T>({
  url,
  queryParams,
  headers,
}: GetProps): Promise<T | null> {
  const formattedUrl = URLHelper.applyQueryParams(url, queryParams);

  const response = await fetch(formattedUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  });

  try {
    return await response.json();
  } catch {
    return null;
  }
}

interface PostProps {
  url: string;
  body?: Record<string, any>;
  headers?: Record<string, any>;
}

/**
 * Sends a POST request and returns the JSON response
 *
 * @param {Object} props - The full URL to send the request to, params, and headers
 * @returns {Object} The JSON response
 */
async function post<T>({ url, body, headers }: PostProps): Promise<T | null> {
  const response = await nodeFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  });

  try {
    return await response.json();
  } catch {
    return null;
  }
}

const RequestHelper = { get, post };

export default RequestHelper;
