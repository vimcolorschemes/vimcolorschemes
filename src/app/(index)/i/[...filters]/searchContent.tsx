import type { PageContext } from '@/lib/pageContext';

import repositoriesStyles from '@/components/repositories/index.module.css';
import RepositorySearch from '@/components/repositories/search';

type IndexPageSearchContentProps = {
  pageContext: PageContext;
  query: string;
};

export default function IndexPageSearchContent({
  pageContext,
  query,
}: IndexPageSearchContentProps) {
  return (
    <section
      className={repositoriesStyles.container}
      aria-labelledby="repositories-title"
    >
      <RepositorySearch pageContext={pageContext} query={query} />
    </section>
  );
}
