import cn from 'classnames';

import Colorscheme from '@/models/colorscheme';

import { Background } from '@/lib/backgrounds';

import Window from '@/components/ui/window';

import CodeSnippet from './codeSnippet';
import ColorschemeConfig from './colorschemeConfig';
import styles from './index.module.css';

type PreviewProps = {
  colorscheme: Colorscheme;
  background: Background;
  onToggleColorscheme?: () => void;
  onToggleBackground?: () => void;
  className?: string;
  compact?: boolean;
  disableCodeHorizontalScroll?: boolean;
};

export default function Preview({
  colorscheme,
  background,
  onToggleColorscheme,
  onToggleBackground,
  className,
  compact,
  disableCodeHorizontalScroll,
}: PreviewProps) {
  const style = colorscheme.data[background]?.reduce(
    (acc, group) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  );

  return (
    <Window
      title={colorscheme.name}
      subtitle="neovim"
      className={cn(styles.container, compact && styles.compact, className)}
      style={style}
    >
      {!compact && (
        <ColorschemeConfig
          colorscheme={colorscheme}
          background={background}
          onToggleColorscheme={onToggleColorscheme}
          onToggleBackground={onToggleBackground}
        />
      )}
      <CodeSnippet
        className={compact ? styles.compactCode : undefined}
        disableHorizontalScroll={disableCodeHorizontalScroll}
      />
    </Window>
  );
}
