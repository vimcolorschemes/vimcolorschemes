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
};

export default function Preview(props: PreviewProps) {
  const style = props.colorscheme.data[props.background]?.reduce(
    (acc, group) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  );

  return (
    <Window
      title={props.colorscheme.name}
      subtitle="neovim"
      className={cn(styles.container, props.className)}
      style={style}
    >
      <ColorschemeConfig
        colorscheme={props.colorscheme}
        background={props.background}
        onToggleColorscheme={props.onToggleColorscheme}
        onToggleBackground={props.onToggleBackground}
      />
      <CodeSnippet />
    </Window>
  );
}
