import { describe, it, expect } from 'vitest';

import RepositoryDTO from '@/models/DTO/repository';
import Repository from '@/models/repository';

const dtoLight: RepositoryDTO = {
  name: 'repository',
  owner: { name: 'owner' },
  description: 'description',
  githubCreatedAt: new Date(),
  lastCommitAt: new Date(),
  githubURL: 'https://github.com',
  stargazersCount: 100,
  weekStargazersCount: 10,
  isLua: false,
  colorschemes: [
    {
      name: 'colorscheme',
      backgrounds: ['light'],
      data: { light: [{ name: 'test', hexCode: '#ffffff' }], dark: null },
      isLua: false,
    },
  ],
};

const dtoDark: RepositoryDTO = {
  ...dtoLight,
  colorschemes: [
    {
      ...dtoLight.colorschemes[0],
      backgrounds: ['dark'],
      data: { light: null, dark: [{ name: 'test', hexCode: '#ffffff' }] },
    },
  ],
};

const dtoMixed: RepositoryDTO = {
  ...dtoLight,
  colorschemes: [
    {
      ...dtoLight.colorschemes[0],
      backgrounds: ['light', 'dark'],
      data: {
        light: [{ name: 'test', hexCode: '#ffffff' }],
        dark: [{ name: 'test', hexCode: '#ffffff' }],
      },
    },
  ],
};

describe('new Repository()', () => {
  it('should create a new repository from a DTO object', () => {
    const repository = new Repository(dtoLight);
    expect(repository.name).toBe(dtoLight.name);
    expect(repository.owner).toEqual(dtoLight.owner);
    expect(repository.description).toBe(dtoLight.description);
    expect(repository.dto.colorschemes).toEqual(dtoLight.colorschemes);
  });
});

describe('repository.key', () => {
  it('should return the key of the repository', () => {
    const repository = new Repository(dtoLight);
    expect(repository.key).toBe('owner/repository');
  });
});

describe('repository.route', () => {
  it('should return the route of the repository', () => {
    const repository = new Repository(dtoLight);
    expect(repository.route).toBe('/owner/repository');
  });
});

describe('repository.title', () => {
  it('should return the title of the repository', () => {
    const repository = new Repository(dtoLight);
    expect(repository.title).toBe('repository, by owner');
  });
});

describe('repository.backgrounds', () => {
  it('should return the backgrounds of the repository', () => {
    const repositoryLight = new Repository(dtoLight);
    expect(repositoryLight.backgrounds).toEqual(['light']);

    const repositoryDark = new Repository(dtoDark);
    expect(repositoryDark.backgrounds).toEqual(['dark']);

    const repositoryMixed = new Repository(dtoMixed);
    expect(repositoryMixed.backgrounds).toEqual(['light', 'dark']);
  });
});

describe('repository.flattenedColorschemes', () => {
  it('should return all backgrounds as standalone colorschemes', () => {
    const repository = new Repository(dtoMixed);
    expect(repository.flattenedColorschemes.length).toBe(2);
    expect(repository.flattenedColorschemes[0].backgrounds.length).toBe(1);
    expect(repository.flattenedColorschemes[1].backgrounds.length).toBe(1);
    expect([
      ...repository.flattenedColorschemes[0].backgrounds,
      ...repository.flattenedColorschemes[1].backgrounds,
    ]).toEqual(['dark', 'light']);
  });

  it('should return multiple colorschemes if there are multiple', () => {
    const dto = { ...dtoMixed };
    dto.colorschemes.push(dto.colorschemes[0]);
    const repository = new Repository(dtoMixed);
    expect(repository.flattenedColorschemes.length).toBe(4);
  });
});
