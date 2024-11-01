import cn from 'classnames';

import styles from './index.module.css';

type SkeletonProps = {
  inline?: boolean;
  className?: string;
};

export default function Skeleton({ inline, className }: SkeletonProps) {
  const Container = inline ? 'span' : 'div';
  return <Container className={cn(styles.container, className)} />;
}
