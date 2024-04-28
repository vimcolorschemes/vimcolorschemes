import mongoose from 'mongoose';

import ColorschemeDTO from '@/models/DTO/colorscheme';
import Owner from '@/models/owner';

type RepositoryDTO = {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: Date;
  lastCommitAt: Date;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  isLua: boolean;
  colorschemes: ColorschemeDTO[];
};

const RepositorySchema = new mongoose.Schema<RepositoryDTO>({
  name: String,
  owner: { name: String },
  description: String,
  githubCreatedAt: Date,
  lastCommitAt: Date,
  githubURL: String,
  stargazersCount: Number,
  weekStargazersCount: Number,
  isLua: Boolean,
  colorschemes: [
    {
      name: String,
      isLua: Boolean,
      backgrounds: Array<String>,
      data: {
        light: Array<{ name: String; hexCode: String }>,
        dark: Array<{ name: String; hexCode: String }>,
      },
    },
  ],
});

export const RepositoryModel =
  mongoose.models?.repositories ||
  mongoose.model('repositories', RepositorySchema);

export default RepositoryDTO;
