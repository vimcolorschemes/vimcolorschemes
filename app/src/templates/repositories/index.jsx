import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { ACTIONS } from "../../constants/actions";
import { URLify } from "../../utils/string";
import { getRepositoryInfos } from "../../utils/repository";

import Card from "../../components/card";
import Grid from "../../components/grid";
import Layout from "../../components/layout";
import Pagination from "../../components/pagination";
import SEO from "../../components/seo";

import "./index.scss";

const RepositoriesPage = ({ data, pageContext, location }) => {
  const { totalCount, repositories } = data?.repositoriesData;

  const { currentPage, pageCount } = pageContext;

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
            className={`actions__button ${
              activeAction === action ? "actions__button--active" : ""
            }`}
          >
            {action.label}
          </Link>
        ))}
      </div>
      <Grid>
        {repositories.map(repository => {
          const {
            ownerName,
            name,
            description,
            featuredImage,
            stargazersCount,
            createdAt,
            latestCommitAt,
          } = getRepositoryInfos(repository);
          const repositoryKey = `${ownerName}/${name}`;
          return (
            <Card
              key={`repository__${repositoryKey}`}
              linkTo={`/${URLify(repositoryKey)}`}
              linkState={{ pageNumber: currentPage }}
              ownerName={ownerName}
              name={name}
              description={description}
              image={featuredImage}
              metaContent={
                <div>
                  <p>{stargazersCount}</p>
                  <p>created at: {createdAt}</p>
                  <p>latest commit at: {latestCommitAt}</p>
                </div>
              }
            />
          );
        })}
      </Grid>
      <br />
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        activeActionRoute={activeAction.route}
      />
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
          latestCommitAt: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
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
        latestCommitAt: latest_commit_at
        createdAt: created_at
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
