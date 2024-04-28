import { ReactNode } from 'react';

import Colorscheme from '@/models/colorscheme';

import { Background } from '@/lib/backgrounds';
import Engines from '@/lib/engines';

import Code from '@/components/ui/code';
import IconNext from '@/components/ui/icons/next';

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
  const ConfigContent = colorscheme.engine === Engines.Vim ? VimRC : InitLua;

  return (
    <Code
      fileName={colorscheme.engine === Engines.Vim ? '.vimrc' : 'init.lua'}
      lineCount={2}
    >
      <ConfigContent
        colorscheme={colorscheme}
        background={background}
        onToggleColorscheme={onToggleColorscheme}
        onToggleBackground={onToggleBackground}
      />
    </Code>
  );
}

function VimRC({
  colorscheme,
  background,
  onToggleColorscheme,
  onToggleBackground,
}: ColorschemeConfigProps) {
  return (
    <>
      <div>
        <span className="vimCommand">set </span>background
        <span className="vimCommand">=</span>
        <Button onClick={onToggleBackground}>{background}</Button>
      </div>
      <div>
        <span className="vimCommand">colorscheme </span>
        <Button onClick={onToggleColorscheme}>{colorscheme.name}</Button>
      </div>
    </>
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
        <span className="vimCommand">vim.cmd</span>
        <span className="vimParenSep">{'('}</span>
        <span className="vimString">
          {'"colorscheme '}
          <Button onClick={onToggleColorscheme}>{colorscheme.name}</Button>
          {'"'}
        </span>
        <span className="vimParenSep">{')'}</span>
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
      {onClick && <IconNext />}
    </button>
  );
}
