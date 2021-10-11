import React, { useMemo } from 'react';
import { graphql } from 'gatsby';

import useSearch from '@/hooks/search';
import { APIRepository } from '@/models/api';
import { Action, Actions as ActionsEnum } from '@/lib/actions';
import { RepositoriesPageContext } from '@/models/repository';

import Actions from '@/components/actions';
import Card from '@/components/card';
import Grid from '@/components/grid';
import Page from '@/components/page';
import Pagination from '@/components/pagination';

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
  const search = useSearch(repositoriesData);

  const activeAction: Action = useMemo(
    () =>
      Object.values(ActionsEnum).find(
        action =>
          action !== ActionsEnum.Trending &&
          location.pathname.includes(action.route),
      ) || ActionsEnum.Trending,
    [location.pathname],
  );

  return (
    <Page className="repositories">
      <header className="repositories__header">
        <Actions activeAction={activeAction} />
        <input
          type="search"
          value={search.input}
          onChange={event => search.setInput(event.target.value)}
        />
        <p>{search.totalCount} repositories</p>
      </header>
      <Grid>
        {search.repositories.map(repository => (
          <Card repository={repository} key={repository.key} />
        ))}
      </Grid>
      <Pagination
        activeAction={activeAction}
        currentPage={pageContext.currentPage}
        pageCount={pageContext.pageCount}
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
      filter: { updateValid: { eq: true }, generateValid: { eq: true } }
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
