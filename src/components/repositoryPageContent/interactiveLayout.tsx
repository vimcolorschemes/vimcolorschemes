'use client';

import { ReactNode, useState } from 'react';

import { Colorscheme } from '@/models/colorscheme';
import { ColorschemeDTO } from '@/models/DTO/colorscheme';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import styles from './index.module.css';
import RepositoryVariantPreview from './variantPreview';

type RepositoryPageInteractiveLayoutProps = {
  children: ReactNode;
  colorschemes: ColorschemeDTO[];
  initialVariantIndex?: number;
};

export default function RepositoryPageInteractiveLayout({
  children,
  colorschemes,
  initialVariantIndex = 0,
}: RepositoryPageInteractiveLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(initialVariantIndex);
  const variants = colorschemes.map(
    colorscheme => new Colorscheme(colorscheme),
  );
  const activeColorschemeStyle = RepositoryPageHelper.getColorschemeStyle(
    variants[activeIndex],
  );

  return (
    <div className={styles.layout} style={activeColorschemeStyle}>
      <RepositoryVariantPreview
        variants={variants}
        activeIndex={activeIndex}
        onSelectVariant={setActiveIndex}
      />
      {children}
    </div>
  );
}
