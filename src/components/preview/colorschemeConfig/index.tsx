import { ReactNode } from 'react';

import { Colorscheme } from '@/models/colorscheme';

import { Background } from '@/lib/backgrounds';

import styles from './index.module.css';

type ColorschemeConfigProps = {
  colorscheme: Colorscheme;
  background: Background;
  onToggleBackground?: () => void;
  onToggleColorscheme?: () => void;
};

export function ColorschemeConfigLines({
  colorscheme,
  background,
  onToggleColorscheme,
  onToggleBackground,
}: ColorschemeConfigProps) {
  return (
    <>
      <div>
        <span className="vimCommand">{'vim.o.background = '}</span>
        <Button icon="⇄" onClick={onToggleBackground}>
          {background}
        </Button>
      </div>
      <div>
        <span className="vimCommand">{'vim.cmd.colorscheme '}</span>
        <Button icon="⟳" onClick={onToggleColorscheme}>
          {colorscheme.name}
        </Button>
      </div>
    </>
  );
}

type ButtonProps = {
  children: ReactNode;
  icon: string;
  onClick?: () => void;
};

function Button({ children, icon, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={styles.button}
    >
      <span className="vimString">
        {'"'}
        {children}
        {'"'}
      </span>
      {onClick && <span className={styles.icon}>{icon}</span>}
    </button>
  );
}
