import { unstable_cache } from 'next/cache';

import { DatabaseService } from '@/services/database';

import { Owner } from '@/models/owner';

async function getOwner(name: string): Promise<Owner | null> {
  const client = DatabaseService.getClient();

  const result = await client.execute({
    sql: `SELECT r.owner_name FROM repositories r
          WHERE r.owner_name = ? COLLATE NOCASE
            AND (r.has_dark = 1 OR r.has_light = 1)
          LIMIT 1`,
    args: [name],
  });

  if (!result.rows.length) {
    return null;
  }

  return { name: result.rows[0].owner_name as string };
}

const cachedGetOwner = unstable_cache(getOwner, ['owner'], {
  tags: ['repositories'],
  revalidate: 86400,
});

export const OwnersService = { getOwner: cachedGetOwner };
