import React, { useState, useEffect, useMemo } from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";

import { RepositoryType } from "src/types";

import { ACTIONS, SECTIONS, REPOSITORY_COUNT_PER_PAGE } from "src/constants";

import { isSearchIndexUp, searchRepositoryIndex } from "src/elasticsearch/api";

import { useNavigation } from "src/hooks/useNavigation";
import { useDebounce } from "src/hooks/useDebounce";

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
  const { totalCount, repositories } = data?.repositoriesData;
  const { currentPage, pageCount } = pageContext;

  const currentPath = location.pathname || "";
  const activeAction =
    Object.values(ACTIONS).find(
      action =>
        currentPath.includes(action.route) && action !== ACTIONS.TRENDING,
    ) || ACTIONS.TRENDING;

  const [useSearch, setUseSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearchInput = useDebounce(searchInput, 200);

  const [resetNavigation] = useNavigation(SECTIONS.REPOSITORIES);

  useEffect(() => {
    const fetchIsSearchIndexUp = async () =>
      setUseSearch(await isSearchIndexUp());

    fetchIsSearchIndexUp();
  }, []);

  useEffect(() => {
    const searchRepositories = async () => {
      const repositories = debouncedSearchInput
        ? await searchRepositoryIndex(debouncedSearchInput)
        : [];
      setSearchResults(repositories);
    };

    searchRepositories();
  }, [debouncedSearchInput]);

  const test = useMemo(
    () => (debouncedSearchInput ? searchResults : repositories),
    [debouncedSearchInput, searchResults, repositories],
  );

  useEffect(() => resetNavigation(), [test]);

  const startIndex = (currentPage - 1) * REPOSITORY_COUNT_PER_PAGE + 1;
  const endIndex =
    currentPage === pageCount
      ? totalCount
      : currentPage * REPOSITORY_COUNT_PER_PAGE;

  return (
    <Layout isHome>
      <SEO
        title={`${activeAction.label} vim color schemes`}
        descriptionSuffix={`Check out the ${activeAction.label} vim color schemes!`}
      />
      <Intro />
      <div className="action-row">
        {useSearch && (
          <SearchInput
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
          />
        )}
        <Actions actions={Object.values(ACTIONS)} activeAction={activeAction} />
      </div>
      {!!debouncedSearchInput ? (
        <p>
          <strong>{searchResults.length}</strong> result
          {searchResults.length !== 1 ? "s" : ""} for "{debouncedSearchInput}"
        </p>
      ) : (
        <p>
          {startIndex}
          {" - "}
          {endIndex} out of <strong>{totalCount}</strong> repositories
        </p>
      )}
      <Grid className="repositories">
        {test.map(repository => (
          <Card
            key={`repository-${repository.owner?.name}-${repository.name}`}
            linkState={{ fromPath: currentPath }}
            repository={repository}
          />
        ))}
      </Grid>
      {!debouncedSearchInput && (
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          activeActionRoute={activeAction.route}
        />
      )}
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
    $sortField: [mongodbColorschemesRepositoriesFieldsEnum]!
    $sortOrder: [SortOrderEnum]!
  ) {
    repositoriesData: allMongodbColorschemesRepositories(
      filter: { valid: { eq: true }, image_urls: { ne: "" } }
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
