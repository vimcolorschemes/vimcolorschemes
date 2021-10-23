import React from 'react';
import { graphql, Link } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import ExternalLink from '@/components/externalLink';
import Grid from '@/components/grid';
import IconArrow from '@/components/icons/arrow';
import IconGithub from '@/components/icons/github';
import Meta from '@/components/meta';
import Page from '@/components/page';
import Preview from '@/components/preview';
import Routes from '@/lib/routes';
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
        og={{ image: repository.previewImageRoute }}
      />
      <section className="repository__content">
        <nav className="repository__nav">
          <Link
            to={window.previousPath || Routes.Home}
            className="repository__link"
            data-focusable
          >
            <IconArrow left className="repository__link-icon" />
            <span>Back</span>
          </Link>
          <ExternalLink
            to={repository.githubURL}
            className="repository__link"
            data-focusable
          >
            <span>
              View <b>{repository.name}</b> on Github
            </span>
            <IconGithub className="repository__link-icon" />
          </ExternalLink>
        </nav>
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
