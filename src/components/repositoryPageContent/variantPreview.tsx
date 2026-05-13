'use client';

import cn from 'classnames';
import { useRef } from 'react';

import { Colorscheme } from '@/models/colorscheme';
import { ColorschemeDTO } from '@/models/DTO/colorscheme';

import {
  type ActiveVariantIndexChange,
  RepositoryPageHelper,
} from '@/helpers/repositoryPage';

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
  onActiveIndexChange: ActiveVariantIndexChange;
};

export default function RepositoryVariantPreview({
  colorschemes,
  activeIndex,
  onActiveIndexChange,
}: RepositoryVariantPreviewProps) {
  const variantListRef = useRef<HTMLDivElement>(null);
  const variants = colorschemes.map(
    colorscheme => new Colorscheme(colorscheme),
  );
  const activeVariant = variants[activeIndex];

  function selectVariant(index: number) {
    variantListRef.current
      ?.querySelector<HTMLButtonElement>(`[data-variant-index="${index}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    onActiveIndexChange(index);
  }

  useKeyboardShortcut({
    j: event => {
      if (variants.length === 0) {
        return;
      }
      event.preventDefault();
      selectVariant(
        RepositoryPageHelper.getNextVariantIndex(activeIndex, variants.length),
      );
    },
    k: event => {
      if (variants.length === 0) {
        return;
      }
      event.preventDefault();
      selectVariant(
        RepositoryPageHelper.getPreviousVariantIndex(
          activeIndex,
          variants.length,
        ),
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
        <div ref={variantListRef} className={styles.variantList}>
          {variants.map((colorscheme, index) => {
            const background = colorscheme.backgrounds[0];
            const title = `${colorscheme.name} ${background}`;

            return (
              <button
                key={`${colorscheme.name}-${background}-${index}`}
                type="button"
                className={cn(styles.variantButton, {
                  [styles.variantButtonActive]: index === activeIndex,
                })}
                onClick={() => selectVariant(index)}
                aria-pressed={index === activeIndex}
                data-variant-index={index}
                title={title}
                style={RepositoryPageHelper.getColorschemeStyle(colorscheme)}
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
                style={RepositoryPageHelper.getColorschemeStyle(activeVariant)}
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
