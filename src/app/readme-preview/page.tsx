import type { ColorschemeDTO } from '@/models/DTO/colorscheme';
import type { RepositoryDTO } from '@/models/DTO/repository';

import { Backgrounds } from '@/lib/backgrounds';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import ExploreCommand from '@/components/exploreCommandInput/command';
import RepositoryCard from '@/components/repositoryCard';

import styles from './page.module.css';

const groups = [
  'NormalBg',
  'NormalFg',
  'StatusLineBg',
  'StatusLineFg',
  'LineNrBg',
  'LineNrFg',
  'CursorLineBg',
  'CursorLineFg',
  'CursorLineNrBg',
  'CursorLineNrFg',
  'vimLineCommentFg',
  'vimCommandFg',
  'vimFunctionFg',
  'vimParenSepFg',
  'vimOperParenFg',
  'vimFuncBodyFg',
  'vimIsCommandFg',
  'vimLetFg',
  'vimVarFg',
  'vimOperFg',
  'vimFuncNameFg',
  'vimFuncVarFg',
  'vimStringFg',
  'vimSubstFg',
  'vimNumberFg',
  'vimNotFuncFg',
];

const palettes: Record<string, Record<string, string>> = {
  'olive-crt': {
    NormalBg: '#171A15',
    NormalFg: '#FBFCF6',
    StatusLineBg: '#20241D',
    StatusLineFg: '#FBFCF6',
    LineNrBg: '#171A15',
    LineNrFg: '#99A293',
    CursorLineBg: '#232720',
    CursorLineFg: '#FBFCF6',
    CursorLineNrBg: '#232720',
    CursorLineNrFg: '#FBFCF6',
    vimLineCommentFg: '#C0C7B7',
    vimCommandFg: '#BCCD80',
    vimFunctionFg: '#BCCD80',
    vimParenSepFg: '#99A293',
    vimOperParenFg: '#EDF0E6',
    vimFuncBodyFg: '#FBFCF6',
    vimIsCommandFg: '#F5A764',
    vimLetFg: '#BCCD80',
    vimVarFg: '#EDF0E6',
    vimOperFg: '#EDF0E6',
    vimFuncNameFg: '#F5A764',
    vimFuncVarFg: '#EDF0E6',
    vimStringFg: '#90DDE4',
    vimSubstFg: '#F5A764',
    vimNumberFg: '#FBE09F',
    vimNotFuncFg: '#BCCD80',
  },
  lumon: {
    NormalBg: '#1B2D40',
    NormalFg: '#C7D2DE',
    StatusLineBg: '#16242D',
    StatusLineFg: '#C7D2DE',
    LineNrBg: '#1B2D40',
    LineNrFg: '#355066',
    CursorLineBg: '#3D4E60',
    CursorLineFg: '#C7D2DE',
    CursorLineNrBg: '#3D4E60',
    CursorLineNrFg: '#8FB9DC',
    vimLineCommentFg: '#355066',
    vimCommandFg: '#92C7E7',
    vimFunctionFg: '#92C7E7',
    vimParenSepFg: '#C7D2DE',
    vimOperParenFg: '#C7D2DE',
    vimFuncBodyFg: '#C7D2DE',
    vimIsCommandFg: '#B5DEEF',
    vimLetFg: '#92C7E7',
    vimVarFg: '#9FCFE9',
    vimOperFg: '#C7D2DE',
    vimFuncNameFg: '#9FCFE9',
    vimFuncVarFg: '#9FCFE9',
    vimStringFg: '#79ABD2',
    vimSubstFg: '#9FCFE9',
    vimNumberFg: '#8FB9DC',
    vimNotFuncFg: '#92C7E7',
  },
  vague: {
    NormalBg: '#141415',
    NormalFg: '#CDCDCD',
    StatusLineBg: '#1C1C24',
    StatusLineFg: '#CDCDCD',
    LineNrBg: '#141415',
    LineNrFg: '#606079',
    CursorLineBg: '#252530',
    CursorLineFg: '#CDCDCD',
    CursorLineNrBg: '#252530',
    CursorLineNrFg: '#CDCDCD',
    vimLineCommentFg: '#606079',
    vimCommandFg: '#6E94B2',
    vimFunctionFg: '#6E94B2',
    vimParenSepFg: '#CDCDCD',
    vimOperParenFg: '#90A0B5',
    vimFuncBodyFg: '#90A0B5',
    vimIsCommandFg: '#B4D4CF',
    vimLetFg: '#6E94B2',
    vimVarFg: '#AEAED1',
    vimOperFg: '#90A0B5',
    vimFuncNameFg: '#C48282',
    vimFuncVarFg: '#AEAED1',
    vimStringFg: '#E8B589',
    vimSubstFg: '#C48282',
    vimNumberFg: '#E0A363',
    vimNotFuncFg: '#6E94B2',
  },
  everforest: palette(
    '#2d353b',
    '#d3c6aa',
    '#a7c080',
    '#1e2326',
    '#343f44',
    '#a7c080',
    '#d699b6',
    '#dbbc7f',
    '#e67e80',
    '#7a8478',
  ),
  kanagawa: {
    NormalBg: '#1F1F28',
    NormalFg: '#DCD7BA',
    StatusLineBg: '#16161D',
    StatusLineFg: '#C8C093',
    LineNrBg: '#2A2A37',
    LineNrFg: '#54546D',
    CursorLineBg: '#363646',
    CursorLineFg: '#DCD7BA',
    CursorLineNrBg: '#2A2A37',
    CursorLineNrFg: '#FF9E3B',
    vimLineCommentFg: '#727169',
    vimCommandFg: '#957FB8',
    vimFunctionFg: '#957FB8',
    vimParenSepFg: '#9E9B93',
    vimOperParenFg: '#C4746E',
    vimFuncBodyFg: '#DCD7BA',
    vimIsCommandFg: '#7FB4CA',
    vimLetFg: '#957FB8',
    vimVarFg: '#E6C384',
    vimOperFg: '#C4746E',
    vimFuncNameFg: '#7E9CD8',
    vimFuncVarFg: '#E6C384',
    vimStringFg: '#98BB6C',
    vimSubstFg: '#7E9CD8',
    vimNumberFg: '#D27E99',
    vimNotFuncFg: '#957FB8',
  },
  gruvbox: {
    NormalBg: '#282828',
    NormalFg: '#EBDBB2',
    StatusLineBg: '#EBDBB2',
    StatusLineFg: '#504945',
    LineNrBg: '#282828',
    LineNrFg: '#7C6F64',
    CursorLineBg: '#3C3836',
    CursorLineFg: '#EBDBB2',
    CursorLineNrBg: '#3C3836',
    CursorLineNrFg: '#FABD2F',
    vimLineCommentFg: '#928374',
    vimCommandFg: '#FB4934',
    vimFunctionFg: '#FB4934',
    vimParenSepFg: '#E0E2EA',
    vimOperParenFg: '#EBDBB2',
    vimFuncBodyFg: '#EBDBB2',
    vimIsCommandFg: '#FE8019',
    vimLetFg: '#FB4934',
    vimVarFg: '#83A598',
    vimOperFg: '#EBDBB2',
    vimFuncNameFg: '#B8BB26',
    vimFuncVarFg: '#83A598',
    vimStringFg: '#B8BB26',
    vimSubstFg: '#B8BB26',
    vimNumberFg: '#D3869B',
    vimNotFuncFg: '#FB4934',
  },
  tokyonight: {
    NormalBg: '#1A1B26',
    NormalFg: '#C0CAF5',
    StatusLineBg: '#16161E',
    StatusLineFg: '#A9B1D6',
    LineNrBg: '#1A1B26',
    LineNrFg: '#3B4261',
    CursorLineBg: '#292E42',
    CursorLineFg: '#C0CAF5',
    CursorLineNrBg: '#292E42',
    CursorLineNrFg: '#FF9E64',
    vimLineCommentFg: '#565F89',
    vimCommandFg: '#BB9AF7',
    vimFunctionFg: '#BB9AF7',
    vimParenSepFg: '#2AC3DE',
    vimOperParenFg: '#89DDFF',
    vimFuncBodyFg: '#C0CAF5',
    vimIsCommandFg: '#2AC3DE',
    vimLetFg: '#BB9AF7',
    vimVarFg: '#BB9AF7',
    vimOperFg: '#89DDFF',
    vimFuncNameFg: '#7AA2F7',
    vimFuncVarFg: '#BB9AF7',
    vimStringFg: '#9ECE6A',
    vimSubstFg: '#7AA2F7',
    vimNumberFg: '#FF9E64',
    vimNotFuncFg: '#BB9AF7',
  },
};

const pageContext: PageContext = {
  sort: SortOptions.Trending,
  filter: { background: Backgrounds.Dark },
};

const colorschemes = [
  repo('olive-crt.nvim', 'vimcolorschemes', 'olive-crt', 9, 0),
  repo('vague.nvim', 'vague-theme', 'vague', 1121, 9),
  repo('lumon.nvim', 'omacom-io', 'lumon', 13, 0),
  repo('kanagawa.nvim', 'rebelot', 'kanagawa', 6126, 16),
  repo('gruvbox', 'morhetz', 'gruvbox', 15496, 17),
  repo('tokyonight.nvim', 'folke', 'tokyonight', 8022, 17),
];

export default function ReadmePreviewPage() {
  return (
    <main className="readme-preview-page">
      <div className={styles.viewport}>
        <header className={styles.header}>
          <ExploreCommand interactive={false} pageContext={pageContext} />
        </header>
        <section className={styles.grid} aria-label="Colorscheme previews">
          {colorschemes.map(repository => (
            <RepositoryCard
              key={`${repository.owner.name}/${repository.name}`}
              repositoryDTO={repository}
              pageContext={pageContext}
              className={styles.card}
              headingLevel="h2"
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function repo(
  name: string,
  ownerName: string,
  paletteName: string,
  stargazersCount: number,
  weekStargazersCount: number,
): RepositoryDTO {
  return {
    name,
    owner: { name: ownerName },
    description: `${name} colorscheme preview`,
    githubCreatedAt: '2020-01-01T00:00:00.000Z',
    pushedAt: '2026-01-01T00:00:00.000Z',
    githubURL: `https://github.com/${ownerName}/${name}`,
    stargazersCount,
    weekStargazersCount,
    vimColorSchemes: [colorscheme(paletteName, palettes[paletteName])],
  };
}

function colorscheme(
  name: string,
  colors: Record<string, string>,
): ColorschemeDTO {
  return {
    name,
    backgrounds: [Backgrounds.Dark],
    data: {
      light: null,
      dark: groups.map(group => ({ name: group, hexCode: colors[group] })),
    },
  };
}

function palette(
  bg: string,
  fg: string,
  statusBg: string,
  statusFg: string,
  cursorBg: string,
  green: string,
  purple: string,
  orange: string,
  red: string,
  lineNr: string,
) {
  return {
    NormalBg: bg,
    NormalFg: fg,
    StatusLineBg: statusBg,
    StatusLineFg: statusFg,
    LineNrBg: bg,
    LineNrFg: lineNr,
    CursorLineBg: cursorBg,
    CursorLineFg: fg,
    CursorLineNrBg: cursorBg,
    CursorLineNrFg: fg,
    vimLineCommentFg: '#7f849c',
    vimCommandFg: purple,
    vimFunctionFg: statusBg,
    vimParenSepFg: fg,
    vimOperParenFg: red,
    vimFuncBodyFg: fg,
    vimIsCommandFg: orange,
    vimLetFg: purple,
    vimVarFg: orange,
    vimOperFg: statusBg,
    vimFuncNameFg: statusBg,
    vimFuncVarFg: orange,
    vimStringFg: green,
    vimSubstFg: red,
    vimNumberFg: orange,
    vimNotFuncFg: red,
  };
}
