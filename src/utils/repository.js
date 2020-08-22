import moment from "moment";

const formatDate = date =>
  date instanceof Date ? moment(date).fromNow() : null;

const conditionalField = (fieldName, value, callback = item => item) => ({
  ...(!!value ? { [fieldName]: callback(value) } : {}),
});

export const getRepositoryInfos = repository => {
  if (!repository || !(repository instanceof Object)) return {};

  return {
    ...repository,
    ...conditionalField("ownerName", repository.owner?.name),
    ...conditionalField("createdAt", repository.createdAt, formatDate),
    ...conditionalField("lastCommitAt", repository.lastCommitAt, formatDate),
  };
};

const isValidProcessedFluidImage = imageObject =>
  !!imageObject?.childImageSharp?.fluid;

// Returns the usable first image; that was properly processed at build time
export const getFirstProcessedFluidImage = (featuredImage, images) => {
  if (isValidProcessedFluidImage(featuredImage))
    return featuredImage.childImageSharp.fluid;

  if (!images || images.length < 1 || !Array.isArray(images)) return null;

  const fallbackImage = images.find(isValidProcessedFluidImage);
  return fallbackImage ? fallbackImage.childImageSharp.fluid : null;
};
