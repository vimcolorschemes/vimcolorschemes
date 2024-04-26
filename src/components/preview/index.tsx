import Repository from '@/models/repository';

import ColorschemeConfig from './colorschemeConfig';
import styles from './index.module.css';
import WindowHeader from './windowHeader';

type PreviewProps = {
  repository: Repository;
};

export default function Preview({ repository }: PreviewProps) {
  return (
    <div className={styles.container}>
      <WindowHeader
        title={repository.colorschemes[0].name}
        engines={repository.engines}
      />
      <ColorschemeConfig colorscheme={repository.colorschemes[0]} />
    </div>
  );
}
