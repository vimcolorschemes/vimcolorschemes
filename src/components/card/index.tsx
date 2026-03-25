import cn from 'classnames';
import Link from 'next/link';
import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react';

import styles from './index.module.css';

type RootProps = ComponentPropsWithoutRef<'article'> & {
  skeleton?: boolean;
};

function Root({ className, skeleton, ...props }: RootProps) {
  return (
    <article
      className={cn(styles.container, skeleton && styles.skeleton, className)}
      {...props}
    />
  );
}

type LinkProps = Pick<ComponentProps<typeof Link>, 'href'> & {
  label: string;
  className?: string;
};

function CardLink({ href, label, className }: LinkProps) {
  return (
    <Link href={href} className={cn(styles.link, className)} aria-label={label}>
      <span className={styles.linkLabel}>{label}</span>
    </Link>
  );
}

type ContentProps = ComponentPropsWithoutRef<'div'>;

function Content({ className, ...props }: ContentProps) {
  return <div className={cn(styles.content, className)} {...props} />;
}

type PreviewProps = {
  children: ReactElement<{ className?: string }>;
  className?: string;
};

function Preview({ children, className }: PreviewProps) {
  if (!isValidElement(children)) {
    return children;
  }

  return cloneElement(children, {
    className: cn(styles.preview, children.props.className, className),
  });
}

type BodyProps = ComponentPropsWithoutRef<'div'>;

function Body({ className, ...props }: BodyProps) {
  return <div className={cn(styles.body, className)} {...props} />;
}

const Card = {
  Root,
  Link: CardLink,
  Content,
  Preview,
  Body,
};

export const cardTitleClassName = styles.title;

export default Card;
