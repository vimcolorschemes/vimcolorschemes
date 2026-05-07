'use client';

import { useIndexPending } from '@/components/providers/indexPendingProvider';

import ExploreCommand from './command';

export default function ExploreCommandInput() {
  const { pageContext } = useIndexPending();

  return <ExploreCommand pageContext={pageContext} />;
}
