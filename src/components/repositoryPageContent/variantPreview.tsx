'use client';

import cn from 'classnames';
import { useRef } from 'react';

import { Colorscheme } from '@/models/colorscheme';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import Card, { cardCodePreviewClassName } from '@/components/card';
import { CodeSnippetLines } from '@/components/preview/codeSnippet';
import { ColorschemeConfigLines } from '@/components/preview/colorschemeConfig';
import TuiSection from '@/components/tuiSection';
import Code from '@/components/ui/code';
import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type RepositoryVariantPreviewProps = {
  activeIndex: number;
  onSelectVariant: (index: number) => void;
  variants: Colorscheme[];
};

export default function RepositoryVariantPreview({
  activeIndex,
  onSelectVariant,
  variants,
}: RepositoryVariantPreviewProps) {
  const variantListRef = useRef<HTMLDivElement>(null);
  const activeVariant = variants[activeIndex];
  const activeColorschemeStyle =
    RepositoryPageHelper.getColorschemeStyle(activeVariant);

  function scrollVariantIntoView(index: number) {
    variantListRef.current
      ?.querySelector<HTMLButtonElement>(`[data-variant-index="${index}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function selectVariant(index: number) {
    scrollVariantIntoView(index);

    onSelectVariant(index);
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
        style={RepositoryPageHelper.getColorschemeStyle(variants[0])}
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
                ref={
                  index === activeIndex
                    ? button => {
                        button?.scrollIntoView({
                          block: 'nearest',
                          inline: 'nearest',
                        });
                      }
                    : undefined
                }
                aria-pressed={index === activeIndex}
                data-variant-index={index}
                title={title}
              >
                <span
                  className={styles.variantSwatch}
                  style={RepositoryPageHelper.getColorschemeStyle(colorscheme)}
                  aria-hidden="true"
                />
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
        style={activeColorschemeStyle}
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
                style={activeColorschemeStyle}
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
