'use client';

import { useState } from 'react';

import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';
import TuiSection from '@/components/tuiSection';

import styles from './index.module.css';
import RepositoryPageThemeScope from './themeScope';
import RepositoryVariantPreview from './variantPreview';

type RepositoryPageContentClientProps = {
  repositoryDTO: RepositoryDTO;
};

export default function RepositoryPageContentClient({
  repositoryDTO,
}: RepositoryPageContentClientProps) {
  const repository = new Repository(repositoryDTO);
  const variants = repository.flattenedColorschemes;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVariant = variants[activeIndex];
  const colorschemeStyle =
    RepositoryPageHelper.getColorschemeStyle(activeVariant);
  const swatchColors = RepositoryPageHelper.getSwatchColors(activeVariant);

  return (
    <div className={styles.layout} style={colorschemeStyle}>
      <RepositoryPageThemeScope style={colorschemeStyle} />
      <RepositoryVariantPreview
        colorschemes={variants.map(colorscheme => colorscheme.dto)}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
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
        {swatchColors.length > 0 && (
          <div className={styles.colorSwatch} aria-label="Colorscheme colors">
            {swatchColors.map(color => (
              <span
                key={color}
                className={styles.colorSwatchItem}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </TuiSection>
    </div>
  );
}
