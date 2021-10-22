# Vim color scheme code previews

## Getting the colors

During the `generate` job of [The Worker](/worker), all potential vim color
scheme files are searched for.

Using those files, a real vim instance is launched and all color scheme a
variants are tried (color scheme names, and `light` or `dark` backgrounds) on a
very specific code sample.

Using vim functions, the cursor runs through all the words of the assigned code
sample, and the color under the cursor is stored. The data is stored into the
database entry for each color scheme.

Here is an example of what the data looks like for a color scheme after a
`generate` job:

```json
{
  ...
  "name": "onedark.vim",
  "owner": {
    "name": "joshdick"
  },
  ...
  "vimColorSchemes": [
    {
      "fileURL": "https://raw.githubusercontent.com/joshdick/onedark.vim/main/colors/onedark.vim",
      "name": "onedark",
      "data": {
        "dark": [
          { "name": "vimIsCommand", "hexCode": "#abb2bf" },
          { "name": "vimFuncKey", "hexCode": "#c678dd" },
          { "name": "vimLet", "hexCode": "#c678dd" },
          { "name": "vimSubst", "hexCode": "#c678dd" },
          { "name": "CursorLineNrFg", "hexCode": "#000000" },
          { "name": "vimFuncBody", "hexCode": "#abb2bf" },
          { "name": "CursorLineBg", "hexCode": "#2c323c" },
          { "name": "CursorFg", "hexCode": "#282c34" },
          { "name": "vimString", "hexCode": "#98c379" },
          { "name": "vimVar", "hexCode": "#e06c75" },
          { "name": "LineNrBg", "hexCode": "#000000" },
          { "name": "vimFunction", "hexCode": "#abb2bf" },
          { "name": "vimOperParen", "hexCode": "#abb2bf" },
          { "name": "vimLineComment", "hexCode": "#5c6370" },
          { "name": "vimNotFunc", "hexCode": "#c678dd" },
          { "name": "vimFuncName", "hexCode": "#61afef" },
          { "name": "StatusLineBg", "hexCode": "#2c323c" },
          { "name": "vimFuncVar", "hexCode": "#e06c75" },
          { "name": "vimCommand", "hexCode": "#c678dd" },
          { "name": "CursorBg", "hexCode": "#61afef" },
          { "name": "vimOper", "hexCode": "#c678dd" },
          { "name": "NormalBg", "hexCode": "#282c34" },
          { "name": "vimNumber", "hexCode": "#d19a66" },
          { "name": "CursorLineNrBg", "hexCode": "#000000" },
          { "name": "vimParenSep", "hexCode": "#abb2bf" },
          { "name": "NormalFg", "hexCode": "#abb2bf" },
          { "name": "CursorLineFg", "hexCode": "#000000" },
          { "name": "LineNrFg", "hexCode": "#4b5263" },
          { "name": "StatusLineFg", "hexCode": "#abb2bf" }
        ]
      },
      "valid": true
    }
  ],
  ...
}
```

## HTML code sample

A code sample is used to generate color data from a vim color scheme. That same
code sample is then turned into a HTML template by using
[cocopon/snapbuffer.vim](https://github.com/cocopon/snapbuffer.vim), a vim
plugin that turns a vim buffer view into HTML.

Here's a sample of a generated code sample:

```html
<span class="vimLet">let</span><span class="vimFuncBody"> </span
><span class="vimVar">l:raw_color</span><span class="vimFuncBody"> </span
><span class="vimOper">=</span><span class="vimFuncBody"> </span
><span class="vimFuncName">trim</span><span class="vimParenSep">(</span
><span class="vimFuncVar">a:color</span><span class="vimOperParen">, </span
><span class="vimString">\'#\'</span><span class="vimParenSep">)</span>
```

## Applying the colors

You might have noticed the classes generated in the HTML template match the
exact name of the color groups that we stored in our database.

Each class is added to a stylesheet, and to each one of them we add a [CSS
custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) that will
then be overwritten for each the vim color scheme previews, applying their
custom syntax colors to the code sample template:

```css
.vimParenSep {
  color: var(--vim-vimParenSep);
}
```
