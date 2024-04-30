import cn from 'classnames';
import { ReactNode } from 'react';

import styles from './index.module.css';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <article className={cn(styles.container, className)}>{children}</article>
  );
}
