import React from 'react';
import { graphql, Link } from 'gatsby';

import { RepositoryGraphqlNode, Repository } from '@/models/repository';

import './index.scss';

interface IProps {
  data: {
    repositoriesData: {
      nodes: RepositoryGraphqlNode[];
      totalCount: number;
    };
  };
}

function IndexPage({ data: { repositoriesData } }: IProps) {
  const repositories = repositoriesData.nodes.map(node => new Repository(node));
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
            <Link to={repository.route} key={repository.key}>
              {repository.key}
            </Link>
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
      nodes {
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
