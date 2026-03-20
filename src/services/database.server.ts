import { createClient } from '@libsql/client';
import type { Client } from '@libsql/client';

let client: Client | null = null;

function getClient(): Client {
  if (client) {
    return client;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Missing DATABASE_URL environment variable');
  }

  client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return client;
}

const DatabaseService = { getClient };

export default DatabaseService;
