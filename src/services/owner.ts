import { cache } from 'react';

import DatabaseService from '@/services/database';

import { RepositoryModel } from '@/models/DTO/repository';
import Owner from '@/models/owner';

const VIM_COLORSCHEMES_FILTER = { vimColorSchemes: { $type: 'array' } };

const getOwner = cache(async (name: string): Promise<Owner | null> => {
  await DatabaseService.connect();

  const repositoryDTOs = await RepositoryModel.aggregate([
    {
      $match: {
        'owner.name': { $regex: `^${name}$`, $options: 'i' },
        ...VIM_COLORSCHEMES_FILTER,
      },
    },
    { $limit: 1 },
  ]);

  if (!repositoryDTOs.length) {
    return null;
  }

  return repositoryDTOs[0].owner;
});

const OwnersService = { getOwner };

export default OwnersService;
