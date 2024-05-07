import styles from './index.module.css';

type RepositoryNotFoundProps = {
  key: string;
};

export default function RepositoryNotFound({ key }: RepositoryNotFoundProps) {
  return (
    <main className={styles.container}>
      <p>
        <strong>404: </strong>
        repository <strong>{key}</strong> not found.
      </p>
    </main>
  );
}
