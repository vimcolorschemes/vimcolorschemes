import React, { useMemo } from 'react';
import { graphql } from 'gatsby';
import classnames from 'classnames';

import { APIRepository } from '@/models/api';
import { Repository } from '@/models/repository';

import Preview from '@/components/preview';

import './index.scss';

// Space in % between 2 previews when there are multiple vim color schemes
const PREVIEW_SPACING = 10;

interface Props {
  data: {
    apiRepository: APIRepository;
  };
}

function PreviewPage({ data: { apiRepository } }: Props) {
  const repository = new Repository(apiRepository);

  const vimColorSchemes = useMemo(
    () => repository.flattenedVimColorSchemes,
    [repository],
  );

  const previewStartingPosition = useMemo(() => {
    const count = Math.min(vimColorSchemes.length - 1, 3);
    return 50 - (PREVIEW_SPACING / 2) * count;
  }, [vimColorSchemes.length]);

  return (
    <div
      className={classnames('preview-page', {
        'preview-page--gallery': vimColorSchemes.length > 1,
      })}
    >
      {repository.flattenedVimColorSchemes.map((vimColorScheme, index) => {
        const offset = index * PREVIEW_SPACING;
        const position = `${previewStartingPosition + offset}%`;
        const top = position;
        const left = position;

        const zIndex = -index;

        return (
          <div
            className="preview-page__preview-container"
            style={{
              top,
              left,
              zIndex,
            }}
            key={vimColorScheme.key}
          >
            <Preview
              vimColorSchemes={[vimColorScheme]}
              className="preview-page__preview"
            />
          </div>
        );
      })}
    </div>
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
        backgrounds
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
