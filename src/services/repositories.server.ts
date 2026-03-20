import type { Row } from '@libsql/client';

import type { BackgroundFilter } from '#/lib/filter';
import type { ColorschemeDTO } from '#/models/DTO/colorscheme';
import type { RepositoryDTO } from '#/models/DTO/repository';
import DatabaseService from '#/services/database.server';

export const REPOSITORY_PAGE_SIZE = 20;

const REPO_COLS =
  'r.id, r.owner_name, r.name, r.description, r.github_url, r.stargazers_count, r.week_stargazers_count, r.github_created_at, r.pushed_at';

const BASE_CLAUSE =
  'EXISTS (SELECT 1 FROM colorschemes cs WHERE cs.repository_id = r.id)';
const LIGHT_EXISTS =
  "EXISTS (SELECT 1 FROM colorschemes cs JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id WHERE cs.repository_id = r.id AND csg.background = 'light')";
const DARK_EXISTS =
  "EXISTS (SELECT 1 FROM colorschemes cs JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id WHERE cs.repository_id = r.id AND csg.background = 'dark')";

const REPO_ORDER = 'r.week_stargazers_count DESC, r.id';

function getBackgroundClauses(background?: BackgroundFilter): string[] {
  if (background === 'light') {
    return [LIGHT_EXISTS];
  }

  if (background === 'dark') {
    return [DARK_EXISTS];
  }

  if (background === 'both') {
    return [LIGHT_EXISTS, DARK_EXISTS];
  }

  return [BASE_CLAUSE];
}

async function loadColorschemes(
  repositoryId: number,
): Promise<ColorschemeDTO[]> {
  const colorschemesByRepository = await loadColorschemesByRepositoryIds([
    repositoryId,
  ]);

  return colorschemesByRepository.get(repositoryId) ?? [];
}

async function loadColorschemesByRepositoryIds(
  repositoryIds: number[],
): Promise<Map<number, ColorschemeDTO[]>> {
  if (!repositoryIds.length) {
    return new Map();
  }

  const client = DatabaseService.getClient();
  const placeholders = repositoryIds.map(() => '?').join(', ');
  const result = await client.execute({
    sql: `SELECT cs.repository_id as repository_id, cs.id as cs_id, cs.name as cs_name, csg.background as csg_background, csg.name as csg_name, csg.hex_code as csg_hex_code
           FROM colorschemes cs
           LEFT JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id
           WHERE cs.repository_id IN (${placeholders})
           ORDER BY cs.repository_id, cs.id, csg.id`,
    args: repositoryIds,
  });

  const repositoryMap = new Map<number, Map<number, ColorschemeDTO>>();

  for (const row of result.rows) {
    const repositoryId = row.repository_id as number;
    const id = row.cs_id as number;
    const name = row.cs_name as string;
    let colorschemeMap = repositoryMap.get(repositoryId);

    if (!colorschemeMap) {
      colorschemeMap = new Map<number, ColorschemeDTO>();
      repositoryMap.set(repositoryId, colorschemeMap);
    }

    if (!colorschemeMap.has(id)) {
      colorschemeMap.set(id, {
        name,
        backgrounds: [],
        data: { light: null, dark: null },
      });
    }

    const colorscheme = colorschemeMap.get(id)!;
    const background = row.csg_background as 'light' | 'dark' | null;
    const groupName = row.csg_name as string | null;
    const hexCode = row.csg_hex_code as string | null;

    if (!background || !groupName || !hexCode) {
      continue;
    }

    const group = { name: groupName, hexCode };

    if (!colorscheme.data) {
      colorscheme.data = { light: null, dark: null };
    }

    if (background === 'light') {
      if (!colorscheme.data.light) {
        colorscheme.data.light = [];
      }
      colorscheme.data.light.push(group);
      if (!colorscheme.backgrounds.includes('light')) {
        colorscheme.backgrounds.push('light');
      }
    }

    if (background === 'dark') {
      if (!colorscheme.data.dark) {
        colorscheme.data.dark = [];
      }
      colorscheme.data.dark.push(group);
      if (!colorscheme.backgrounds.includes('dark')) {
        colorscheme.backgrounds.push('dark');
      }
    }
  }

  const colorschemesByRepository = new Map<number, ColorschemeDTO[]>();

  for (const [repositoryId, colorschemes] of repositoryMap.entries()) {
    colorschemesByRepository.set(
      repositoryId,
      Array.from(colorschemes.values()),
    );
  }

  return colorschemesByRepository;
}

function rowToDTO(row: Row, vimColorSchemes: ColorschemeDTO[]): RepositoryDTO {
  return {
    name: row.name as string,
    owner: { name: row.owner_name as string },
    description: (row.description as string) || '',
    githubCreatedAt: new Date(row.github_created_at as string),
    pushedAt: new Date(row.pushed_at as string),
    githubURL: (row.github_url as string) || '',
    stargazersCount: (row.stargazers_count as number) || 0,
    weekStargazersCount: (row.week_stargazers_count as number) || 0,
    vimColorSchemes,
  };
}

export async function getRepository(
  owner: string,
  name: string,
): Promise<RepositoryDTO | null> {
  const client = DatabaseService.getClient();

  const result = await client.execute({
    sql: `SELECT ${REPO_COLS} FROM repositories r
          WHERE r.owner_name = ? COLLATE NOCASE AND r.name = ? COLLATE NOCASE
            AND EXISTS (SELECT 1 FROM colorschemes cs WHERE cs.repository_id = r.id)
          LIMIT 1`,
    args: [owner, name],
  });

  if (!result.rows.length) {
    return null;
  }

  const row = result.rows[0];
  const vimColorSchemes = await loadColorschemes(row.id as number);
  return rowToDTO(row, vimColorSchemes);
}

export async function getRepositoryCount({
  background,
}: {
  background?: BackgroundFilter;
} = {}): Promise<number> {
  const client = DatabaseService.getClient();
  const where = getBackgroundClauses(background).join(' AND ');

  const result = await client.execute(
    `SELECT COUNT(*) as count FROM repositories r WHERE ${where}`,
  );

  return Number(result.rows[0].count);
}

export async function getRepositories({
  page,
  background,
}: {
  page: number;
  background?: BackgroundFilter;
}): Promise<RepositoryDTO[]> {
  const client = DatabaseService.getClient();
  const offset = (page - 1) * REPOSITORY_PAGE_SIZE;
  const where = getBackgroundClauses(background).join(' AND ');

  const result = await client.execute({
    sql: `SELECT ${REPO_COLS} FROM repositories r WHERE ${where} ORDER BY ${REPO_ORDER} LIMIT ? OFFSET ?`,
    args: [REPOSITORY_PAGE_SIZE, offset],
  });

  const repositoryIds = result.rows.map(row => row.id as number);
  const colorschemesByRepository =
    await loadColorschemesByRepositoryIds(repositoryIds);

  return Promise.all(
    result.rows.map(async row => {
      const vimColorSchemes =
        colorschemesByRepository.get(row.id as number) ?? [];
      return rowToDTO(row, vimColorSchemes);
    }),
  );
}
