'use client';

import { useState } from 'react';

import Colorscheme, { ColorschemeGroup } from '@/models/colorscheme';
import RepositoryDTO from '@/models/DTO/repository';
import Repository from '@/models/repository';

import { Background } from '@/lib/backgrounds';

import ColorschemeConfig from './colorschemeConfig';
import styles from './index.module.css';
import WindowHeader from './windowHeader';

type PreviewProps = {
  repositoryDTO: RepositoryDTO;
};

export default function Preview({ repositoryDTO }: PreviewProps) {
  const repository = new Repository(repositoryDTO);
  const defaultColorscheme = repository.colorschemes[0];
  const defaultBackground = defaultColorscheme.backgrounds[0];

  const [colorscheme, setColorscheme] = useState(defaultColorscheme);
  const [background, setBackground] = useState(defaultBackground);

  const style = colorscheme.data[background]?.reduce(
    (acc, group: ColorschemeGroup) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  );

  return (
    <div className={styles.container} style={style}>
      <WindowHeader title={colorscheme.name} engines={repository.engines} />
      <ColorschemeConfig
        repository={repository}
        colorscheme={colorscheme}
        background={background}
        onColorschemeChange={setColorscheme}
        onBackgroundChange={setBackground}
      />
    </div>
  );
}
