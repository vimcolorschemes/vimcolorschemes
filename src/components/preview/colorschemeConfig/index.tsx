import Colorscheme from '@/models/colorscheme';
import Repository from '@/models/repository';

import Backgrounds, { Background } from '@/lib/backgrounds';
import Engines from '@/lib/engines';

import Code from '@/components/ui/code';

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

  const configProps = {
    colorscheme,
    background,
    toggleColorscheme,
    isColorschemeDisabled,
    toggleBackground,
    isBackgroundDisabled,
  };

  return (
    <Code
      fileName={colorscheme.engine === Engines.Vim ? '.vimrc' : 'init.lua'}
      lineCount={2}
    >
      {colorscheme.engine === Engines.Vim ? (
        <VimRC {...configProps} />
      ) : (
        <InitLua {...configProps} />
      )}
    </Code>
  );
}

type ConfigProps = {
  colorscheme: Colorscheme;
  background: Background;
  toggleColorscheme: () => void;
  isColorschemeDisabled: boolean;
  toggleBackground: () => void;
  isBackgroundDisabled: boolean;
};

function VimRC(props: ConfigProps) {
  return (
    <>
      <div>
        set background=
        <button
          type="button"
          onClick={props.toggleBackground}
          disabled={props.isBackgroundDisabled}
        >
          {props.background}
        </button>
      </div>
      <div>
        colorscheme{' '}
        <button
          type="button"
          onClick={props.toggleColorscheme}
          disabled={props.isColorschemeDisabled}
        >
          {props.colorscheme.name}
        </button>
      </div>
    </>
  );
}

function InitLua(props: ConfigProps) {
  return (
    <>
      <div>
        {'vim.o.background = "'}
        <button
          type="button"
          onClick={props.toggleBackground}
          disabled={props.isBackgroundDisabled}
        >
          {props.background}
        </button>
        {'"'}
      </div>
      <div>
        {'vim.cmd("colorscheme '}
        <button
          type="button"
          onClick={props.toggleColorscheme}
          disabled={props.isColorschemeDisabled}
        >
          {props.colorscheme.name}
        </button>
        {'")'}
      </div>
    </>
  );
}
