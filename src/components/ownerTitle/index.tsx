import cn from 'classnames';
import Image from 'next/image';

import { Owner } from '@/models/owner';

import { TuiLoadingInline } from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type OwnerTitleProps = {
  owner?: Owner;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
};

export default function OwnerTitle({ owner, as, className }: OwnerTitleProps) {
  const Title = as ?? 'span';

  return (
    <div className={cn(styles.container, className)}>
      {!owner && <span className={styles.avatar} aria-hidden="true" />}
      {!!owner && (
        <Image
          src={`https://github.com/${owner.name}.png`}
          alt={owner.name}
          width={50}
          height={50}
          className={styles.avatar}
          unoptimized
        />
      )}
      <Title className={styles.title}>
        {owner?.name ?? <TuiLoadingInline />}
      </Title>
    </div>
  );
}
