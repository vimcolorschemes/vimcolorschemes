import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { useNavigation } from "../../hooks/useNavigation";

import { ACTIONS, LAYOUTS, SECTIONS } from "../../constants";

import Actions from "../../components/actions";
import Card from "../../components/card";
import Grid from "../../components/grid";
import Layout from "../../components/layout";
import SEO from "../../components/seo";

import "./index.scss";

const RepositoriesPage = ({ data, pageContext, location }) => {
  const { totalCount, repositories } = data?.repositoriesData;

  const { currentPage } = pageContext;
  const prevPage = currentPage - 1 === 1 ? "" : (currentPage - 1).toString();
  const nextPage = (currentPage + 1).toString();
  const hasPreviousPageButton = currentPage > 1;
  const hasNextPageButton = currentPage < pageContext.pageCount;

  const currentPath = location.pathname || "";
  const activeAction =
    Object.values(ACTIONS).find(
      action =>
        currentPath.includes(action.route) && action !== ACTIONS.DEFAULT,
    ) || ACTIONS.DEFAULT;

  useNavigation(SECTIONS.REPOSITORIES);

  return (
    <Layout>
      <SEO title={`${activeAction.label} vim color schemes`} />
      <p>TIP: Use hjkl to navigate</p>
      <p>{totalCount} repos</p>
      <Actions actions={Object.values(ACTIONS)} activeAction={activeAction} />
      <Grid className="repositories">
        {repositories.map(repository => (
          <Card
            key={`repository-${repository.owner.name}-${repository.name}`}
            linkState={{ fromPath: currentPath }}
            repository={repository}
          />
        ))}
      </Grid>
      <div className="pagination">
        {hasPreviousPageButton && (
          <Link
            style={{ marginTop: "1rem" }}
            to={`${activeAction.route}${prevPage}`}
            data-section={SECTIONS.PAGINATION}
            data-layout={LAYOUTS.LIST}
            className="pagination__link"
          >
            Previous
          </Link>
        )}
        {hasNextPageButton && (
          <Link
            style={{ marginTop: "1rem" }}
            to={`${activeAction.route}${nextPage}`}
            data-section={SECTIONS.PAGINATION}
            data-layout={LAYOUTS.LIST}
            className="pagination__link"
          >
            Next
          </Link>
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
          lastCommitAt: PropTypes.string.isRequired,
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
