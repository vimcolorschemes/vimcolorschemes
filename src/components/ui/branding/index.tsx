import IconLogo from '@/components/ui/icons/logo';

import styles from './index.module.css';

export default function Branding() {
  return (
    <div className={styles.container}>
      <IconLogo className={styles.logo} />
      <span className={styles.name}>
        <span>vim</span>colorschemes
      </span>
    </div>
  );
}
