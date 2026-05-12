import cn from 'classnames';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

import styles from './index.module.css';

type TuiSectionProps = ComponentPropsWithoutRef<'section'> & {
  as?: 'section' | 'aside';
  title?: ReactNode;
  titleClassName?: string;
};

export default function TuiSection({
  as: Component = 'section',
  children,
  className,
  title,
  titleClassName,
  ...props
}: TuiSectionProps) {
  return (
    <Component className={cn(styles.container, className)} {...props}>
      {title && <div className={cn(styles.title, titleClassName)}>{title}</div>}
      {children}
    </Component>
  );
}
