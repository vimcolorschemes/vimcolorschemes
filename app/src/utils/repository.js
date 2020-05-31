export const getRepositoryInfos = repository => {
  if (!repository) return {};

  return {
    ...repository,
    ownerName: repository.owner?.name,
  }
};
