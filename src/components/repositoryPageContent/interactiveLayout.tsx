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

  function selectVariant(index: number) {
    const params = new URLSearchParams(window.location.search);
    const variant = variants[index];

    setActiveIndex(index);

    if (index === 0 || !variant) {
      params.delete('colorscheme');
      params.delete('background');
    } else {
      params.set('colorscheme', variant.name);
      params.set('background', variant.backgrounds[0]);
    }

    const query = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
    );
  }

  return (
    <div className={styles.layout} style={activeColorschemeStyle}>
      <RepositoryVariantPreview
        variants={variants}
        activeIndex={activeIndex}
        onSelectVariant={selectVariant}
      />
      {children}
    </div>
  );
}
