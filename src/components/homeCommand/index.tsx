import cn from 'classnames';
import Link from 'next/link';
import { ReactNode, type ComponentProps } from 'react';

import styles from './index.module.css';

type HomeCommandProps = {
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
  classNames?: {
    command?: string;
    operator?: string;
    prompt?: string;
  };
  command?: string;
  href?: ComponentProps<typeof Link>['href'];
  interactive?: boolean;
};

export default function HomeCommand({
  ariaLabel,
  children,
  className,
  classNames,
  command = 'vimcolorschemes',
  href = '/i/trending',
  interactive = true,
}: HomeCommandProps) {
  const content = (
    <>
      <span className={cn(styles.prompt, classNames?.prompt)}>~</span>
      <span className={cn(styles.operator, classNames?.operator)}>❯</span>
      <span className={cn(styles.command, classNames?.command)}>{command}</span>
      {children}
    </>
  );
  const commandClassName = cn(styles.homeCommand, className);

  if (!interactive) {
    return <span className={commandClassName}>{content}</span>;
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={commandClassName}
      aria-label={ariaLabel}
    >
      {content}
    </Link>
  );
}
