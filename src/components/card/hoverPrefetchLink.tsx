'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, type ComponentProps } from 'react';

type HoverPrefetchLinkProps = Pick<ComponentProps<typeof Link>, 'href'> & {
  label: string;
  className?: string;
  labelClassName?: string;
};

export default function HoverPrefetchLink({
  href,
  label,
  className,
  labelClassName,
}: HoverPrefetchLinkProps) {
  const router = useRouter();
  const hasPrefetched = useRef(false);

  function prefetch() {
    if (hasPrefetched.current || typeof href !== 'string') {
      return;
    }

    hasPrefetched.current = true;
    router.prefetch(href);
  }

  return (
    <Link
      href={href}
      prefetch={false}
      scroll={false}
      className={className}
      aria-label={label}
      onPointerEnter={prefetch}
      onFocus={prefetch}
    >
      <span className={labelClassName}>{label}</span>
    </Link>
  );
}
