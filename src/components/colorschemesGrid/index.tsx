import Colorscheme from '@/models/colorscheme';

import Preview from '@/components/preview';

import styles from './index.module.css';

type ColorschemesGridProps = {
  colorschemes: Colorscheme[];
};

export default function ColorschemesGrid({
  colorschemes,
}: ColorschemesGridProps) {
  return (
    <div className={styles.container}>
      {colorschemes.map((colorscheme, index) => (
        <Preview
          key={index}
          colorscheme={colorscheme}
          background={colorscheme.backgrounds[0]}
        />
      ))}
    </div>
  );
}
