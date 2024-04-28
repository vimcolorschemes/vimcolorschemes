import Colorscheme from '@/models/colorscheme';

import { Background } from '@/lib/backgrounds';

import CodeSnippet from './codeSnippet';
import ColorschemeConfig from './colorschemeConfig';
import styles from './index.module.css';
import WindowHeader from './windowHeader';

type PreviewProps = {
  colorscheme: Colorscheme;
  background: Background;
  onToggleColorscheme?: () => void;
  onToggleBackground?: () => void;
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
    <div className={styles.container} style={style}>
      <WindowHeader
        title={props.colorscheme.name}
        engine={props.colorscheme.engine}
      />
      <ColorschemeConfig
        colorscheme={props.colorscheme}
        background={props.background}
        onToggleColorscheme={props.onToggleColorscheme}
        onToggleBackground={props.onToggleBackground}
      />
      <CodeSnippet />
    </div>
  );
}
