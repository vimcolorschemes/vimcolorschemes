import cn from 'classnames';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type TuiSectionProps = ComponentPropsWithoutRef<'section'> & {
  as?: 'section' | 'aside' | 'footer';
  isLoading?: boolean;
  title?: ReactNode;
  titleClassName?: string;
};

export default function TuiSection({
  as: Component = 'section',
  children,
  className,
  isLoading,
  title,
  titleClassName,
  'aria-busy': ariaBusy,
  ...props
}: TuiSectionProps) {
  return (
    <Component
      className={cn(styles.container, className)}
      aria-busy={isLoading ? true : ariaBusy}
      {...props}
    >
      {title && <div className={cn(styles.title, titleClassName)}>{title}</div>}
      {isLoading ? <TuiLoading flush /> : children}
    </Component>
  );
}
