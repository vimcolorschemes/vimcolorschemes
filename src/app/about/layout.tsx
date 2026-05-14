import { ReactNode } from 'react';

import HomeCommand from '@/components/homeCommand';
import Header from '@/components/ui/header';

import styles from './layout.module.css';

type AboutPageLayoutProps = {
  children: ReactNode;
};

export default function AboutPageLayout({ children }: AboutPageLayoutProps) {
  return (
    <>
      <Header>
        <HomeCommand
          className={styles.command}
          command="man"
          aria-label="Go home"
          classNames={{
            command: styles.binary,
            operator: styles.operator,
            prompt: styles.prompt,
          }}
        >
          <span className={styles.argument}>vimcolorschemes</span>
        </HomeCommand>
      </Header>
      {children}
    </>
  );
}
