import moment from "moment";

export const getRepositoryInfos = repository => {
  if (!repository) return {};

  return {
    ...repository,
    ownerName: repository.owner?.name,
    createdAt: moment(repository.createdAt).fromNow(),
    lastCommitAt: moment(repository.lastCommitAt).fromNow(),
  };
};
