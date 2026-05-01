import { CSSProperties } from 'react';

import { Colorscheme } from '@/models/colorscheme';

import Card from '@/components/card';
import { CodeSnippetLines } from '@/components/preview/codeSnippet';
import { ColorschemeConfigLines } from '@/components/preview/colorschemeConfig';
import Code from '@/components/ui/code';

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
        <ColorschemeCard key={index} colorscheme={colorscheme} />
      ))}
    </div>
  );
}

type ColorschemeCardProps = {
  colorscheme: Colorscheme;
};

function ColorschemeCard({ colorscheme }: ColorschemeCardProps) {
  const background = colorscheme.backgrounds[0];
  const style = colorscheme.data[background]?.reduce(
    (acc, group) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  ) as CSSProperties | undefined;
  const title = `${colorscheme.name} ${background}`;

  return (
    <Card.Root className={styles.card}>
      <Card.Content className={styles.content}>
        <Card.Preview className={styles.previewFrame}>
          <Code
            fileName={colorscheme.name}
            lineCount={15}
            activeLine={9}
            hideStatusLine
            className={styles.preview}
            style={style}
          >
            <ColorschemeConfigLines
              colorscheme={colorscheme}
              background={background}
            />
            <div />
            <CodeSnippetLines />
          </Code>
        </Card.Preview>
        <footer className={styles.footer} aria-label={title} title={title}>
          <h2 className={styles.name}>{colorscheme.name}</h2>
          <span className={styles.background}>{background}</span>
        </footer>
      </Card.Content>
    </Card.Root>
  );
}
