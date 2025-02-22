# Colorscheme code previews

## Collecting the colors

During the `generate` job of [The Worker](/worker), all potential colorschemes
are downloaded on the server.

Using those files, a real neovim instance is launched and all colorscheme
variants are tried (colorscheme names found, as well as `light` and `dark`
backgrounds) on a very specific code snippet.

Using [extractor.nvim](https://github.com/vimcolorschemes/extractor.nvim), the
cursor runs through all the words of the assigned code snippet, and the color
as well as the group name under the cursor are stored. The data is stored into
the database entry for each colorscheme.

Here is an example of what the data looks like for a colorscheme after a
`generate` job:

```json
{
  ...
  "vimColorSchemes": [
    {
      "name": "catppuccin-macchiato",
      "data": {
        "dark": [
          { "name": "vimLineCommentFg", "hexCode": "#939AB7" },
          { "name": "vimFuncKeyFg", "hexCode": "#C6A0F6" },
          { "name": "vimFuncBangFg", "hexCode": "#91D7E3" },
          { "name": "DelimiterFg", "hexCode": "#939AB7" },
          { "name": "vimFuncParamFg", "hexCode": "#F0C6C6" },
          { "name": "vimFuncModFg", "hexCode": "#F5BDE6" },
          { "name": "vimLetFg", "hexCode": "#C6A0F6" },
          { "name": "vimVarFg", "hexCode": "#F0C6C6" },
          { "name": "vimOperFg", "hexCode": "#91D7E3" },
          { "name": "vimFuncNameFg", "hexCode": "#8AADF4" },
          { "name": "vimParenSepFg", "hexCode": "#939AB7" },
          { "name": "vimFuncVarFg", "hexCode": "#F0C6C6" },
          { "name": "vimStringFg", "hexCode": "#A6DA95" },
          { "name": "vimNumberFg", "hexCode": "#F5A97F" },
          { "name": "vimNotFuncFg", "hexCode": "#C6A0F6" },
          { "name": "vimCommandFg", "hexCode": "#C6A0F6" },
          { "name": "NormalFg", "hexCode": "#CAD3F5" },
          { "name": "NormalBg", "hexCode": "#24273A" },
          { "name": "StatusLineFg", "hexCode": "#CAD3F5" },
          { "name": "StatusLineBg", "hexCode": "#1E2030" },
          { "name": "CursorFg", "hexCode": "#24273A" },
          { "name": "CursorBg", "hexCode": "#CAD3F5" },
          { "name": "LineNrFg", "hexCode": "#494D64" },
          { "name": "CursorLineBg", "hexCode": "#303347" },
          { "name": "CursorLineNrFg", "hexCode": "#B7BDF8" }
        ]
      },
      "backgrounds": ["dark"]
    },
  ],
  ...
  "generateValid": true,
  "generatedAt": "2021-10-13T21:12:19.281Z"
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
