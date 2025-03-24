import styles from './not-found.module.css';

export default async function ArtistNotFound() {
  return (
    <p className={styles.container}>
      <strong>404: </strong>
      artist not found.
    </p>
  );
}
