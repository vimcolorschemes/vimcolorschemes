import React from 'react';
import { graphql } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import Grid from '@/components/grid';
import Meta from '@/components/meta';
import Page from '@/components/page';
import Preview from '@/components/preview';
import SEO from '@/components/seo';

import './index.scss';

interface Props {
  data: {
    apiRepository: APIRepository;
  };
  location: Location;
}

function RepositoryPage({ data: { apiRepository }, location }: Props) {
  const repository = new Repository(apiRepository);

  return (
    <Page className="repository">
      <SEO
        title={repository.title}
        description={repository.description}
        pathname={location.pathname}
      />
      <section className="repository__content">
        <Meta repository={repository} isRepositoryPage />
        <Grid>
          {repository.flattenedVimColorSchemes.map(vimColorScheme => (
            <Preview
              vimColorSchemes={[vimColorScheme]}
              key={`${vimColorScheme.name}-${vimColorScheme.defaultBackground}`}
            />
          ))}
        </Grid>
      </section>
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
