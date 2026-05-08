'use client';

import { useIndexPending } from '@/components/providers/indexPendingProvider';

import ExploreCommand from './command';

export default function ExploreCommandInput() {
  const { pageContext, startPending } = useIndexPending();

  return (
    <ExploreCommand pageContext={pageContext} startPending={startPending} />
  );
}
