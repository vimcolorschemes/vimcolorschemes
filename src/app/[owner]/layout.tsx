import RepositoryCommand from '@/components/repositoryCommand';
import Header from '@/components/ui/header';

import styles from './layout.module.css';

export default function ArtistPageLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <Header showBranding={false}>
        <RepositoryCommand />
      </Header>
      <main className={styles.container}>{children}</main>
    </>
  );
}
