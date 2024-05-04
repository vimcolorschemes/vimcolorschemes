import BackgroundInput from '@/components/backgroundInput';
import EditorInput from '@/components/editorInput';
import SearchInput from '@/components/searchInput';

import styles from './index.module.css';

export default function Filters() {
  return (
    <div className={styles.container}>
      <SearchInput />
      <BackgroundInput />
      <EditorInput />
    </div>
  );
}
