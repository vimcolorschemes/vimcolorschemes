import clsx from 'clsx';

import CodeSnippet from '#/components/preview/CodeSnippet';
import ColorschemeConfig from '#/components/preview/ColorschemeConfig';
import Window from '#/components/preview/ui/Window';
import type { Background } from '#/lib/backgrounds';
import type Colorscheme from '#/models/colorscheme';

import styles from '#/components/preview/Preview.module.css';

type PreviewProps = {
  colorscheme: Colorscheme;
  background: Background;
  className?: string;
  onToggleColorscheme?: () => void;
  onToggleBackground?: () => void;
};

export default function Preview({
  colorscheme,
  background,
  className,
  onToggleColorscheme,
  onToggleBackground,
}: PreviewProps) {
  const style = colorscheme.data[background]?.reduce<Record<string, string>>(
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
      className={clsx(styles.container, className)}
      style={style}
    >
      <ColorschemeConfig
        colorscheme={colorscheme}
        background={background}
        onToggleBackground={onToggleBackground}
        onToggleColorscheme={onToggleColorscheme}
      />
      <CodeSnippet />
    </Window>
  );
}
