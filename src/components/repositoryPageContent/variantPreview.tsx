'use client';

import cn from 'classnames';
import { CSSProperties } from 'react';

import { Colorscheme } from '@/models/colorscheme';
import { ColorschemeDTO } from '@/models/DTO/colorscheme';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import Card, { cardCodePreviewClassName } from '@/components/card';
import { CodeSnippetLines } from '@/components/preview/codeSnippet';
import { ColorschemeConfigLines } from '@/components/preview/colorschemeConfig';
import TuiSection from '@/components/tuiSection';
import Code from '@/components/ui/code';
import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type RepositoryVariantPreviewProps = {
  colorschemes: ColorschemeDTO[];
  activeIndex: number;
  onActiveIndexChange: (index: number | ((index: number) => number)) => void;
};

export default function RepositoryVariantPreview({
  colorschemes,
  activeIndex,
  onActiveIndexChange,
}: RepositoryVariantPreviewProps) {
  const variants = colorschemes.map(
    colorscheme => new Colorscheme(colorscheme),
  );
  const activeVariant = variants[activeIndex];

  useKeyboardShortcut({
    j: event => {
      if (variants.length === 0) {
        return;
      }
      event.preventDefault();
      onActiveIndexChange(index => (index + 1) % variants.length);
    },
    k: event => {
      if (variants.length === 0) {
        return;
      }
      event.preventDefault();
      onActiveIndexChange(
        index => (index - 1 + variants.length) % variants.length,
      );
    },
  });

  if (!activeVariant) {
    return (
      <div className={styles.previewEmpty}>
        <TuiLoading />
      </div>
    );
  }

  return (
    <>
      <TuiSection
        as="aside"
        className={styles.variantPane}
        aria-label="Colorscheme variants"
      >
        <div className={styles.variantList}>
          {variants.map((colorscheme, index) => {
            const background = colorscheme.backgrounds[0];
            const title = `${colorscheme.name} ${background}`;

            return (
              <button
                key={`${colorscheme.name}-${background}`}
                type="button"
                className={cn(styles.variantButton, {
                  [styles.variantButtonActive]: index === activeIndex,
                })}
                onClick={() => onActiveIndexChange(index)}
                aria-pressed={index === activeIndex}
                title={title}
                style={getColorschemeStyle(colorscheme)}
              >
                <span className={styles.variantSwatch} aria-hidden="true" />
                <span className={styles.variantName}>{colorscheme.name}</span>
                <span className={styles.variantBackground}>{background}</span>
              </button>
            );
          })}
        </div>
      </TuiSection>
      <section
        className={styles.previewPane}
        aria-label="Selected colorscheme preview"
      >
        <Card.Root framed className={styles.previewCard}>
          <Card.Content>
            <Card.Preview flush>
              <Code
                fileName={activeVariant.name}
                lineCount={15}
                activeLine={9}
                data-background={activeVariant.backgrounds[0]}
                className={cn(cardCodePreviewClassName, styles.codePreview)}
                style={getColorschemeStyle(activeVariant)}
              >
                <ColorschemeConfigLines
                  colorscheme={activeVariant}
                  background={activeVariant.backgrounds[0]}
                />
                <div />
                <CodeSnippetLines />
              </Code>
            </Card.Preview>
          </Card.Content>
        </Card.Root>
      </section>
    </>
  );
}

function getColorschemeStyle(
  colorscheme: Colorscheme,
): CSSProperties | undefined {
  const background = colorscheme.backgrounds[0];
  return colorscheme.data[background]?.reduce(
    (acc, group) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  ) as CSSProperties | undefined;
}
