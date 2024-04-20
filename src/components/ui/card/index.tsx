import { ReactNode } from 'react';

import styles from './index.module.css';

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return <article className={styles.container}>{children}</article>;
}
