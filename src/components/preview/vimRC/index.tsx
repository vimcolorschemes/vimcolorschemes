import React, { useMemo } from 'react';

import Background from '@/lib/background';
import { VimColorScheme } from '@/models/vimColorScheme';

import Code from '@/components/preview/code';
import IconArrowCircle from '@/components/icons/arrowCircle';

import './index.scss';

interface Props {
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

function VimRC(props: Props) {
  const fileName = useMemo(() => {
    if (props.vimColorScheme.isLua) {
      return 'init.lua';
    }

    return '.vimrc';
  }, [props.vimColorScheme.isLua]);

  return (
    <Code fileName={fileName} lineCount={2} className="vimrc">
      {props.vimColorScheme.isLua ? (
        <InitLuaContent {...props} />
      ) : (
        <VimRCContent {...props} />
      )}
    </Code>
  );
}

function VimRCContent({
  vimColorScheme,
  background,
  onChangeVimColorScheme,
  onToggleBackground,
}: Props) {
  return (
    <div className="vimrc__content">
      <span>
        <span className="vimCommand">set</span> background
        <span className="vimOper">=</span>
        <Button onClick={onToggleBackground}>{background}</Button>
      </span>
      <span>
        <span className="vimCommand">colorscheme </span>
        <Button onClick={onChangeVimColorScheme}>{vimColorScheme.name}</Button>
      </span>
    </div>
  );
}

function InitLuaContent({
  vimColorScheme,
  background,
  onChangeVimColorScheme,
  onToggleBackground,
}: Props) {
  return (
    <div className="vimrc__content">
      <span>
        <span>vim.</span>
        <span className="vimCommand">cmd </span>
        <span className="vimString">[[ set background=</span>
        <Button onClick={onToggleBackground}>{background}</Button>
        <span className="vimString"> ]]</span>
      </span>
      <span>
        <span>vim.</span>
        <span className="vimCommand">cmd </span>
        <span className="vimString">[[ colorscheme </span>
        <Button onClick={onChangeVimColorScheme}>{vimColorScheme.name}</Button>
        <span className="vimString"> ]]</span>
      </span>
    </div>
  );
}

export default VimRC;
