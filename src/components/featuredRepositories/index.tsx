import Link from 'next/link';

import { RepositoriesService } from '@/services/repositoriesServer';

import FeaturedRepositoryCard from '@/components/featuredRepositoryCard';

import styles from './index.module.css';

export default async function FeaturedRepositories() {
  const repositories = await RepositoriesService.getFeaturedRepositoryDTOs();

  if (!repositories.length) {
    return null;
  }

  return (
    <section className={styles.container} aria-labelledby="featured-title">
      <div className={styles.header}>
        <h2 id="featured-title" className={styles.title}>
          Featured
        </h2>
        <p className={styles.note}>
          Hand-picked colorschemes worth a look.{' '}
          <Link href="/about#get-featured" className={styles.link}>
            Get yours featured.
          </Link>
        </p>
      </div>
      <div className={styles.list}>
        {repositories.map(repositoryDTO => (
          <FeaturedRepositoryCard
            key={`${repositoryDTO.owner.name}/${repositoryDTO.name}`}
            repositoryDTO={repositoryDTO}
          />
        ))}
      </div>
    </section>
  );
}
