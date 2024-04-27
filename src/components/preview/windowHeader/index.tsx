import styles from './index.module.css';

type WindowHeaderProps = {
  title: string;
  engines: string[];
};

export default function WindowHeader({ title, engines }: WindowHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.buttons} />
      <div className={styles.title}>{title}</div>
      <div className={styles.engine}>{engines.join('/')}</div>
    </div>
  );
}
