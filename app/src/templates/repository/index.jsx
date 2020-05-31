import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

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

  return (
    <Layout>
      <SEO title={`${ownerName} ${name}`} />
      <div className="repository">
        <div className="repository__hero">
          <RepositoryTitle ownerName={ownerName} name={name} isRepositoryPage />
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            Github home
          </a>
        </div>
        {!!featuredImage && (
          <ZoomableImage image={featuredImage} className="repository__image" />
        )}
        <p>{description}</p>
        {!!images && images.length > 0 && <Mosaic images={images} />}
        <Link to={fromPath || "/"}>back</Link>
      </div>
    </Layout>
  );
};

RepositoryPage.propTypes = {
  data: PropTypes.shape({
    repository: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      githubUrl: PropTypes.string.isRequired,
      owner: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      featuredImage: PropTypes.shape({
        childImageSharp: PropTypes.shape({
          fluid: PropTypes.shape({}).isRequired,
        }).isRequired,
      }),
      images: PropTypes.arrayOf(
        PropTypes.shape({
          childImageSharp: PropTypes.shape({
            fluid: PropTypes.shape({}).isRequired,
          }).isRequired,
        }).isRequired,
      ),
    }),
  }),
  location: PropTypes.shape({
    fromPath: PropTypes.string,
  }),
};

export const query = graphql`
  query($ownerName: String!, $name: String!) {
    repository(owner: { name: { eq: $ownerName } }, name: { eq: $name }) {
      name
      description
      githubUrl: github_url
      owner {
        name
      }
      featuredImage {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
      images {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

export default RepositoryPage;
