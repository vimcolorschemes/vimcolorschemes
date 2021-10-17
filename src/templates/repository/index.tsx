import React from 'react';
import { graphql } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import Meta from '@/components/meta';
import Page from '@/components/page';
import Preview from '@/components/preview';
import SEO from '@/components/seo';

interface Props {
  data: {
    apiRepository: APIRepository;
  };
  location: Location;
}

function RepositoryPage({ data: { apiRepository }, location }: Props) {
  const repository = new Repository(apiRepository);

  return (
    <Page>
      <SEO
        title={repository.title}
        description={repository.description}
        pathname={location.pathname}
      />
      <Meta repository={repository} isRepositoryPage />
      {repository.flattenedVimColorSchemes.map(vimColorScheme => (
        <Preview
          vimColorSchemes={[vimColorScheme]}
          key={`${vimColorScheme.name}-${vimColorScheme.defaultBackground}`}
        />
      ))}
    </Page>
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

export default RepositoryPage;
