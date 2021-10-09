import React, { useMemo } from 'react';
import { Link, graphql } from 'gatsby';
import classnames from 'classnames';

import { APIRepository } from '@/models/api';
import { Action, Actions } from '@/models/action';
import { RepositoriesPageContext, Repository } from '@/models/repository';

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
  const repositories = repositoriesData.apiRepositories.map(
    apiRepository => new Repository(apiRepository),
  );

  const { totalCount } = repositoriesData;

  const { currentPage, pageCount } = pageContext;

  const activeAction: Action = useMemo(
    () =>
      Object.values(Actions).find(
        action =>
          action !== Actions.Trending &&
          location.pathname.includes(action.route),
      ) || Actions.Trending,
    [location.pathname],
  );

  return (
    <Page className="repositories">
      <header className="repositories__header">
        <div className="repositories__actions">
          {Object.values(Actions).map(action => (
            <Link
              key={action.route}
              to={action.route}
              className={classnames('repositories__action', {
                ['repositories__action--active']:
                  activeAction.route === action.route,
              })}
            >
              {action.label}
            </Link>
          ))}
        </div>
        <p>{totalCount} repositories</p>
      </header>
      <Grid>
        {repositories.map(repository => (
          <Card repository={repository} key={repository.key} />
        ))}
      </Grid>
      <Pagination
        activeAction={activeAction}
        currentPage={currentPage}
        pageCount={pageCount}
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
