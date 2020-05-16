import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import Layout from "../../components/layout";
import SEO from "../../components/seo";

const RepositoryPage = ({ data, location }) => {
  const pageNumber = location?.state?.pageNumber;
  const { repository } = data;

  return (
    <Layout>
      <SEO title={`${repository.owner.name} ${repository.name}`} />
      <div>
        <br />
        <h1>{repository.name}</h1>
        <br />
        <p>{repository.description}</p>
        <br />
        {repository.githubUrl && (
          <>
            <a
              href={repository.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github home
            </a>
            <br />
            <br />
          </>
        )}
      </div>
      <Link to={!!pageNumber && pageNumber > 1 ? `/${pageNumber}` : "/"}>
        back home
      </Link>
      <br />
      <br />
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
    }
  }
`;

export default RepositoryPage;
