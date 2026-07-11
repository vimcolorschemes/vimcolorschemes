import { describe, expect, it } from 'vitest';

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { buildSearchManifest } from '../../../scripts/generate-search-manifest.mjs';

const repositoryRow = {
  id: 1,
  owner_name: 'owner',
  name: 'theme',
  description: 'A theme',
  github_url: 'https://github.com/owner/theme',
  stargazers_count: 10,
  week_stargazers_count: 2,
  github_created_at: '2024-01-01T00:00:00.000Z',
  pushed_at: '2024-02-01T00:00:00.000Z',
};

describe('buildSearchManifest', () => {
  it('builds repository entries with manifest defaults', () => {
    const repositories = buildSearchManifest(
      [
        {
          ...repositoryRow,
          description: null,
          github_url: null,
          stargazers_count: null,
          week_stargazers_count: null,
          pushed_at: null,
        },
      ],
      [],
    );

    expect(repositories).toEqual([
      {
        name: 'theme',
        owner: { name: 'owner' },
        description: '',
        githubCreatedAt: '2024-01-01T00:00:00.000Z',
        pushedAt: '1970-01-01T00:00:00.000Z',
        githubURL: '',
        stargazersCount: 0,
        weekStargazersCount: 0,
        vimColorSchemes: [],
      },
    ]);
  });

  it('groups light and dark color data into one colorscheme', () => {
    const repositories = buildSearchManifest(
      [repositoryRow],
      [
        {
          repo_id: 1,
          cs_id: 11,
          cs_name: 'theme',
          csg_background: 'light',
          csg_name: 'Normal',
          csg_hex_code: '#ffffff',
        },
        {
          repo_id: 1,
          cs_id: 11,
          cs_name: 'theme',
          csg_background: 'dark',
          csg_name: 'Normal',
          csg_hex_code: '#000000',
        },
      ],
    );

    expect(repositories[0].vimColorSchemes).toEqual([
      {
        name: 'theme',
        backgrounds: ['light', 'dark'],
        data: {
          light: [{ name: 'Normal', hexCode: '#ffffff' }],
          dark: [{ name: 'Normal', hexCode: '#000000' }],
        },
      },
    ]);
  });

  it('includes only enabled boolean color-group attributes', () => {
    const repositories = buildSearchManifest(
      [repositoryRow],
      [
        {
          repo_id: 1,
          cs_id: 11,
          cs_name: 'theme',
          csg_background: 'dark',
          csg_name: 'Enabled',
          csg_hex_code: '#111111',
          csg_bold: true,
          csg_italic: 1,
          csg_underline: true,
          csg_undercurl: 1,
          csg_underdouble: true,
          csg_underdotted: 1,
          csg_underdashed: true,
          csg_strikethrough: 1,
          csg_reverse: true,
        },
        {
          repo_id: 1,
          cs_id: 11,
          cs_name: 'theme',
          csg_background: 'dark',
          csg_name: 'Disabled',
          csg_hex_code: '#222222',
          csg_bold: false,
          csg_italic: 0,
          csg_underline: null,
          csg_undercurl: '1',
          csg_underdouble: 2,
        },
      ],
    );

    expect(repositories[0].vimColorSchemes[0].data.dark).toEqual([
      {
        name: 'Enabled',
        hexCode: '#111111',
        bold: true,
        italic: true,
        underline: true,
        undercurl: true,
        underdouble: true,
        underdotted: true,
        underdashed: true,
        strikethrough: true,
        reverse: true,
      },
      {
        name: 'Disabled',
        hexCode: '#222222',
      },
    ]);
  });

  it('matches server DTOs generated from the checked-in database', async () => {
    const databaseURL = `file:${path.join(
      process.cwd(),
      'database',
      'vimcolorschemes.db',
    )}`;
    const previousDatabaseURL = process.env.DATABASE_URL;

    try {
      process.env.DATABASE_URL = databaseURL;
      execFileSync(process.execPath, ['scripts/generate-search-manifest.mjs'], {
        cwd: process.cwd(),
        env: {
          ...process.env,
          DATABASE_URL: databaseURL,
          DATABASE_AUTH_TOKEN: '',
        },
      });

      const manifest = JSON.parse(
        readFileSync('public/search/repositories.json', 'utf8'),
      );
      const { RepositoriesService } =
        await import('../../services/repositoriesServer.ts');
      const serverRepositories = JSON.parse(
        JSON.stringify(await RepositoriesService.getAllRepositoryDTOs()),
      );

      expect(sortRepositories(manifest)).toEqual(
        sortRepositories(serverRepositories),
      );
    } finally {
      if (previousDatabaseURL == null) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = previousDatabaseURL;
      }
    }
  });
});

function sortRepositories(repositories) {
  return [...repositories].sort((a, b) =>
    `${a.owner.name}/${a.name}`.localeCompare(`${b.owner.name}/${b.name}`),
  );
}
