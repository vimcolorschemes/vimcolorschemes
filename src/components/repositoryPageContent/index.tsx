import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';
import TuiSection from '@/components/tuiSection';

import styles from './index.module.css';
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

  return (
    <div className={styles.layout}>
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
          hasOwnerLink
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
