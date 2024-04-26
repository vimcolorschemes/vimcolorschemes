import Colorscheme from '@/models/colorscheme';

import Engines from '@/lib/engines';

import CodeEditor from '@/components/ui/codeEditor';

type ColorschemeConfigProps = {
  colorscheme: Colorscheme;
};

export default function ColorschemeConfig({
  colorscheme,
}: ColorschemeConfigProps) {
  return (
    <CodeEditor
      fileName={colorscheme.engine === Engines.Vim ? '.vimrc' : 'init.lua'}
      lineCount={2}
    >
      <div>set background=dark</div>
      <div>colorscheme {colorscheme.name}</div>
    </CodeEditor>
  );
}
