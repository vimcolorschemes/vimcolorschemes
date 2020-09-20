import React, { useState, useEffect, useMemo } from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import * as JsSearch from "js-search";

import { RepositoryType } from "src/types";

import { ACTIONS, SECTIONS } from "src/constants";

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

const createSearchData = repositories => {
  const data = new JsSearch.Search("id");
  data.indexStrategy = new JsSearch.PrefixIndexStrategy();
  data.sanitizer = new JsSearch.LowerCaseSanitizer();
  data.searchIndex = new JsSearch.TfIdfSearchIndex("id");
  data.addIndex("name");
  data.addIndex(["owner", "name"]);
  data.addIndex("description");
  data.addDocuments(repositories);
  return data;
};

const RepositoriesPage = ({ data, pageContext, location }) => {
  const { totalCount, repositories } = data?.repositoriesData;
  const {
    siteMetadata: { platform },
  } = data?.site;
  const { currentPage, pageCount, skip, limit } = pageContext;

  const pageRepositories = useMemo(() => repositories.slice(skip, limit), [
    repositories,
    skip,
    limit,
  ]);
  const searchData = useMemo(() => createSearchData(repositories), [
    repositories,
  ]);

  const currentPath = location.pathname || "";
  const activeAction =
    Object.values(ACTIONS).find(
      action =>
        currentPath.includes(action.route) && action !== ACTIONS.TRENDING,
    ) || ACTIONS.TRENDING;

  const [searchInput, setSearchInput] = useState(null);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  const [filterData, setFilterData] = useState({
    searchInput: null,
    repositories: pageRepositories,
  });

  filterData.searchInput = useDebounce(searchInput, 200);

  const [resetNavigation, disableNavigation] = useNavigation(
    SECTIONS.REPOSITORIES,
  );

  useEffect(() => {
    if (filterData.searchInput)
      setFilterData(data => ({
        ...data,
        repositories: searchData.search(filterData.searchInput),
      }));
    else if (filterData.searchInput !== null)
      setFilterData(data => ({
        ...data,
        repositories: pageRepositories,
      }));
  }, [filterData.searchInput, searchData, pageRepositories]);

  useEffect(() => {
    if (
      !isSearchInputFocused &&
      filterData.searchInput !== null &&
      filterData.searchInput === searchInput
    )
      resetNavigation();
  }, [filterData, isSearchInputFocused, resetNavigation, searchInput]);

  return (
    <Layout isHome>
      <SEO title={`${activeAction.label} ${platform} color schemes`} />
      <Intro />
      <div className="action-row">
        <SearchInput
          value={searchInput || ""}
          onChange={event => setSearchInput(event.target.value)}
          onFocusChange={isFocused => {
            if (isFocused) disableNavigation();
            setIsSearchInputFocused(isFocused);
          }}
        />
        <Actions actions={Object.values(ACTIONS)} activeAction={activeAction} />
      </div>
      {!!filterData.searchInput ? (
        <p>
          <strong>{filterData.repositories.length}</strong> result
          {filterData.repositories.length !== 1 ? "s" : ""} for "
          {filterData.searchInput}"
        </p>
      ) : (
        <p>
          {skip + 1}
          {" - "}
          {limit} out of <strong>{totalCount}</strong> repositories
        </p>
      )}
      <Grid className="repositories">
        {filterData.repositories.map(repository => (
          <Card
            key={`repository-${repository.owner.name}-${repository.name}`}
            linkState={{ fromPath: currentPath }}
            repository={repository}
          />
        ))}
      </Grid>
      {!filterData.searchInput && (
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
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        platform: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
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
    $sortField: [mongodbColorschemesRepositoriesFieldsEnum]!
    $sortOrder: [SortOrderEnum]!
  ) {
    site {
      siteMetadata {
        platform
      }
    }
    repositoriesData: allMongodbColorschemesRepositories(
      filter: { valid: { eq: true }, image_urls: { ne: "" } }
      sort: { fields: $sortField, order: $sortOrder }
    ) {
      totalCount
      repositories: nodes {
        id
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
