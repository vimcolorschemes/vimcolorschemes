import { createClient, type Client } from '@libsql/client';

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return client;
}

const DatabaseService = { getClient };
export default DatabaseService;
