import styles from './not-found.module.css';

export default async function RepositoryNotFound() {
  return (
    <p className={styles.container}>
      <strong>404: </strong>
      repository not found.
    </p>
  );
}
