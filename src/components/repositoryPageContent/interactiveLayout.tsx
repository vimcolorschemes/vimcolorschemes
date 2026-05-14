'use client';

import { ReactNode, useState } from 'react';

import { Colorscheme } from '@/models/colorscheme';
import { ColorschemeDTO } from '@/models/DTO/colorscheme';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import styles from './index.module.css';
import RepositoryPageThemeScope from './themeScope';
import RepositoryVariantPreview from './variantPreview';

type RepositoryPageInteractiveLayoutProps = {
  children: ReactNode;
  colorschemes: ColorschemeDTO[];
};

export default function RepositoryPageInteractiveLayout({
  children,
  colorschemes,
}: RepositoryPageInteractiveLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const variants = colorschemes.map(
    colorscheme => new Colorscheme(colorscheme),
  );
  const firstColorschemeStyle = RepositoryPageHelper.getColorschemeStyle(
    variants[0],
  );
  const activeColorschemeStyle = RepositoryPageHelper.getColorschemeStyle(
    variants[activeIndex],
  );

  return (
    <div className={styles.layout} style={activeColorschemeStyle}>
      <RepositoryPageThemeScope style={firstColorschemeStyle} />
      <RepositoryVariantPreview
        variants={variants}
        activeIndex={activeIndex}
        onSelectVariant={setActiveIndex}
      />
      {children}
    </div>
  );
}
