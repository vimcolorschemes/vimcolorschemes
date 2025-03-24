import Image from 'next/image';

import Owner from '@/models/owner';

import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

type OwnerTitleProps = {
  owner?: Owner;
};

export default function OwnerTitle({ owner }: OwnerTitleProps) {
  return (
    <div className={styles.container}>
      {!owner && <Skeleton className={styles.avatar} />}
      {!!owner && (
        <Image
          src={`https://github.com/${owner.name}.png`}
          alt={owner.name}
          width={50}
          height={50}
          unoptimized
          className={styles.avatar}
        />
      )}
      <h1 className={styles.title}>{owner?.name ?? <Skeleton />}</h1>
    </div>
  );
}
