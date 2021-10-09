import React from 'react';

import { Background, VimColorScheme } from '@/models/vimColorScheme';

import Code from '@/components/preview/code';
import IconArrowCircle from '@/components/icons/iconArrowCircle';

import './index.scss';

interface IProps {
  vimColorScheme: VimColorScheme;
  background: Background;
  onChangeVimColorScheme?: () => void;
  onToggleBackground?: () => void;
}

interface IButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ onClick, children }: IButtonProps) {
  return onClick ? (
    <button type="button" onClick={onClick} className="vimrc__button">
      {children}
      <IconArrowCircle className="vimrc__button-icon" />
    </button>
  ) : (
    <span>{children}</span>
  );
}

function VimRC({
  vimColorScheme,
  background,
  onChangeVimColorScheme,
  onToggleBackground,
}: IProps) {
  return (
    <Code fileName=".vimrc" lineCount={2} className="vimrc">
      <div className="vimrc__content">
        <span>
          <span className="vimCommand">set</span> background
          <span className="vimOper">=</span>
          <Button onClick={onToggleBackground}>{background}</Button>
        </span>
        <span>
          <span className="vimCommand">colorscheme </span>
          <Button onClick={onChangeVimColorScheme}>
            {vimColorScheme.name}
          </Button>
        </span>
      </div>
    </Code>
  );
}

export default VimRC;
