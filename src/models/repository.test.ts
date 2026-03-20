import { describe, expect, it } from 'vitest';

import type { RepositoryDTO } from '#/models/DTO/repository';
import Repository from '#/models/repository';

const dto: RepositoryDTO = {
  name: 'gruvbox.nvim',
  owner: { name: 'ellisonleao' },
  description: 'A retro groove color scheme for Neovim.',
  githubCreatedAt: new Date('2020-01-01T00:00:00.000Z'),
  pushedAt: new Date('2020-01-02T00:00:00.000Z'),
  githubURL: 'https://github.com/ellisonleao/gruvbox.nvim',
  stargazersCount: 10,
  weekStargazersCount: 2,
  vimColorSchemes: [
    {
      name: 'gruvbox',
      backgrounds: ['dark', 'light'],
      data: {
        dark: [{ name: 'base00', hexCode: '#282828' }],
        light: [{ name: 'base00', hexCode: '#fbf1c7' }],
      },
    },
    {
      name: 'gruvbox-material',
      backgrounds: ['dark'],
      data: {
        dark: [{ name: 'base00', hexCode: '#1d2021' }],
        light: null,
      },
    },
  ],
};

describe('Repository', () => {
  it('exposes key and title from owner and name', () => {
    const repository = new Repository(dto);

    expect(repository.key).toBe('ellisonleao/gruvbox.nvim');
    expect(repository.title).toBe('gruvbox.nvim, by ellisonleao');
  });

  it('returns unique backgrounds across all colorschemes', () => {
    const repository = new Repository(dto);

    expect(repository.backgrounds).toEqual(['dark', 'light']);
  });

  it('flattens colorschemes to one entry per background', () => {
    const repository = new Repository(dto);

    expect(repository.flattenedColorschemes).toHaveLength(3);
    expect(
      repository.flattenedColorschemes.map(
        colorscheme => colorscheme.backgrounds,
      ),
    ).toEqual([['dark'], ['light'], ['dark']]);
  });
});
