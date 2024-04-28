import { Engine } from '@/lib/engines';

import styles from './index.module.css';

type WindowHeaderProps = {
  title: string;
  engine: Engine;
};

export default function WindowHeader({ title, engine }: WindowHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.buttons} />
      <div className={styles.title}>{title}</div>
      <div className={styles.engine}>{engine}</div>
    </div>
  );
}
