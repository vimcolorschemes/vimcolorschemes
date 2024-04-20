import cn from 'classnames';
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

import styles from './index.module.css';

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
} & LinkProps;

export default function ButtonLink(props: ButtonLinkProps) {
  return (
    <Link {...props} className={cn(styles.container, props.className)}>
      {props.children}
    </Link>
  );
}
