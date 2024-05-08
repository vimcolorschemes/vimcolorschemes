import Header from '@/components/ui/header';

import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <p>
          <strong>404: </strong>
          page not found.
        </p>
      </main>
    </>
  );
}
