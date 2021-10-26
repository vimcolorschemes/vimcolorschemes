import React, { useMemo } from 'react';
import { graphql } from 'gatsby';

import URLHelper from '@/helpers/url';
import useSearch from '@/hooks/search';
import { APIRepository } from '@/models/api';
import { Action } from '@/lib/actions';
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
        description={`vimcolorschemes is the ultimate resource for vim users to find the perfect color scheme for their favorite development environment. Come for the hundreds of vim color schemes, stay for the awesome hjkl spatial navigation. Check out the ${actionFromURL.label} vim color schemes!`}
        pathname={location.pathname}
      />
      <header className="repositories__header">
        <Actions activeAction={actionFromURL} />
        <SearchInput value={search.input} onChange={search.setInput} />
      </header>
      <p className="repositories__search-indicator">
        <span>{search.totalCount} color schemes</span>
        {search.isSearching && <span> found</span>}
      </p>
      {search.isError && (
        <p className="repositories__search-indicator">Error searching...</p>
      )}
      <Grid>
        {search.repositories.map(repository => (
          <Card repository={repository} key={repository.key} />
        ))}
      </Grid>
      <Pagination
        activeAction={actionFromURL}
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
  ) {
    repositoriesData: allMongodbVimcolorschemesRepositories(
      filter: {
        updateValid: { eq: true }
        generateValid: { eq: true }
        vimColorSchemes: { elemMatch: { valid: { eq: true } } }
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
