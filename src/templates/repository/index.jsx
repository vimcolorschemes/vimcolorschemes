import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { RepositoryType } from "../../types";

import { LAYOUTS, SECTIONS } from "../../constants";

import { useNavigation } from "../../hooks/useNavigation";

import { getRepositoryInfos } from "../../utils/repository";

import Layout from "../../components/layout";
import Mosaic from "../../components/mosaic";
import RepositoryTitle from "../../components/repositoryTitle";
import SEO from "../../components/seo";
import ZoomableImage from "../../components/zoomableImage";

import "./indes.scss";

const RepositoryPage = ({ data, location }) => {
  const fromPath = location?.state?.fromPath;

  const {
    ownerName,
    name,
    githubUrl,
    featuredImage,
    description,
    images,
  } = getRepositoryInfos(data.repository);

  useNavigation(SECTIONS.REPOSITORY_MAIN_IMAGE);

  return (
    <Layout>
      <SEO title={`${name} vim color scheme, by ${ownerName}`} />
      <div className="repository">
        <div className="repository__hero">
          <div className="repository__header">
            <RepositoryTitle ownerName={ownerName} name={name} />
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-section={SECTIONS.REPOSITORY_HEADER}
              data-layout={LAYOUTS.LIST}
              className="repository__nav-link"
            >
              GitHub
            </a>
          </div>
          <p>{description}</p>
        </div>
        {!!featuredImage && (
          <ZoomableImage
            image={featuredImage}
            alt="featured"
            className="repository__image"
            data-section={SECTIONS.REPOSITORY_MAIN_IMAGE}
            data-layout={LAYOUTS.BLOCK}
          />
        )}
        {!!images && images.length > 0 && <Mosaic images={images} />}
        <Link
          to={fromPath || "/"}
          data-section={SECTIONS.REPOSITORY_NAV}
          data-layout={LAYOUTS.LIST}
          className="repository__nav-link"
        >
          back
        </Link>
      </div>
    </Layout>
  );
};

RepositoryPage.propTypes = {
  data: PropTypes.shape({
    repository: RepositoryType,
  }),
  location: PropTypes.shape({
    fromPath: PropTypes.string,
  }),
};

export const query = graphql`
  query($ownerName: String!, $name: String!) {
    repository: mongodbVimcsRepositories(
      owner: { name: { eq: $ownerName } }
      name: { eq: $name }
    ) {
      name
      description
      githubUrl: github_url
      stargazersCount: stargazers_count
      lastCommitAt: last_commit_at
      createdAt: github_created_at
      owner {
        name
      }
      featuredImage: processed_featured_image {
        childImageSharp {
          fluid(maxWidth: 1280, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      images: processed_images {
        childImageSharp {
          fluid(maxWidth: 1280, quality: 80) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

export default RepositoryPage;
