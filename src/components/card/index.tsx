import cn from 'classnames';
import Link from 'next/link';
import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import HoverPrefetchLink from './hoverPrefetchLink';
import styles from './index.module.css';

type RootProps = ComponentPropsWithoutRef<'article'> & {
  framed?: boolean;
  interactive?: boolean;
  skeleton?: boolean;
};

function Root({
  className,
  framed,
  interactive,
  skeleton,
  ...props
}: RootProps) {
  return (
    <article
      className={cn(
        styles.container,
        framed && styles.framed,
        interactive && styles.interactive,
        skeleton && styles.skeleton,
        className,
      )}
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
    <HoverPrefetchLink
      href={href}
      className={cn(styles.link, className)}
      label={label}
      labelClassName={styles.linkLabel}
    />
  );
}

type ContentProps = ComponentPropsWithoutRef<'div'>;

function Content({ className, ...props }: ContentProps) {
  return <div className={cn(styles.content, className)} {...props} />;
}

type PreviewProps = {
  children: ReactElement<{ className?: string }>;
  className?: string;
  flush?: boolean;
  interactiveControls?: boolean;
};

function Preview({
  children,
  className,
  flush,
  interactiveControls,
}: PreviewProps) {
  if (!isValidElement(children)) {
    return children;
  }

  return cloneElement(children, {
    className: cn(
      styles.preview,
      flush && styles.previewFlush,
      interactiveControls && styles.previewInteractiveControls,
      children.props.className,
      className,
    ),
  });
}

type BodyProps = ComponentPropsWithoutRef<'div'>;

function Body({ className, ...props }: BodyProps) {
  return <div className={cn(styles.body, className)} {...props} />;
}

type FooterProps = ComponentPropsWithoutRef<'footer'>;

function Footer({ className, ...props }: FooterProps) {
  return <footer className={cn(styles.footer, className)} {...props} />;
}

type FooterIdentityProps = ComponentPropsWithoutRef<'div'>;

function FooterIdentity({ className, ...props }: FooterIdentityProps) {
  return <div className={cn(styles.footerIdentity, className)} {...props} />;
}

type FooterTitleProps = ComponentPropsWithoutRef<'h2'> & {
  as?: 'h2' | 'h3';
};

function FooterTitle({
  as: Component = 'h2',
  className,
  ...props
}: FooterTitleProps) {
  return <Component className={cn(styles.footerTitle, className)} {...props} />;
}

type FooterMetaProps = ComponentPropsWithoutRef<'span'>;

function FooterMeta({ className, ...props }: FooterMetaProps) {
  return <span className={cn(styles.footerMeta, className)} {...props} />;
}

type FooterStatsProps = ComponentPropsWithoutRef<'dl'>;

function FooterStats({ className, ...props }: FooterStatsProps) {
  return <dl className={cn(styles.footerStats, className)} {...props} />;
}

type FooterStatProps = ComponentPropsWithoutRef<'div'> & {
  label: string;
  children: ReactNode;
};

function FooterStat({ className, label, children, ...props }: FooterStatProps) {
  return (
    <div className={cn(styles.footerStat, className)} {...props}>
      <dt className={styles.footerStatLabel}>{label}</dt>
      <dd className={styles.footerStatValue}>{children}</dd>
    </div>
  );
}

const Card = {
  Root,
  Link: CardLink,
  Content,
  Preview,
  Body,
  Footer,
  FooterIdentity,
  FooterTitle,
  FooterMeta,
  FooterStats,
  FooterStat,
};

export const cardCodePreviewClassName = styles.codePreview;

export default Card;
