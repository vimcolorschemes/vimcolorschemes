import PageContext from '@/lib/pageContext';

import BackgroundInput from '@/components/backgroundInput';
import EditorInput from '@/components/editorInput';
import SearchInput from '@/components/searchInput';
import SortInput from '@/components/sortInput';

import styles from './index.module.css';

type FiltersProps = {
  pageContext: PageContext;
};

export default function Filters({ pageContext }: FiltersProps) {
  return (
    <div className={styles.container}>
      <SearchInput />
      <SortInput pageContext={pageContext} />
      <BackgroundInput />
      <EditorInput />
    </div>
  );
}
