import cn from 'classnames';
import { CSSProperties, ReactNode } from 'react';

import styles from './index.module.css';

type WindowProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function Window({
  title,
  subtitle,
  children,
  className,
  style,
}: WindowProps) {
  return (
    <div className={cn(styles.container, className)} style={style}>
      <div className={styles.topBar}>
        <div className={styles.buttons} />
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
