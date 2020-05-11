import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

import "../style/index.scss";

const IndexPage = ({ data }) => {
  const { totalCount, repositories } = data?.jsonData;

  if (totalCount == null || repositories == null) return;

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <br />
      <p>
        <b>{totalCount}</b> repos
      </p>
      <br />
      <div>
        {!!repositories &&
          repositories.map((repository, index) => {
            return (
              <div
                key={`repository__${repository.owner?.name || index}__${
                  repository.name || index
                }`}
              >
                {repository.owner?.name || ""}
                {!!repository.owner?.name ? "/" : ""}
                {repository.name}
              </div>
            );
          })}
      </div>
      <br />
    </Layout>
  );
};

export const query = graphql`
  query RepositoryListQuery {
    jsonData: allDataJson {
      totalCount
      repositories: nodes {
        description
        owner {
          name
        }
        image_urls
        name
        startgazersCounts: stargazers_count
      }
    }
  }
`;

export default IndexPage;
