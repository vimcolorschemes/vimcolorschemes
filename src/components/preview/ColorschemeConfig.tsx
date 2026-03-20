import type { ReactNode } from 'react';

import IconCircledArrow from '#/components/preview/ui/CircledArrow';
import Code from '#/components/preview/ui/Code';
import type { Background } from '#/lib/backgrounds';
import type Colorscheme from '#/models/colorscheme';

import styles from '#/components/preview/ColorschemeConfig.module.css';

type ColorschemeConfigProps = {
  colorscheme: Colorscheme;
  background: Background;
  onToggleBackground?: () => void;
  onToggleColorscheme?: () => void;
};

export default function ColorschemeConfig({
  colorscheme,
  background,
  onToggleColorscheme,
  onToggleBackground,
}: ColorschemeConfigProps) {
  return (
    <Code fileName="init.lua" lineCount={2}>
      <div>
        <span className="vimCommand">{'vim.o.background = '}</span>
        <span className="vimString">
          "<Button onClick={onToggleBackground}>{background}</Button>"
        </span>
      </div>
      <div>
        <span className="vimCommand">{'vim.cmd.colorscheme '}</span>
        <span className="vimString">
          "<Button onClick={onToggleColorscheme}>{colorscheme.name}</Button>"
        </span>
      </div>
    </Code>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={styles.button}
    >
      {children}
      {onClick ? <IconCircledArrow /> : null}
    </button>
  );
}
