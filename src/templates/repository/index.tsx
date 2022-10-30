import React, { useMemo } from 'react';
import { graphql, Link } from 'gatsby';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import ExternalLink from '@/components/externalLink';
import IconArrow from '@/components/icons/arrow';
import IconGithub from '@/components/icons/github';
import Page from '@/components/page';
import Preview from '@/components/preview';
import Routes from '@/lib/routes';
import SEO from '@/components/seo';
import { MetaDescription, MetaFooter, MetaHeader } from '@/components/meta';

import './index.scss';

interface Props {
  data: {
    apiRepository: APIRepository;
  };
  location: Location;
}

function RepositoryPage({ data: { apiRepository }, location }: Props) {
  const repository = new Repository(apiRepository);

  const previousPath = useMemo(() => {
    if (typeof window === 'undefined') {
      return Routes.Home;
    }

    return window.previousPath || Routes.Home;
  }, [typeof window]);

  return (
    <Page className="repository">
      <SEO
        title={repository.title}
        description={repository.description}
        pathname={location.pathname}
        image={repository.previewImageRoute}
      />
      <section className="repository__content">
        <nav className="repository__nav">
          <Link to={previousPath} className="repository__link" data-focusable>
            <IconArrow left className="repository__link-icon" />
            <span>Back</span>
          </Link>
          <ExternalLink
            to={repository.githubURL}
            className="repository__link"
            data-focusable
          >
            <span>
              <span className="repository__link-extension">
                View <b>{repository.name}</b> on
              </span>
              {' Github'}
            </span>
            <IconGithub className="repository__link-icon" />
          </ExternalLink>
        </nav>
        <MetaHeader
          repository={repository}
          className="repository__meta"
          isRepositoryPage
        />
        <Preview
          vimColorSchemes={[repository.defaultVimColorScheme]}
          className="repository__preview"
        />
        <MetaDescription repository={repository} className="repository__meta" />
        <MetaFooter repository={repository} className="repository__meta" />
        {repository.flattenedVimColorSchemes.length > 1 && (
          <div className="repository__previews">
            <h3 className="repository__previews-title subtitle">
              <b>More from {repository.name}</b>
            </h3>
            {repository.flattenedVimColorSchemes
              .slice(1)
              .map(vimColorScheme => (
                <Preview
                  vimColorSchemes={[vimColorScheme]}
                  title={vimColorScheme.key}
                  className="repository__preview"
                  key={vimColorScheme.key}
                />
              ))}
          </div>
        )}
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
      isVim
      isLua
      owner {
        name
      }
      vimColorSchemes {
        name
        valid
        backgrounds
        isLua
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
