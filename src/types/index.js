import PropTypes from "prop-types";

export const GatsbyImageType = PropTypes.shape({
  childImageSharp: PropTypes.shape({
    fluid: PropTypes.object.isRequired,
  }),
});

export const RepositoryOwnerType = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

export const RepositoryType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  githubUrl: PropTypes.string.isRequired,
  owner: RepositoryOwnerType.isRequired,
  featuredImage: GatsbyImageType,
  stargazersCount: PropTypes.number.isRequired,
  weekStargazersCount: PropTypes.number,
  images: PropTypes.arrayOf(GatsbyImageType.isRequired),
  lastCommitAt: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
});
