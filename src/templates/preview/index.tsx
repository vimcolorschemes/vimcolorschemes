import React from 'react';
import { graphql } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import Preview from '@/components/preview';

import './index.scss';

interface Props {
  data: {
    apiRepository: APIRepository;
  };
}

function PreviewPage({ data: { apiRepository } }: Props) {
  const repository = new Repository(apiRepository);
  return (
    <Preview
      vimColorSchemes={[repository.defaultVimColorScheme]}
      className="preview-page"
    />
  );
}

export const query = graphql`
  query ($ownerName: String!, $name: String!) {
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

export default PreviewPage;
