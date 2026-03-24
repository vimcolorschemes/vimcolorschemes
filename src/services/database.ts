import { createClient, type Client } from '@libsql/client';

import path from 'node:path';

let client: Client | null = null;

function getDatabaseURL(): string {
  const url = process.env.DATABASE_URL!;

  if (!url.startsWith('file:')) {
    return url;
  }

  const filePath = url.slice('file:'.length);
  if (path.isAbsolute(filePath)) {
    return url;
  }

  return `file:${path.join(process.cwd(), filePath)}`;
}

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: getDatabaseURL(),
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return client;
}

const DatabaseService = { getClient };
export default DatabaseService;
