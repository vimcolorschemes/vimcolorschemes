import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../../components/layout";
import SEO from "../../components/seo";

const RepoPage = ({ data }) => {
  const repository = data.repository;
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
      <Link to="/">back home</Link>
      <br />
      <br />
    </Layout>
  );
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

export default RepoPage;
