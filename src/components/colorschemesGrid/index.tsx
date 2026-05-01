import { CSSProperties } from 'react';

import { Colorscheme } from '@/models/colorscheme';

import Card, { cardCodePreviewClassName } from '@/components/card';
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
    <Card.Root framed>
      <Card.Content>
        <Card.Preview flush>
          <Code
            fileName={colorscheme.name}
            lineCount={15}
            activeLine={9}
            hideStatusLine
            className={cardCodePreviewClassName}
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
        <Card.Footer aria-label={title} title={title}>
          <Card.FooterTitle>{colorscheme.name}</Card.FooterTitle>
          <Card.FooterMeta>{background}</Card.FooterMeta>
        </Card.Footer>
      </Card.Content>
    </Card.Root>
  );
}
