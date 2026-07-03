import { createClient } from '@libsql/client';

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputPath = path.join(
  process.cwd(),
  'public',
  'search',
  'repositories.json',
);
const booleanColorGroupAttributes = [
  'bold',
  'italic',
  'underline',
  'undercurl',
  'underdouble',
  'underdotted',
  'underdashed',
  'strikethrough',
  'reverse',
];

function getDatabaseURL() {
  const url = process.env.DATABASE_URL ?? 'file:./database/vimcolorschemes.db';

  if (!url.startsWith('file:')) {
    return url;
  }

  const filePath = url.slice('file:'.length);
  if (path.isAbsolute(filePath)) {
    return url;
  }

  return `file:${path.join(process.cwd(), filePath)}`;
}

function booleanAttribute(row, key) {
  const value = row[key];
  return value === true || value === 1;
}

function rowToColorGroup(row, name, hexCode) {
  const group = { name, hexCode };

  for (const attribute of booleanColorGroupAttributes) {
    if (booleanAttribute(row, `csg_${attribute}`)) {
      group[attribute] = true;
    }
  }

  return group;
}

function appendColorschemeRow(colorschemeMap, row) {
  const id = row.cs_id;
  const name = row.cs_name;

  if (!colorschemeMap.has(id)) {
    colorschemeMap.set(id, {
      name,
      backgrounds: [],
      data: { light: null, dark: null },
    });
  }

  const colorscheme = colorschemeMap.get(id);
  const background = row.csg_background;
  const groupName = row.csg_name;
  const hexCode = row.csg_hex_code;

  if (!background || !groupName || !hexCode) {
    return;
  }

  const group = rowToColorGroup(row, groupName, hexCode);
  if (background === 'light') {
    colorscheme.data.light ??= [];
    colorscheme.data.light.push(group);
    if (!colorscheme.backgrounds.includes('light')) {
      colorscheme.backgrounds.push('light');
    }
  } else if (background === 'dark') {
    colorscheme.data.dark ??= [];
    colorscheme.data.dark.push(group);
    if (!colorscheme.backgrounds.includes('dark')) {
      colorscheme.backgrounds.push('dark');
    }
  }
}

function buildColorschemesByRepo(rows) {
  const repoMap = new Map();

  for (const row of rows) {
    const repoId = row.repo_id;
    if (!repoMap.has(repoId)) {
      repoMap.set(repoId, new Map());
    }

    appendColorschemeRow(repoMap.get(repoId), row);
  }

  const colorschemesByRepo = new Map();
  for (const [repoId, colorschemeMap] of repoMap) {
    colorschemesByRepo.set(repoId, Array.from(colorschemeMap.values()));
  }

  return colorschemesByRepo;
}

function rowToDTO(row, vimColorSchemes) {
  return {
    name: row.name,
    owner: { name: row.owner_name },
    description: row.description || '',
    githubCreatedAt: row.github_created_at,
    pushedAt: row.pushed_at,
    githubURL: row.github_url || '',
    stargazersCount: row.stargazers_count || 0,
    weekStargazersCount: row.week_stargazers_count || 0,
    vimColorSchemes,
  };
}

async function main() {
  const client = createClient({
    url: getDatabaseURL(),
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const [repositoryResult, colorschemeResult] = await Promise.all([
    client.execute(
      `SELECT r.id, r.owner_name, r.name, r.description, r.github_url, r.stargazers_count, r.week_stargazers_count, r.github_created_at, r.pushed_at
       FROM repositories r
       WHERE r.has_dark = 1 OR r.has_light = 1
       ORDER BY r.week_stargazers_count DESC, r.id`,
    ),
    client.execute(
      `SELECT cs.repository_id as repo_id, cs.id as cs_id, cs.name as cs_name, csg.background as csg_background, csg.name as csg_name, csg.hex_code as csg_hex_code, csg.bold as csg_bold, csg.italic as csg_italic, csg.underline as csg_underline, csg.undercurl as csg_undercurl, csg.underdouble as csg_underdouble, csg.underdotted as csg_underdotted, csg.underdashed as csg_underdashed, csg.strikethrough as csg_strikethrough, csg.reverse as csg_reverse
       FROM colorschemes cs
       LEFT JOIN colorscheme_groups csg ON csg.colorscheme_id = cs.id
       ORDER BY cs.repository_id, cs.id, csg.id`,
    ),
  ]);

  const colorschemesByRepo = buildColorschemesByRepo(colorschemeResult.rows);
  const repositories = repositoryResult.rows.map(row =>
    rowToDTO(row, colorschemesByRepo.get(row.id) ?? []),
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(repositories));

  console.log(
    `Generated search manifest with ${repositories.length} repositories at ${outputPath}`,
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
