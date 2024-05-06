import Code from '@/components/ui/code';

export default function CodeSnippet() {
  return (
    <Code lineCount={12} activeLine={6} fileName="code.vim">
      <div>
        <span className="vimLineComment">
          {'" Returns true if the color hex value is light'}
        </span>
      </div>
      <div>
        <span className="vimCommand">function</span>
        <span className="vimFunction">! IsHexColorLight</span>
        <span className="vimParenSep">(</span>
        <span className="vimOperParen">color</span>
        <span className="vimParenSep">)</span>
        <span className="vimFuncBody"> </span>
        <span className="vimIsCommand">abort</span>
      </div>
      <div>
        <span className="vimLet">{'  '}let</span>
        <span className="vimFuncBody"> </span>
        <span className="vimVar">l:raw_color</span>
        <span className="vimFuncBody"> </span>
        <span className="vimOper">=</span>
        <span className="vimFuncBody"> </span>
        <span className="vimFuncName">trim</span>
        <span className="vimParenSep">(</span>
        <span className="vimFuncVar">a:color</span>
        <span className="vimOperParen">, </span>
        <span className="vimString">{"'#'"}</span>
        <span className="vimParenSep">)</span>
      </div>
      <br />
      <div>
        <span className="vimLet">{'  '}let</span>
        <span className="vimFuncBody"> </span>
        <span className="vimVar">l:red</span>
        <span className="vimFuncBody"> </span>
        <span className="vimOper">=</span>
        <span className="vimFuncBody"> </span>
        <span className="vimFuncName">str2nr</span>
        <span className="vimParenSep">(</span>
        <span className="vimSubst">substitute</span>
        <span className="vimParenSep">(</span>
        <span className="vimOperParen">l:raw_color, </span>
        <span className="vimString">{"'.{0}(.{2})'"}</span>
        <span className="vimOperParen">, </span>
        <span className="vimString">{"'1'"}</span>
        <span className="vimOperParen">, </span>
        <span className="vimString">{"'g'"}</span>
        <span className="vimParenSep">)</span>
        <span className="vimFuncBody">, </span>
        <span className="vimNumber">16</span>
        <span className="vimParenSep">)</span>
      </div>
      <div className="CursorLineBg">
        <span className="vimLet CursorLineBg">{'  '}let</span>
        <span className="vimFuncBody CursorLineBg"> </span>
        <span className="vimVar CursorLineBg">l:green</span>
        <span className="vimFuncBody CursorLineBg"> </span>
        <span className="vimOper CursorLineBg">=</span>
        <span className="vimFuncBody CursorLineBg"> </span>
        <span className="vimFuncName CursorLineBg">str2nr</span>
        <span className="vimParenSep CursorLineBg">(</span>
        <span className="vimSubst CursorLineBg">substitute</span>
        <span className="vimParenSep CursorLineBg">(</span>
        <span className="vimOperParen CursorLineBg">l:raw_color, </span>
        <span className="vimString CursorLineBg">{"'.{2}(.{2}).{2}'"}</span>
        <span className="vimOperParen CursorLineBg">, </span>
        <span className="vimString CursorLineBg">{"'1'"}</span>
        <span className="vimOperParen CursorLineBg">, </span>
        <span className="vimString CursorLineBg">{"'g'"}</span>
        <span className="vimParenSep CursorLineBg">)</span>
        <span className="vimFuncBody CursorLineBg">, </span>
        <span className="vimNumber CursorLineBg">16</span>
        <span className="vimParenSep CursorLineBg">)</span>
      </div>
      <div>
        <span className="vimLet">{'  '}let</span>
        <span className="vimFuncBody"> </span>
        <span className="vimVar">l:blue</span>
        <span className="vimFuncBody"> </span>
        <span className="vimOper">=</span>
        <span className="vimFuncBody"> </span>
        <span className="vimFuncName">str2nr</span>
        <span className="vimParenSep">(</span>
        <span className="vimSubst">substitute</span>
        <span className="vimParenSep">(</span>
        <span className="vimOperParen">l:raw_color, </span>
        <span className="vimString">{"'.{4}(.{2})'"}</span>
        <span className="vimOperParen">, </span>
        <span className="vimString">{"'1'"}</span>
        <span className="vimOperParen">, </span>
        <span className="vimString">{"'g'"}</span>
        <span className="vimParenSep">)</span>
        <span className="vimFuncBody">, </span>
        <span className="vimNumber">16</span>
        <span className="vimParenSep">)</span>
      </div>
      <br />
      <div>
        <span className="vimLet">{'  '}let</span>
        <span className="vimFuncBody"> </span>
        <span className="vimVar">l:brightness</span>
        <span className="vimFuncBody"> </span>
        <span className="vimOper">=</span>
        <span className="vimFuncBody"> </span>
        <span className="vimParenSep">((</span>
        <span className="vimOperParen">l:red * </span>
        <span className="vimNumber">299</span>
        <span className="vimParenSep">)</span>
        <span className="vimOperParen"> </span>
        <span className="vimOper">+</span>
        <span className="vimOperParen"> </span>
        <span className="vimParenSep">(</span>
        <span className="vimOperParen">l:green * </span>
        <span className="vimNumber">587</span>
        <span className="vimParenSep">)</span>
        <span className="vimOperParen"> </span>
        <span className="vimOper">+</span>
        <span className="vimOperParen"> </span>
        <span className="vimParenSep">(</span>
        <span className="vimOperParen">l:blue * </span>
        <span className="vimNumber">114</span>
        <span className="vimParenSep">))</span>
        <span className="vimFuncBody"> / </span>
        <span className="vimNumber">1000</span>
      </div>
      <br />
      <div>
        <span className="vimNotFunc">{'  '}return</span>
        <span className="vimFuncBody"> </span>
        <span className="vimVar">l:brightness</span>
        <span className="vimFuncBody"> </span>
        <span className="vimOper">&gt;</span>
        <span className="vimFuncBody"> </span>
        <span className="vimNumber">155</span>
      </div>
      <div>
        <span className="vimCommand">endfunction</span>
      </div>
    </Code>
  );
}
