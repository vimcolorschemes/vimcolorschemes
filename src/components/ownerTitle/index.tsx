import cn from 'classnames';
import Image from 'next/image';

import Owner from '@/models/owner';

import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

type OwnerTitleProps = {
  owner?: Owner;
  className?: string;
};

export default function OwnerTitle({ owner, className }: OwnerTitleProps) {
  return (
    <div className={cn(styles.container, className)}>
      {!owner && <Skeleton className={styles.avatar} />}
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
      <h1 className={styles.title}>{owner?.name ?? <Skeleton />}</h1>
    </div>
  );
}
