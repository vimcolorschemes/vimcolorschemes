import mongoose from 'mongoose';

import ColorschemeDTO from '@/models/DTO/colorscheme';
import Owner from '@/models/owner';

type RepositoryDTO = {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: Date;
  pushedAt: Date;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  vimColorSchemes: ColorschemeDTO[];
};

const RepositorySchema = new mongoose.Schema<RepositoryDTO>({
  name: String,
  owner: { name: String, avatarURL: String },
  description: String,
  githubCreatedAt: Date,
  pushedAt: Date,
  githubURL: String,
  stargazersCount: Number,
  weekStargazersCount: Number,
  vimColorSchemes: [
    {
      name: String,
      backgrounds: Array<string>,
      data: {
        light: Array<{ name: string; hexCode: string }>,
        dark: Array<{ name: string; hexCode: string }>,
      },
    },
  ],
});

export const RepositoryModel =
  mongoose.models?.repositories ||
  mongoose.model('repositories', RepositorySchema);

export default RepositoryDTO;
