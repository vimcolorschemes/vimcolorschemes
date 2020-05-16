import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { URLify } from "../../utils/string";

import Card from "../../components/card";
import Grid from "../../components/grid";
import Layout from "../../components/layout";
import SEO from "../../components/seo";

import "../../style/index.scss";

const RepositoriesPage = ({ data, pageContext }) => {
  const { totalCount, repositories } = data?.repositoriesData;

  const { currentPage, pageCount } = pageContext;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  const prevPage = currentPage - 1 === 1 ? "" : (currentPage - 1).toString();
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
        {repositories.map(repository => {
          const repositoryKey = `${repository.owner.name}/${repository.name}`;
          return (
            <Card
              key={`repository__${repositoryKey}`}
              linkTo={`/${URLify(repositoryKey)}`}
              linkState={{ pageNumber: currentPage }}
              title={repository.name}
              subtitle={repository.owner.name}
              description={repository.description}
              image={repository.image}
            />
          );
        })}
      </Grid>
      <br />
      <div style={{ display: "flex" }}>
        {!isFirstPage && <Link to={`/${prevPage}`}>Previous page</Link>}
        <p>{currentPage}</p>
        {!isLastPage && <Link to={`/${nextPage}`}>Next page</Link>}
      </div>
    </Layout>
  );
};

RepositoriesPage.propTypes = {
  data: PropTypes.shape({
    repositoriesData: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      repositories: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          owner: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
          image: PropTypes.shape({
            childImageSharp: PropTypes.shape({
              fluid: PropTypes.shape({}).isRequired,
            }).isRequired,
          }),
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    skip: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
  }),
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
