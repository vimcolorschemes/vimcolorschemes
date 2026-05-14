import { Repository } from '@/models/repository';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';
import TuiSection from '@/components/tuiSection';

import styles from './index.module.css';
import RepositoryPageInteractiveLayout from './interactiveLayout';

type RepositoryPageContentProps = {
  repository: Repository;
  initialVariantIndex?: number;
};

export default function RepositoryPageContent({
  repository,
  initialVariantIndex = 0,
}: RepositoryPageContentProps) {
  const variants = repository.flattenedColorschemes;
  const firstVariant = variants[0];
  const swatchColors = RepositoryPageHelper.getSwatchColors(firstVariant);

  return (
    <RepositoryPageInteractiveLayout
      colorschemes={variants.map(colorscheme => colorscheme.dto)}
      initialVariantIndex={initialVariantIndex}
    >
      <TuiSection
        as="aside"
        className={styles.infoPane}
        aria-label="Repository information"
      >
        <RepositoryTitle repository={repository} ownerPrefix="@" />
        <RepositoryInfo repository={repository} />
        <a
          href={repository.githubURL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          view on GitHub
        </a>
        <dl className={styles.repoFacts}>
          <div>
            <dt>colorschemes</dt>
            <dd>{repository.colorschemes.length}</dd>
          </div>
          <div>
            <dt>variants</dt>
            <dd>{variants.length}</dd>
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
    </RepositoryPageInteractiveLayout>
  );
}
