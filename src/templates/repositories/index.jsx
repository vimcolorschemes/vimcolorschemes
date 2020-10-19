import React, { useEffect } from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";

import { RepositoryType } from "src/types";

import { ACTIONS, SECTIONS } from "src/constants";

import { useNavigation } from "src/hooks/useNavigation";
import { useSearchRepositories } from "src/hooks/useSearchRepositories";

import Actions from "src/components/actions";
import Card from "src/components/card";
import Grid from "src/components/grid";
import Intro from "src/components/intro";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import Pagination from "src/components/pagination";
import SearchInput from "../../components/searchInput";

import "./index.scss";

const RepositoriesPage = ({ data, pageContext, location }) => {
  const {
    repositories: defaultRepositories,
    totalCount: defaultTotalCount,
  } = data?.repositoriesData;
  const { currentPage: defaultPage, pageCount: defaultPageCount } = pageContext;

  const currentPath = location.pathname || "";
  const activeAction =
    Object.values(ACTIONS).find(
      action =>
        currentPath.includes(action.route) && action !== ACTIONS.TRENDING,
    ) || ACTIONS.TRENDING;

  const [resetNavigation] = useNavigation(SECTIONS.REPOSITORIES);

  const {
    searchInput,
    debouncedSearchInput,
    setSearchInput,
    storeSearchData,
    page,
    setPage,
    pageCount,
    startIndex,
    endIndex,
    repositories,
    totalCount,
    isLoading,
    isError,
  } = useSearchRepositories(
    defaultRepositories,
    defaultTotalCount,
    defaultPage,
    defaultPageCount,
  );

  useEffect(() => resetNavigation(), [repositories, resetNavigation]);

  return (
    <Layout
      isHome
      onLogoClick={() => {
        setSearchInput("");
        setPage(1);
      }}
    >
      <SEO
        title={`${
          debouncedSearchInput ? "Search" : activeAction.label
        } vim color schemes`}
        descriptionSuffix={`Check out the ${activeAction.label} vim color schemes!`}
      />
      <Intro />
      <div className="action-row">
        <SearchInput
          value={searchInput}
          onChange={value => setSearchInput(value)}
        />
        {!debouncedSearchInput && (
          <Actions
            actions={Object.values(ACTIONS)}
            activeAction={activeAction}
          />
        )}
      </div>
      {isLoading && <p>loading ...</p>}
      {isError && <p>An error occured while searching repositories</p>}
      {!isLoading && !isError && (
        <>
          {!!debouncedSearchInput ? (
            <p>
              {startIndex}
              {" - "}
              {endIndex} of <strong>{totalCount}</strong> result
              {totalCount !== 1 ? "s" : ""} for "{debouncedSearchInput}"
            </p>
          ) : (
            <p>
              {startIndex}
              {" - "}
              {endIndex} of <strong>{totalCount}</strong> repositor
              {totalCount !== 1 ? "ies" : "y"}
            </p>
          )}
          <Grid className="repositories">
            {repositories.map(repository => (
              <Card
                key={`repository-${repository.owner?.name}-${repository.name}`}
                linkState={{
                  fromPath: currentPath,
                }}
                onLinkClick={() => storeSearchData()}
                repository={repository}
              />
            ))}
          </Grid>
          <Pagination
            page={page}
            pageCount={pageCount}
            activeActionRoute={
              !debouncedSearchInput ? activeAction.route : undefined
            }
            onChange={
              !!debouncedSearchInput
                ? page => {
                    if (document.activeElement) document.activeElement.blur();
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    setPage(page);
                  }
                : undefined
            }
          />
        </>
      )}
    </Layout>
  );
};

RepositoriesPage.propTypes = {
  data: PropTypes.shape({
    repositoriesData: PropTypes.shape({
      repositories: PropTypes.arrayOf(RepositoryType).isRequired,
      totalCount: PropTypes.number.isRequired,
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
    $sortField: [mongodbColorschemesRepositoriesFieldsEnum]!
    $sortOrder: [SortOrderEnum]!
  ) {
    repositoriesData: allMongodbColorschemesRepositories(
      filter: {
        valid: { eq: true }
        archived: { ne: true }
        image_urls: { ne: "" }
      }
      sort: { fields: $sortField, order: $sortOrder }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      repositories: nodes {
        name
        description
        stargazersCount: stargazers_count
        createdAt: github_created_at
        lastCommitAt: last_commit_at
        githubUrl: github_url
        weekStargazersCount: week_stargazers_count
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
        images: processed_images {
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
