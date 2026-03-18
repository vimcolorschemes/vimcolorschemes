import DatabaseService from '@/services/database';

import Owner from '@/models/owner';

async function getOwner(name: string): Promise<Owner | null> {
  const client = DatabaseService.getClient();

  const result = await client.execute({
    sql: `SELECT r.owner_name FROM repositories r
          WHERE r.owner_name = ? COLLATE NOCASE
            AND EXISTS (SELECT 1 FROM colorschemes cs WHERE cs.repository_id = r.id)
          LIMIT 1`,
    args: [name],
  });

  if (!result.rows.length) {
    return null;
  }

  return { name: result.rows[0].owner_name as string };
}

const OwnersService = { getOwner };

export default OwnersService;
