import React, { useMemo } from 'react';
import { graphql, navigate } from 'gatsby';

import Routes from '@/lib/routes';
import URLHelper from '@/helpers/url';
import useSearch from '@/hooks/search';
import { APIRepository } from '@/models/api';
import { Action } from '@/lib/actions';
import { Background } from '@/lib/background';
import { RepositoriesPageContext } from '@/models/repository';

import Actions from '@/components/actions';
import Card from '@/components/card';
import Grid from '@/components/grid';
import Page from '@/components/page';
import Pagination from '@/components/pagination';
import SEO from '@/components/seo';
import SearchInput from '@/components/searchInput';

import './index.scss';

interface Props {
  data: {
    repositoriesData: {
      apiRepositories: APIRepository[];
      totalCount: number;
    };
  };
  location: Location;
  pageContext: RepositoriesPageContext;
}

function IndexPage({
  data: { repositoriesData },
  pageContext,
  location,
}: Props) {
  const search = useSearch({
    defaultRepositoriesData: repositoriesData,
    defaultPageData: pageContext,
  });

  const actionFromURL: Action = useMemo(
    () => URLHelper.getActionFromURL(location.pathname),
    [location.pathname],
  );

  const isLightFilterChecked = useMemo(
    () => pageContext.filters.includes(Background.Light),
    [pageContext.filters],
  );

  const isDarkFilterChecked = useMemo(
    () => pageContext.filters.includes(Background.Dark),
    [pageContext.filters],
  );

  function onChangeFilters(
    isLightFilterChecked: boolean,
    isDarkFilterChecked: boolean,
  ) {
    let nextRoute = '';

    if (isLightFilterChecked && !isDarkFilterChecked) {
      nextRoute = Routes.Light;
    }

    if (!isLightFilterChecked && isDarkFilterChecked) {
      nextRoute = Routes.Dark;
    }

    navigate(nextRoute + actionFromURL.route);
  }

  return (
    <Page
      className="repositories"
      isHome
      onHomeLinkClick={() => {
        search.setInput('');
        search.setPage(1);
      }}
    >
      <SEO
        title={`${actionFromURL.label} vim color schemes`}
        description={`Check out the ${actionFromURL.label} vim color schemes!`}
        pathname={location.pathname}
      />
      <header className="repositories__header">
        <Actions
          activeAction={actionFromURL}
          activeFilters={pageContext.filters}
        />
        <SearchInput value={search.input} onChange={search.setInput} />
      </header>
      <fieldset>
        <label>
          <span>light</span>
          <input
            type="checkbox"
            name="background"
            value="light"
            checked={isLightFilterChecked}
            onChange={() =>
              onChangeFilters(!isLightFilterChecked, isDarkFilterChecked)
            }
            disabled={isLightFilterChecked && !isDarkFilterChecked}
          />
        </label>
        <label>
          <span>dark</span>
          <input
            type="checkbox"
            name="background"
            value="dark"
            checked={isDarkFilterChecked}
            onChange={() =>
              onChangeFilters(isLightFilterChecked, !isDarkFilterChecked)
            }
            disabled={!isLightFilterChecked && isDarkFilterChecked}
          />
        </label>
      </fieldset>
      <p className="repositories__search-indicator">
        <span>{search.isLoading ? '_' : search.totalCount} color schemes</span>
        {search.isSearching && <span> found</span>}
      </p>
      {search.isError && (
        <p className="repositories__search-indicator">Error searching...</p>
      )}
      {search.isLoading && (
        <p className="repositories__search-indicator">Loading...</p>
      )}
      <Grid>
        {search.repositories.map(repository => (
          <Card
            key={repository.key}
            repository={repository}
            activeFilters={pageContext.filters}
          />
        ))}
      </Grid>
      <Pagination
        activeAction={actionFromURL}
        activeFilters={pageContext.filters}
        currentPage={search.page}
        onChange={!!search.input ? search.setPage : undefined}
        pageCount={search.pageCount}
      />
    </Page>
  );
}

export const query = graphql`
  query RepositoriesQuery(
    $sortProperty: [mongodbVimcolorschemesRepositoriesFieldsEnum]!
    $sortOrder: [SortOrderEnum]!
    $skip: Int!
    $limit: Int!
    $filters: [String] = ["dark", "light"]
  ) {
    repositoriesData: allMongodbVimcolorschemesRepositories(
      filter: {
        updateValid: { eq: true }
        generateValid: { eq: true }
        vimColorSchemes: {
          elemMatch: { valid: { eq: true }, backgrounds: { in: $filters } }
        }
      }
      sort: { fields: $sortProperty, order: $sortOrder }
      skip: $skip
      limit: $limit
    ) {
      totalCount
      apiRepositories: nodes {
        name
        description
        stargazersCount
        githubCreatedAt
        lastCommitAt
        githubURL
        weekStargazersCount
        owner {
          name
        }
        vimColorSchemes {
          name
          valid
          backgrounds
          data {
            light {
              name
              hexCode
            }
            dark {
              name
              hexCode
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
