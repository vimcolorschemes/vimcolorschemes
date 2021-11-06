import React, { useMemo } from 'react';
import { graphql } from 'gatsby';

import URLHelper from '@/helpers/url';
import useSearch from '@/hooks/search';
import { APIRepository } from '@/models/api';
import { Action } from '@/lib/actions';
import { RepositoriesPageContext } from '@/models/repository';

import Actions from '@/components/actions';
import Card from '@/components/card';
import Filters from '@/components/filters';
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
        <div className="repositories__header-row">
          <SearchInput value={search.input} onChange={search.setInput} />
          <Actions
            activeAction={actionFromURL}
            activeFilters={pageContext.filters}
          />
        </div>
        <div className="repositories__header-row repositories__header-row--align-end">
          <Filters
            activeFilters={pageContext.filters}
            activeAction={actionFromURL}
          />
        </div>
      </header>
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
          <Card key={repository.key} repository={repository} />
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
