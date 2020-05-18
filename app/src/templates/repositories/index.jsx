import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { ACTIONS } from "../../constants/actions";
import { URLify } from "../../utils/string";

import Card from "../../components/card";
import Grid from "../../components/grid";
import Layout from "../../components/layout";
import SEO from "../../components/seo";

import "../../style/index.scss";
import "./index.scss";

const RepositoriesPage = ({ data, pageContext, location }) => {
  const { totalCount, repositories } = data?.repositoriesData;

  const { currentPage, pageCount } = pageContext;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  const prevPage = currentPage - 1 === 1 ? "" : (currentPage - 1).toString();
  const nextPage = (currentPage + 1).toString();

  const currentPath = location.pathname || "";
  const activeAction =
    Object.values(ACTIONS).find(
      action =>
        currentPath.includes(action.route) && action !== ACTIONS.DEFAULT,
    ) || ACTIONS.DEFAULT;

  if (totalCount == null || repositories == null) return;

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <p>{totalCount} repos</p>
      <div className="actions">
        {Object.values(ACTIONS).map((action, index) => (
          <Link
            key={`${action.route}-${index}`}
            to={action.route}
            className={`button actions__button ${
              activeAction === action ? "actions__button--active" : ""
            }`}
          >
            {action.label}
          </Link>
        ))}
      </div>
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
              image={repository.featuredImage}
              metaContent={<p>{repository.stargazersCount}</p>}
            />
          );
        })}
      </Grid>
      <br />
      <div style={{ display: "flex" }}>
        {!isFirstPage && (
          <Link to={`${activeAction.route}${prevPage}`}>Previous page</Link>
        )}
        <p>{currentPage}</p>
        {!isLastPage && (
          <Link to={`${activeAction.route}${nextPage}`}>Next page</Link>
        )}
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
          stargazersCount: PropTypes.number.isRequired,
          owner: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
          featuredImage: PropTypes.shape({
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
  query(
    $skip: Int!
    $limit: Int!
    $sortField: [RepositoryFieldsEnum]!
    $sortOrder: [SortOrderEnum]!
  ) {
    repositoriesData: allRepository(
      sort: { fields: $sortField, order: $sortOrder }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      repositories: nodes {
        name
        description
        stargazersCount: stargazers_count
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
      }
    }
  }
`;

export default RepositoriesPage;
