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

// Returns the usable first image; that was properly processed at build time
export const getFirstProcessedFluidImage = (featuredImage, images) => {
  if (featuredImage?.childImageSharp?.fluid)
    return featuredImage.childImageSharp.fluid;

  if (!images || images.length === 0) return null;

  return images.find(image => !!image?.childImageSharp?.fluid) || null;
};
