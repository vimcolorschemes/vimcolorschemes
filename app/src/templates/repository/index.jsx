import React from "react";
import Img from "gatsby-image";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import Layout from "../../components/layout";
import Mosaic from "../../components/mosaic";
import SEO from "../../components/seo";

const RepositoryPage = ({ data, location }) => {
  const pageNumber = location?.state?.pageNumber;
  const { repository } = data;

  return (
    <Layout>
      <SEO title={`${repository.owner.name} ${repository.name}`} />
      <div className="repository">
        <p className="repository__owner-name">{repository.owner.name}</p>
        <h1 className="repository__name">{repository.name}</h1>
        {!!repository.featuredImage?.childImageSharp?.fluid && (
          <Img
            fluid={repository.featuredImage.childImageSharp.fluid}
            alt={`${repository.owner.name} ${repository.name}`}
            className="repository__featured-image"
          />
        )}
        <p>{repository.description}</p>
        {!!repository.images && repository.images.length > 0 && (
          <Mosaic images={repository.images} />
        )}
        {repository.githubUrl && (
          <>
            <a
              href={repository.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github home
            </a>
          </>
        )}
        <Link to={!!pageNumber && pageNumber > 1 ? `/${pageNumber}` : "/"}>
          back home
        </Link>
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
