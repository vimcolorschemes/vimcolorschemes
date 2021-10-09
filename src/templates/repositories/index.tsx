import React from 'react';
import { graphql } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import Grid from '@/components/grid';
import Card from '@/components/card';

import './index.scss';

interface IProps {
  data: {
    repositoriesData: {
      apiRepositories: APIRepository[];
      totalCount: number;
    };
  };
}

function IndexPage({ data: { repositoriesData } }: IProps) {
  const repositories = repositoriesData.apiRepositories.map(
    apiRepository => new Repository(apiRepository),
  );

  const { totalCount } = repositoriesData;

  return (
    <main>
      <h1>vimcolorschemes</h1>
      <section>
        <header>
          <p>{totalCount} repositories</p>
        </header>
        <Grid>
          {repositories.map(repository => (
            <Card repository={repository} key={repository.key} />
          ))}
        </Grid>
      </section>
    </main>
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
