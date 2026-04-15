import type { Row } from '@libsql/client';
import { unstable_cache } from 'next/cache';

import { DatabaseService } from '@/services/database';

import { ColorschemeDTO } from '@/models/DTO/colorscheme';
import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import { Constants } from '@/lib/constants';
import type { Filter } from '@/lib/filter';
import type { Sort } from '@/lib/sort';

import { QueryHelper } from '@/helpers/query';

type GetRepositoriesParams = {
  sort: Sort;
  filter: Filter;
};

type RepositoryPageDTOs = {
  repositories: RepositoryDTO[];
  hasMore: boolean;
};

type RepositoryKey = {
  ownerName: string;
  name: string;
};

const FEATURED_REPOSITORY_LIMIT = 3;

function hydrateRepository(dto: RepositoryDTO): Repository {
  return new Repository(dto);
}

type ColorschemeMap = Map<number, ColorschemeDTO>;

const REPO_COLS = `r.id, r.owner_name, r.name, r.description, r.github_url, r.stargazers_count, r.week_stargazers_count, r.github_created_at, r.pushed_at`;
const BASE_CLAUSE = `(r.has_dark = 1 OR r.has_light = 1)`;

function buildWhereSQL(filter: Filter, clauses: string[]): string {
  const base = filter.background ? [] : [BASE_CLAUSE];
  return `WHERE ${[...base, ...clauses].join(' AND ')}`;
}

async function loadColorschemes(
  repositoryId: number,
): Promise<ColorschemeDTO[]> {
  const client = DatabaseService.getClient();
  const result = await client.execute({
    sql: `SELECT cs.id as cs_id, cs.name as cs_name, csg.background as csg_background, csg.name as csg_name, csg.hex_code as csg_hex_code
          FROM colorschemes cs
          LEFT JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id
          WHERE cs.repository_id = ?
          ORDER BY cs.id, csg.id`,
    args: [repositoryId],
  });

  return buildColorschemeDTOs(result.rows);
}

async function loadColorschemesForRepositories(
  repositoryIds: number[],
): Promise<Map<number, ColorschemeDTO[]>> {
  if (!repositoryIds.length) {
    return new Map();
  }

  const client = DatabaseService.getClient();
  const placeholders = repositoryIds.map(() => '?').join(', ');
  const result = await client.execute({
    sql: `SELECT cs.repository_id as repo_id, cs.id as cs_id, cs.name as cs_name, csg.background as csg_background, csg.name as csg_name, csg.hex_code as csg_hex_code
          FROM colorschemes cs
          LEFT JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id
          WHERE cs.repository_id IN (${placeholders})
          ORDER BY cs.repository_id, cs.id, csg.id`,
    args: repositoryIds,
  });

  return buildColorschemesByRepo(result.rows);
}

async function loadAllColorschemes(): Promise<Map<number, ColorschemeDTO[]>> {
  const client = DatabaseService.getClient();
  const result = await client.execute(
    `SELECT cs.repository_id as repo_id, cs.id as cs_id, cs.name as cs_name, csg.background as csg_background, csg.name as csg_name, csg.hex_code as csg_hex_code
     FROM colorschemes cs
     LEFT JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id
     ORDER BY cs.repository_id, cs.id, csg.id`,
  );

  return buildColorschemesByRepo(result.rows);
}

function appendColorschemeRow(colorschemeMap: ColorschemeMap, row: Row): void {
  const id = row.cs_id as number;
  const name = row.cs_name as string;

  if (!colorschemeMap.has(id)) {
    colorschemeMap.set(id, {
      name,
      backgrounds: [],
      data: { light: null, dark: null },
    });
  }

  const cs = colorschemeMap.get(id)!;
  const background = row.csg_background as string | null;
  const groupName = row.csg_name as string | null;
  const hexCode = row.csg_hex_code as string | null;

  if (background && groupName && hexCode) {
    const group = { name: groupName, hexCode };
    if (background === 'light') {
      if (!cs.data!.light) cs.data!.light = [];
      cs.data!.light.push(group);
      if (!cs.backgrounds.includes('light')) cs.backgrounds.push('light');
    } else if (background === 'dark') {
      if (!cs.data!.dark) cs.data!.dark = [];
      cs.data!.dark.push(group);
      if (!cs.backgrounds.includes('dark')) cs.backgrounds.push('dark');
    }
  }
}

function buildColorschemeDTOs(rows: Row[]): ColorschemeDTO[] {
  const colorschemeMap: ColorschemeMap = new Map();
  for (const row of rows) {
    appendColorschemeRow(colorschemeMap, row);
  }

  return Array.from(colorschemeMap.values());
}

function buildColorschemesByRepo(rows: Row[]): Map<number, ColorschemeDTO[]> {
  const repoMap = new Map<number, ColorschemeMap>();

  for (const row of rows) {
    const repoId = row.repo_id as number;
    if (!repoMap.has(repoId)) {
      repoMap.set(repoId, new Map());
    }

    appendColorschemeRow(repoMap.get(repoId)!, row);
  }

  const colorschemesByRepo = new Map<number, ColorschemeDTO[]>();
  for (const [repoId, colorschemeMap] of repoMap) {
    colorschemesByRepo.set(repoId, Array.from(colorschemeMap.values()));
  }

  return colorschemesByRepo;
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

function rowsToDTOs(
  rows: Row[],
  colorschemesByRepo: Map<number, ColorschemeDTO[]>,
): RepositoryDTO[] {
  return rows.map(row => {
    const vimColorSchemes = colorschemesByRepo.get(row.id as number) ?? [];
    return rowToDTO(row, vimColorSchemes);
  });
}

async function getAllRepositoryKeys(): Promise<RepositoryKey[]> {
  const client = DatabaseService.getClient();
  const result = await client.execute(
    `SELECT r.owner_name, r.name FROM repositories r WHERE ${BASE_CLAUSE}`,
  );
  return result.rows.map(row => ({
    ownerName: row.owner_name as string,
    name: row.name as string,
  }));
}

/**
 * Get the total number of repositories from the database.
 *
 * @example
 * const count = await RepositoriesService.getRepositoryCount({ background: 'dark' });
 *
 * @params filter The filter to apply.
 * @returns The total number of repositories.
 */
async function getRepositoryCount(filter: Filter): Promise<number> {
  const client = DatabaseService.getClient();
  const { joins, clauses, params } = QueryHelper.getFilterSQL(filter);
  const sql = `SELECT COUNT(*) as count FROM repositories r ${joins.join(' ')} ${buildWhereSQL(filter, clauses)}`;
  const result = await client.execute({ sql, args: params });
  return Number(result.rows[0].count);
}

/**
 * Get paginated repositories from the database.
 *
 * @example
 * const repositories = await RepositoriesService.getRepositories({ sort: 'trending', filter: { background: Backgrounds.Dark }});
 *
 * @params params.sort The order and property to sort by.
 * @params params.filter The filter to apply to the query.
 *
 * @returns The repositories.
 */
async function getRepositories({
  sort,
  filter,
}: GetRepositoriesParams): Promise<Repository[]> {
  const repositories = await getRepositoryDTOs({ sort, filter });

  return repositories.map(hydrateRepository);
}

async function getRepositoryDTOs({
  sort,
  filter,
}: GetRepositoriesParams): Promise<RepositoryDTO[]> {
  const result = await getRepositoryDTOPage({ sort, filter });
  return result.repositories;
}

async function getRepositoryDTOPage({
  sort,
  filter,
}: GetRepositoriesParams): Promise<RepositoryPageDTOs> {
  const client = DatabaseService.getClient();
  const { joins, clauses, params } = QueryHelper.getFilterSQL(filter);
  const where = buildWhereSQL(filter, clauses);
  const orderBy = QueryHelper.getSortSQL(sort);
  const page = filter.page ?? 1;
  const offset = (page - 1) * Constants.REPOSITORY_PAGE_SIZE;

  const result = await client.execute({
    sql: `SELECT ${REPO_COLS} FROM repositories r ${joins.join(' ')} ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    args: [...params, Constants.REPOSITORY_PAGE_SIZE + 1, offset],
  });

  const hasMore = result.rows.length > Constants.REPOSITORY_PAGE_SIZE;
  const rows = result.rows.slice(0, Constants.REPOSITORY_PAGE_SIZE);
  const repositoryIds = rows.map(row => row.id as number);
  const colorschemesByRepo =
    await loadColorschemesForRepositories(repositoryIds);

  return {
    repositories: rowsToDTOs(rows, colorschemesByRepo),
    hasMore,
  };
}

async function getFeaturedRepositoryDTOs(
  limit = FEATURED_REPOSITORY_LIMIT,
): Promise<RepositoryDTO[]> {
  const client = DatabaseService.getClient();
  const result = await client.execute({
    sql: `SELECT ${REPO_COLS} FROM repositories r
          WHERE r.featured_rank IS NOT NULL
            AND ${BASE_CLAUSE}
          ORDER BY r.featured_rank ASC
          LIMIT ?`,
    args: [limit],
  });

  const repositoryIds = result.rows.map(row => row.id as number);
  const colorschemesByRepo =
    await loadColorschemesForRepositories(repositoryIds);

  return rowsToDTOs(result.rows, colorschemesByRepo);
}

async function getAllRepositoryDTOs(): Promise<RepositoryDTO[]> {
  const client = DatabaseService.getClient();

  const [repoResult, allColorschemes] = await Promise.all([
    client.execute(
      `SELECT ${REPO_COLS} FROM repositories r WHERE ${BASE_CLAUSE}`,
    ),
    loadAllColorschemes(),
  ]);

  return rowsToDTOs(repoResult.rows, allColorschemes);
}

async function getRepositoryDTO(
  owner: string,
  name: string,
): Promise<RepositoryDTO | null> {
  const client = DatabaseService.getClient();

  const result = await client.execute({
    sql: `SELECT ${REPO_COLS} FROM repositories r
          WHERE r.owner_name = ? COLLATE NOCASE AND r.name = ? COLLATE NOCASE
            AND ${BASE_CLAUSE}
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

const BUILD_ID = process.env.NEXT_BUILD_ID ?? 'dev';

const cachedGetRepositoryCountQuery = unstable_cache(
  getRepositoryCount,
  [`${BUILD_ID}-repository-count`],
  { tags: ['repositories'] },
);

function getRepositoryCountFilter(filter: Filter): Filter {
  const countFilter = { ...filter };
  delete countFilter.page;
  return countFilter;
}

async function cachedGetRepositoryCount(filter: Filter): Promise<number> {
  return cachedGetRepositoryCountQuery(getRepositoryCountFilter(filter));
}

async function getRepositoryCountUncached(filter: Filter): Promise<number> {
  return getRepositoryCount(getRepositoryCountFilter(filter));
}

const cachedGetRepositoryDTOs = unstable_cache(
  getRepositoryDTOs,
  [`${BUILD_ID}-repository-dtos`],
  { tags: ['repositories'] },
);

const cachedGetFeaturedRepositoryDTOs = unstable_cache(
  getFeaturedRepositoryDTOs,
  [`${BUILD_ID}-featured-repository-dtos`],
  { tags: ['repositories'] },
);

const cachedGetAllRepositoryDTOs = unstable_cache(
  getAllRepositoryDTOs,
  [`${BUILD_ID}-all-repository-dtos`],
  { tags: ['repositories'] },
);

const cachedGetRepositoryDTO = unstable_cache(
  getRepositoryDTO,
  [`${BUILD_ID}-repository-dto`],
  { tags: ['repositories'] },
);

const cachedGetAllRepositoryKeys = unstable_cache(
  getAllRepositoryKeys,
  [`${BUILD_ID}-all-repository-keys`],
  { tags: ['repositories'] },
);

async function cachedGetAllRepositories(): Promise<Repository[]> {
  const repositories = await cachedGetAllRepositoryDTOs();
  return repositories.map(hydrateRepository);
}

async function cachedGetRepository(
  owner: string,
  name: string,
): Promise<Repository | null> {
  const dto = await cachedGetRepositoryDTO(owner, name);
  return dto ? hydrateRepository(dto) : null;
}

export const RepositoriesService = {
  getRepositoryCount: cachedGetRepositoryCount,
  getRepositoryCountUncached,
  getRepositories,
  getRepositoryDTOPage,
  getRepositoryDTOs: cachedGetRepositoryDTOs,
  getRepositoryDTOsUncached: getRepositoryDTOs,
  getFeaturedRepositoryDTOs: cachedGetFeaturedRepositoryDTOs,
  getAllRepositories: cachedGetAllRepositories,
  getAllRepositoryDTOs: cachedGetAllRepositoryDTOs,
  getAllRepositoryKeys: cachedGetAllRepositoryKeys,
  getRepository: cachedGetRepository,
  getRepositoryDTO: cachedGetRepositoryDTO,
};
