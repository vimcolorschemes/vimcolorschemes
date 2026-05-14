import { ReactNode } from 'react';

import styles from './index.module.css';

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return <header className={styles.container}>{children}</header>;
}
