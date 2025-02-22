# The Worker

<p align="center">
  <img src="https://github.com/vimcolorschemes/worker/blob/media/logo.png?raw=true" alt="logo" width="400" />
</p>

The worker is an essential part of vimcolorschemes. It manages and updates the
data for all the repositories of the app.

## 3 functions

The Worker does 3 things:

- [`import`](#import): Search new repositories, update basic info
- [`update`](#update): Get all repositories from the database, update timestamps and stargazers count
- [`generate`](#generate): From the repository files, generate color data used in the [code previews](/previews)

It is currently configured to do all of these things daily to ensure
up-to-date, clean data.

After its job is done, the app fetches the data and builds the
[vimcolorschemes.com](https://vimcolorschemes.com) that we know.

## `import`

The `import` is simple. It fetches a list of repositories saving only the most
basic information at this stage. The queries used to fetch repositories only
match repositories that could potentially be a vim color scheme. Still, since
the queries are flexible and little to no validation is done at this point, a
lot of repositories are in fact not vim color schemes, but dotfiles, vim
plugins, etc.

Each repository is stored in the database.

Here's an example of a repository at this stage:

```json
{
  "_id": "397434315",
  "owner": {
    "avatarURL": "https://avatars.githubusercontent.com/u/93489351?v=4",
    "name": "catppuccin"
  },
  "name": "nvim",
  "description": "🍨 Soothing pastel theme for (Neo)vim",
  "githubCreatedAt": "2021-08-18T01:14:49.000Z",
  "githubURL": "https://github.com/catppuccin/nvim"
}
```

## `update`

The `update` fetches one by one the repositories, getting more data that will
prove useful for what's displayed on the website.

### What's added

- the stargazers count history
- the stargazers count for the last week
- the last update date

Here's a sample of a valid vim color scheme after this stage:

```json
{
  "_id": "397434315",
  "owner": {
    "avatarURL": "https://avatars.githubusercontent.com/u/93489351?v=4",
    "name": "catppuccin"
  },
  "name": "nvim",
  "description": "🍨 Soothing pastel theme for (Neo)vim",
  "githubCreatedAt": "2021-08-18T01:14:49.000Z",
  "githubURL": "https://github.com/catppuccin/nvim"
  "githubUpdatedAt": "2025-02-22T19:13:26.000Z",
  "stargazersCount": 6021,
  "stargazersCountHistory": [
    {
      "date": "2025-02-22T00:00:00.000Z",
      "stargazersCount": 6021
    },
    {
      "date": "2025-02-21T00:00:00.000Z",
      "stargazersCount": 6011
    }
  ],
  "weekStargazersCount": 10,
  "updateValid": true,
  "updatedAt": "2025-02-22T22:45:45.525Z"
}
```

## `generate`

The `generate` job intalls the [vimcolorschemes/extractor.nvim] plugin, then
installs each repository as a neovim plugin, lists the possible colorschemes it
contains, and generates the color data for each one.

Here's a sample of a valid vim color scheme after this stage:

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
