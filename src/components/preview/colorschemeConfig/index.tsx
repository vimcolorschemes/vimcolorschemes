import { ReactNode } from 'react';

import Colorscheme from '@/models/colorscheme';

import { Background } from '@/lib/backgrounds';

import Code from '@/components/ui/code';
import IconCircledArrow from '@/components/ui/icons/circledArrow';

import styles from './index.module.css';

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
      <InitLua
        colorscheme={colorscheme}
        background={background}
        onToggleColorscheme={onToggleColorscheme}
        onToggleBackground={onToggleBackground}
      />
    </Code>
  );
}

function InitLua({
  colorscheme,
  background,
  onToggleColorscheme,
  onToggleBackground,
}: ColorschemeConfigProps) {
  return (
    <>
      <div>
        <span className="vimCommand">{'vim.o.background = '}</span>
        <span className="vimString">
          {'"'}
          <Button onClick={onToggleBackground}>{background}</Button>
          {'"'}
        </span>
      </div>
      <div>
        <span className="vimCommand">{'vim.cmd.colorscheme '}</span>
        <span className="vimString">
          {'"'}
          <Button onClick={onToggleColorscheme}>{colorscheme.name}</Button>
          {'"'}
        </span>
      </div>
    </>
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
      {onClick && <IconCircledArrow />}
    </button>
  );
}
