import { Editor } from '@/lib/editors';

import styles from './index.module.css';

type WindowHeaderProps = {
  title: string;
  editor: Editor;
};

export default function WindowHeader({ title, editor }: WindowHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.buttons} />
      <div className={styles.title}>{title}</div>
      <div className={styles.editor}>{editor}</div>
    </div>
  );
}
