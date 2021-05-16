import React from 'react';
import { graphql } from 'gatsby';

import { Repository } from '@/models/repository';

interface IProps {
  data: {
    repositoriesData: {
      repositories: Repository[];
      totalCount: number;
    };
  };
}

function IndexPage({ data: { repositoriesData } }: IProps) {
  const { repositories, totalCount } = repositoriesData;
  console.log(repositories);
  console.log(totalCount);
  return (
    <main>
      <h1>Hello, world</h1>
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
      repositories: nodes {
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
