import { Metadata } from 'next';

import RepositoriesService from '@/services/repositories';

import styles from './page.module.css';

export const metadata: Metadata = { title: 'Home | vimcolorschemes' };

export default async function Home() {
  const repositories = await RepositoriesService.getRepositories();

  return (
    <main className={styles.container}>
      <ul>
        {repositories.map(repository => (
          <li key={repository.key}>
            <p>{repository.title}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
