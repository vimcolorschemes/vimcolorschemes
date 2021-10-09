import React from 'react';
import { graphql } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import Preview from '@/components/preview';

interface IProps {
  data: {
    apiRepository: APIRepository;
  };
}

function RepositoryPage({ data: { apiRepository } }: IProps) {
  const repository = new Repository(apiRepository);

  return (
    <div>
      {repository.key}
      {repository.flattenedVimColorSchemes.map(vimColorScheme => (
        <Preview
          vimColorSchemes={[vimColorScheme]}
          key={`${vimColorScheme.name}-${vimColorScheme.defaultBackground}`}
        />
      ))}
    </div>
  );
}

export const query = graphql`
  query($ownerName: String!, $name: String!) {
    apiRepository: mongodbVimcolorschemesRepositories(
      owner: { name: { eq: $ownerName } }
      name: { eq: $name }
    ) {
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
`;

export default RepositoryPage;
