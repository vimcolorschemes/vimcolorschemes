import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Home | vimcolorschemes' };

export default function Home() {
  return <main className={styles.container}>Home</main>;
}
