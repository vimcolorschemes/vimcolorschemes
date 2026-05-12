import { notFound } from 'next/navigation';
import { CSSProperties } from 'react';

import { RepositoriesService } from '@/services/repositoriesServer';

import { Colorscheme } from '@/models/colorscheme';

import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';
import TuiSection from '@/components/tuiSection';

import styles from './index.module.css';
import RepositoryPageThemeScope from './themeScope';
import RepositoryVariantPreview from './variantPreview';

type RepositoryPageContentProps = {
  owner: string;
  name: string;
};

export default async function RepositoryPageContent({
  owner,
  name,
}: RepositoryPageContentProps) {
  const repository = await RepositoriesService.getRepository(owner, name);

  if (!repository) {
    notFound();
  }

  const firstVariant = repository.flattenedColorschemes[0];
  const colorschemeStyle = getColorschemeStyle(firstVariant);

  return (
    <div className={styles.layout} style={colorschemeStyle}>
      <RepositoryPageThemeScope style={colorschemeStyle} />
      <RepositoryVariantPreview
        colorschemes={repository.flattenedColorschemes.map(
          colorscheme => colorscheme.dto,
        )}
      />
      <TuiSection
        as="aside"
        className={styles.infoPane}
        aria-label="Repository information"
      >
        <RepositoryTitle
          repository={repository}
          ownerPrefix="@"
          showStats={false}
        />
        <RepositoryInfo repository={repository} />
        <a
          href={repository.githubURL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          view on Github
        </a>
        <dl className={styles.repoFacts}>
          <div>
            <dt>colorschemes</dt>
            <dd>{repository.colorschemes.length}</dd>
          </div>
          <div>
            <dt>variants</dt>
            <dd>{repository.flattenedColorschemes.length}</dd>
          </div>
          <div>
            <dt>stars</dt>
            <dd>{repository.stargazersCount}</dd>
          </div>
          {repository.weekStargazersCount > 0 && (
            <div>
              <dt>trending</dt>
              <dd>{repository.weekStargazersCount}/week</dd>
            </div>
          )}
        </dl>
      </TuiSection>
    </div>
  );
}

function getColorschemeStyle(
  colorscheme: Colorscheme | undefined,
): CSSProperties | undefined {
  const background = colorscheme?.backgrounds[0];

  if (!colorscheme || !background) {
    return undefined;
  }

  return colorscheme.data[background]?.reduce<CSSProperties>(
    (acc, group) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  );
}
