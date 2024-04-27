import cn from 'classnames';
import { ReactNode } from 'react';

import Colorscheme from '@/models/colorscheme';
import Repository from '@/models/repository';

import Backgrounds, { Background } from '@/lib/backgrounds';
import Engines from '@/lib/engines';

import Code from '@/components/ui/code';
import IconNext from '@/components/ui/icons/next';

import styles from './index.module.css';

type ColorschemeConfigProps = {
  repository: Repository;
  colorscheme: Colorscheme;
  background: Background;
  onColorschemeChange: (colorscheme: Colorscheme) => void;
  onBackgroundChange: (background: Background) => void;
};

export default function ColorschemeConfig({
  repository,
  colorscheme,
  background,
  onColorschemeChange,
  onBackgroundChange,
}: ColorschemeConfigProps) {
  const isColorschemeDisabled = repository.colorschemes.length === 1;
  const isBackgroundDisabled = colorscheme.backgrounds.length === 1;

  function toggleColorscheme() {
    const index = repository.colorschemes.findIndex(
      c => c.name === colorscheme.name,
    );
    const nextIndex = (index + 1) % repository.colorschemes.length;

    onColorschemeChange(repository.colorschemes[nextIndex]);
  }

  function toggleBackground() {
    if (background === Backgrounds.Light) {
      onBackgroundChange(Backgrounds.Dark);
    } else {
      onBackgroundChange(Backgrounds.Light);
    }
  }

  const ConfigContent = colorscheme.engine === Engines.Vim ? VimRC : InitLua;

  return (
    <Code
      fileName={colorscheme.engine === Engines.Vim ? '.vimrc' : 'init.lua'}
      lineCount={2}
    >
      <ConfigContent
        colorscheme={colorscheme}
        background={background}
        toggleColorscheme={toggleColorscheme}
        isColorschemeDisabled={isColorschemeDisabled}
        toggleBackground={toggleBackground}
        isBackgroundDisabled={isBackgroundDisabled}
      />
    </Code>
  );
}

type ConfigContentProps = {
  colorscheme: Colorscheme;
  background: Background;
  toggleColorscheme: () => void;
  isColorschemeDisabled: boolean;
  toggleBackground: () => void;
  isBackgroundDisabled: boolean;
};

function VimRC({
  colorscheme,
  background,
  toggleColorscheme,
  isColorschemeDisabled,
  toggleBackground,
  isBackgroundDisabled,
}: ConfigContentProps) {
  return (
    <>
      <div>
        <span className="vimCommand">set </span>background
        <span className="vimCommand">=</span>
        <Button onClick={toggleBackground} disabled={isBackgroundDisabled}>
          {background}
        </Button>
      </div>
      <div>
        <span className="vimCommand">colorscheme </span>
        <Button onClick={toggleColorscheme} disabled={isColorschemeDisabled}>
          {colorscheme.name}
        </Button>
      </div>
    </>
  );
}

function InitLua({
  colorscheme,
  background,
  toggleColorscheme,
  isColorschemeDisabled,
  toggleBackground,
  isBackgroundDisabled,
}: ConfigContentProps) {
  return (
    <>
      <div>
        <span className="vimCommand">{'vim.o.background = '}</span>
        <span className="vimString">
          {'"'}
          <Button onClick={toggleBackground} disabled={isBackgroundDisabled}>
            {background}
          </Button>
          {'"'}
        </span>
      </div>
      <div>
        <span className="vimCommand">vim.cmd</span>
        <span className="vimParenSep">{'('}</span>
        <span className="vimString">
          {'"colorscheme '}
          <Button onClick={toggleColorscheme} disabled={isColorschemeDisabled}>
            {colorscheme.name}
          </Button>
          {'"'}
        </span>
        <span className="vimParenSep">{')'}</span>
      </div>
    </>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
};

function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={styles.button}
    >
      {children}
      {!disabled && <IconNext />}
    </button>
  );
}
