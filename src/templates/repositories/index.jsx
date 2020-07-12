import React, { useEffect, useMemo } from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { ACTIONS } from "../../constants/actions";
import { URLify } from "../../utils/string";
import { getRepositoryInfos } from "../../utils/repository";

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

  const actionTabIndexes = Object.keys(ACTIONS).map((_, index) => index + 2);
  const repositoryTabIndexes = useMemo(
    () => repositories.map((_, index) => actionTabIndexes.length + index + 2),
    [actionTabIndexes.length, repositories],
  );
  const paginationTabIndexes = useMemo(
    () =>
      [hasPreviousPageButton, hasNextPageButton].reduce((acc, value) => {
        if (value)
          return [
            ...acc,
            actionTabIndexes.length +
              repositoryTabIndexes.length +
              acc.length +
              2,
          ];
        return acc;
      }, []),
    [
      actionTabIndexes.length,
      repositoryTabIndexes.length,
      hasPreviousPageButton,
      hasNextPageButton,
    ],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const eventListener = event =>
        handleKeyPress(
          event,
          actionTabIndexes,
          repositoryTabIndexes,
          paginationTabIndexes,
          repositories.length,
        );

      window.addEventListener("keydown", eventListener);
      return () => window.removeEventListener("keydown", eventListener);
    }
  }, [
    repositories.length,
    actionTabIndexes,
    repositoryTabIndexes,
    paginationTabIndexes,
  ]);

  return (
    <Layout>
      <SEO title={`${activeAction.label} vim color schemes`} />
      <p>{totalCount} repos</p>
      <ul className="actions">
        {Object.values(ACTIONS).map((action, index) => (
          <li key={`${action.route}-${index}`}>
            <Link
              tabIndex={actionTabIndexes[index]}
              id={`tabindex-${actionTabIndexes[index]}`}
              to={action.route}
              className={`actions__button ${
                activeAction === action ? "actions__button--active" : ""
              }`}
            >
              {action.label}
            </Link>
          </li>
        ))}
      </ul>
      <Grid className="repositories">
        {repositories.map((repository, index) => {
          const {
            ownerName,
            name,
            description,
            featuredImage,
          } = getRepositoryInfos(repository);
          const repositoryKey = `${ownerName}/${name}`;
          return (
            <Card
              key={`repository-${repositoryKey}`}
              linkId={`tabindex-${repositoryTabIndexes[index]}`}
              linkTabIndex={repositoryTabIndexes[index]}
              linkTo={`/${URLify(repositoryKey)}`}
              linkState={{ fromPath: currentPath }}
              ownerName={ownerName}
              name={name}
              description={description}
              image={featuredImage}
            />
          );
        })}
      </Grid>
      <div>
        {hasPreviousPageButton && (
          <Link
            style={{ marginTop: "1rem" }}
            to={`${activeAction.route}${prevPage}`}
            tabIndex={paginationTabIndexes[0]}
            id={`tabindex-${paginationTabIndexes[0]}`}
          >
            Previous
          </Link>
        )}
        {hasNextPageButton && (
          <Link
            style={{ marginTop: "1rem" }}
            to={`${activeAction.route}${nextPage}`}
            tabIndex={paginationTabIndexes[hasPreviousPageButton ? 1 : 0]}
            id={`tabindex-${
              paginationTabIndexes[hasPreviousPageButton ? 1 : 0]
            }`}
          >
            Next
          </Link>
        )}
      </div>
    </Layout>
  );
};

const Key = {
  top: "g",
  bottom: "G",
  left: "h",
  down: "j",
  up: "k",
  right: "l",
};

const handleKeyPress = (
  event,
  actionTabIndexes,
  repositoryTabIndexes,
  paginationTabIndexes,
  repositoryCount,
) => {
  const { key } = event;
  if (!Object.values(Key).includes(key)) return;
  const { activeElement } = document;
  let newTabIndex = 0;
  if (activeElement.tabIndex === -1) newTabIndex = repositoryTabIndexes[0];
  else {
    const onRepositories = repositoryTabIndexes.includes(
      activeElement.tabIndex,
    );
    switch (key) {
      case Key.top:
        newTabIndex = repositoryTabIndexes[0];
        break;
      case Key.bottom:
        newTabIndex = repositoryTabIndexes[repositoryTabIndexes.length - 1];
        break;
      case Key.down:
        const repositoryCountIsEven = repositoryCount % 2 === 0;
        const onActions = actionTabIndexes.includes(activeElement.tabIndex);
        const onLastRepositoryLine = repositoryTabIndexes
          .filter(
            (_, index) =>
              index >=
              repositoryTabIndexes.length - (repositoryCountIsEven ? 2 : 1),
          )
          .includes(activeElement.tabIndex);
        if (onActions) newTabIndex = repositoryTabIndexes[0];
        else if (onLastRepositoryLine)
          newTabIndex = paginationTabIndexes[paginationTabIndexes.length - 1];
        else if (onRepositories)
          newTabIndex = Math.min(
            repositoryTabIndexes[repositoryTabIndexes.length - 1],
            activeElement.tabIndex + 2,
          );
        else newTabIndex = activeElement.tabIndex + 1;
        break;
      case Key.up:
        const onFirstRepositoryLine = repositoryTabIndexes
          .slice(0, 2)
          .includes(activeElement.tabIndex);
        const onPagination = paginationTabIndexes.includes(
          activeElement.tabIndex,
        );
        if (onFirstRepositoryLine) newTabIndex = actionTabIndexes[0];
        else if (onPagination)
          newTabIndex = repositoryTabIndexes[repositoryTabIndexes.length - 1];
        else if (onRepositories) newTabIndex = activeElement.tabIndex - 2;
        else newTabIndex = activeElement.tabIndex - 1;
        break;
      case Key.left:
        newTabIndex = activeElement.tabIndex - 1;
        break;
      case Key.right:
        newTabIndex = activeElement.tabIndex + 1;
        break;
      default:
        break;
    }
  }
  const element = document.getElementById(`tabindex-${newTabIndex}`);
  if (element) element.focus();
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
