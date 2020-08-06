import React from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";

import { RepositoryType } from "../../types";

import { ACTIONS, SECTIONS } from "../../constants";

import { useNavigation } from "../../hooks/useNavigation";

import Actions from "../../components/actions";
import Card from "../../components/card";
import Grid from "../../components/grid";
import Intro from "../../components/intro";
import Layout from "../../components/layout";
import SEO from "../../components/seo";
import Pagination from "../../components/pagination";

import "./index.scss";

const REPOSITORY_COUNT_PER_PAGE = 20;

const RepositoriesPage = ({ data, pageContext, location }) => {
  const { totalCount, repositories } = data?.repositoriesData;
  const { currentPage, pageCount } = pageContext;

  const currentPath = location.pathname || "";
  const activeAction =
    Object.values(ACTIONS).find(
      action =>
        currentPath.includes(action.route) && action !== ACTIONS.DEFAULT,
    ) || ACTIONS.DEFAULT;

  useNavigation(SECTIONS.REPOSITORIES);

  const startIndex = (currentPage - 1) * REPOSITORY_COUNT_PER_PAGE + 1;
  const endIndex =
    currentPage === pageCount
      ? totalCount
      : currentPage * REPOSITORY_COUNT_PER_PAGE;

  return (
    <Layout isHome>
      <SEO title={`${activeAction.label} vim color schemes`} />
      <Intro />
      <Actions actions={Object.values(ACTIONS)} activeAction={activeAction} />
      <p>
        {startIndex}
        {" - "}
        {endIndex} out of <strong>{totalCount}</strong> repositories
      </p>
      <Grid className="repositories">
        {repositories.map(repository => (
          <Card
            key={`repository-${repository.owner.name}-${repository.name}`}
            linkState={{ fromPath: currentPath }}
            repository={repository}
          />
        ))}
      </Grid>
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
      repositories: PropTypes.arrayOf(RepositoryType).isRequired,
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
    $sortField: [mongodbVimcsRepositoriesFieldsEnum]!
    $sortOrder: [SortOrderEnum]!
  ) {
    repositoriesData: allMongodbVimcsRepositories(
      filter: { blacklisted: { ne: true } }
      sort: { fields: $sortField, order: $sortOrder }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      repositories: nodes {
        name
        description
        stargazersCount: stargazers_count
        lastCommitAt: last_commit_at
        createdAt: github_created_at
        githubUrl: github_url
        owner {
          name
        }
        featuredImage: processed_featured_image {
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
