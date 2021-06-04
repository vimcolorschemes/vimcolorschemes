import React from 'react';
import { graphql } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models';

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
      <h1>Hello, world</h1>
      <section>
        <header>
          <p>{totalCount} repositories</p>
        </header>
        <div className="repositories">
          {repositories.map(repository => (
            <Card key={repository.key} repository={repository} />
          ))}
        </div>
      </section>
    </main>
  );
}

export const query = graphql`
  query {
    repositoriesData: allMongodbVimcolorschemesRepositories(
      filter: { valid: { eq: true } }
      limit: 20
      skip: 0
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
