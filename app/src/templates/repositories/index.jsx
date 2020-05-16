import React from "react";
import { graphql, Link } from "gatsby";
import Img from "gatsby-image";

import { URLify } from "../../utils/string";

import Grid from "../../components/grid";
import Layout from "../../components/layout";
import SEO from "../../components/seo";

import "../../style/index.scss";

const RepositoriesPage = ({ data, pageContext }) => {
  const { totalCount, repositories } = data?.repositoriesData;

  const { currentPage, pageCount } = pageContext;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  const prevPage = currentPage - 1 === 1 ? "/" : (currentPage - 1).toString();
  const nextPage = (currentPage + 1).toString();

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
      <Grid>
        {repositories.map(repository => (
          <Link
            key={`repository__${repository.owner.name}__${repository.name}`}
            to={URLify(`${repository.owner.name}/${repository.name}`)}
            state={{ pageNumber: currentPage }}
          >
            {repository.owner.name}/{repository.name}
            {!!repository.image?.childImageSharp?.fluid && (
              <Img
                fluid={repository.image?.childImageSharp?.fluid}
                alt={`vim color scheme repository ${repository.name}`}
              />
            )}
            <br />
          </Link>
        ))}
      </Grid>
      <br />
      <div style={{ display: "flex" }}>
        {!isFirstPage && <Link to={prevPage}>Previous page</Link>}
        <p>{currentPage}</p>
        {!isLastPage && <Link to={nextPage}>Next page</Link>}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    repositoriesData: allRepository(
      sort: { fields: stargazers_count, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      repositories: nodes {
        name
        description
        owner {
          name
        }
        image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

export default RepositoriesPage;
