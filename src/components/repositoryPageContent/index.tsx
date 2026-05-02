import { notFound } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

import ColorschemesGrid from '@/components/colorschemesGrid';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryPageHeader from '@/components/repositoryPageHeader';
import RepositoryTitle from '@/components/repositoryTitle';

import styles from './index.module.css';

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
    <>
      <RepositoryPageHeader repositoryKey={repository.key} />
      <RepositoryTitle
        repository={repository}
        hasOwnerLink
        classNames={{ container: styles.pageWidth }}
      />
      <RepositoryInfo repository={repository} className={styles.pageWidth} />
      <ColorschemesGrid colorschemes={repository.flattenedColorschemes} />
    </>
  );
}
