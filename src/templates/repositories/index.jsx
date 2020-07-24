import React, { useEffect } from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import {
  getDownIndex,
  getUpIndex,
  getFirstTabIndexOfSection,
} from "../../utils/tabIndex";

import { ACTIONS } from "../../constants/actions";
import { KEYS } from "../../constants/keys";
import { SECTIONS } from "../../constants/sections";

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

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const focusables = document.querySelectorAll("*[data-section]");

      const eventListener = event =>
        Object.values(KEYS).includes(event.key) &&
        handleKeyPress(event.key, focusables);

      window.addEventListener("keydown", eventListener);
      return () => window.removeEventListener("keydown", eventListener);
    }
  }, []);

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
      <div>
        {hasPreviousPageButton && (
          <Link
            style={{ marginTop: "1rem" }}
            to={`${activeAction.route}${prevPage}`}
            data-section={SECTIONS.PAGINATION}
          >
            Previous
          </Link>
        )}
        {hasNextPageButton && (
          <Link
            style={{ marginTop: "1rem" }}
            to={`${activeAction.route}${nextPage}`}
            data-section={SECTIONS.PAGINATION}
          >
            Next
          </Link>
        )}
      </div>
    </Layout>
  );
};

const handleKeyPress = (key, focusables) => {
  const { activeElement } = document;

  const currentTabIndex = Array.prototype.indexOf.call(
    focusables,
    activeElement,
  );

  if (currentTabIndex === -1) {
    focus(
      focusables,
      getFirstTabIndexOfSection(focusables, SECTIONS.REPOSITORIES),
    );
    return;
  }

  let nextTabIndex;

  switch (key) {
    case KEYS.UP:
      nextTabIndex = getUpIndex(
        currentTabIndex,
        activeElement.dataset.section,
        focusables,
      );
      break;
    case KEYS.DOWN:
      nextTabIndex = getDownIndex(
        currentTabIndex,
        activeElement.dataset.section,
        focusables,
      );
      break;
    case KEYS.LEFT:
      nextTabIndex = currentTabIndex - 1;
      break;
    case KEYS.RIGHT:
      nextTabIndex = currentTabIndex + 1;
      break;
    default:
      break;
  }

  if (nextTabIndex == null) return;

  focus(focusables, nextTabIndex);
};

const focus = (focusables, index) => {
  const nextElement = focusables[index];
  nextElement && nextElement.focus();
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
