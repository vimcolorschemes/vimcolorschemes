import { Metadata } from 'next';
import Link from 'next/link';

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
            <Link href={repository.route}>
              <p>{repository.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
