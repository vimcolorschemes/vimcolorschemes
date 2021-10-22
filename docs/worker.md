# The Worker

<p align="center">
  <img src="https://github.com/vimcolorschemes/worker/blob/media/logo.png?raw=true" alt="logo" width="400" />
</p>

The worker is an essential part of vimcolorschemes. It manages and updates the
data for all the repositories of the app.

## 3 functions

The Worker does 3 things:

- [`import`](#import): Search new repositories, update basic info
- [`update`](#update): Get all repositories from the database, fetch advanced info if needed
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
  "_id": { "$oid": "5f4040c01886e39a30fdc538" },
  "name": "gruvbox",
  "owner": {
    "name": "morhetz",
    "avatar_url": "https://avatars1.githubusercontent.com/u/554231?v=4"
  },
  "default_branch": "master",
  "description": "Retro groove color scheme for Vim",
  "github_created_at": { "$date": "2012-11-28T00:37:31.000Z" },
  "github_id": 6893638,
  "github_url": "https://github.com/morhetz/gruvbox",
  "homepage_url": "",
  "pushed_at": { "$date": "2020-07-28T21:26:50.000Z" },
  "stargazers_count": 7876
}
```

## `update`

The `update` fetches one by one the repositories, getting more data that will
prove useful for what's displayed on the website.

### What's added

- vim color schemes: by parsing the vim files in the repository, a list of files that are most likely vim color schemes is built.
- meta data: the last commit date, the updated startgazers count, among other data, are also fetched

Here's a sample of a valid vim color scheme after this stage:

```json
{
  "_id": 74609695,
  "description": "An arctic, north-bluish clean and elegant Vim theme.",
  "githubCreatedAt": { "$date": "2016-11-23T19:59:23.000Z" },
  "githubURL": "https://github.com/arcticicestudio/nord-vim",
  "homepageURL": "https://www.nordtheme.com/ports/vim",
  "name": "nord-vim",
  "owner": {
    "avatarURL": "https://avatars.githubusercontent.com/u/7836623?v=4",
    "name": "arcticicestudio"
  },
  "lastCommitAt": { "$date": "2021-09-12T21:08:31.000Z" },
  "license": "MIT",
  "stargazersCount": 1918,
  "stargazersCountHistory": [
    {
      "date": { "$date": "2021-10-22T00:00:00.000Z" },
      "stargazersCount": 1918
    },
    { "date": { "$date": "2021-10-13T00:00:00.000Z" }, "stargazersCount": 1894 }
  ],
  "updateValid": true,
  "updatedAt": { "$date": "2021-10-22T22:11:47.965Z" },
  "vimColorSchemes": [
    {
      "fileURL": "https://raw.githubusercontent.com/arcticicestudio/nord-vim/develop/colors/nord.vim",
      "name": "nord",
      "data": {},
      "valid": false
    }
  ],
  "weekStargazersCount": 24
}
```

## `generate`

The `generate` uses all vim files to launch a vim instance, apply the color
scheme, get the colors for all color groups, and store them.

Here's a sample of a valid vim color scheme after this stage:

```json
{
  ...
  "vimColorSchemes": [
    {
      "fileURL": "https://raw.githubusercontent.com/arcticicestudio/nord-vim/develop/colors/nord.vim",
      "name": "nord",
      "data": {
        "dark": [
          { "name": "LineNrFg", "hexCode": "#4c566a" },
          { "name": "vimSubst", "hexCode": "#81a1c1" },
          { "name": "CursorLineNrBg", "hexCode": "#000000" },
          { "name": "vimFuncName", "hexCode": "#88c0d0" },
          { "name": "CursorFg", "hexCode": "#2e3440" },
          { "name": "vimParenSep", "hexCode": "#eceff4" },
          { "name": "vimIsCommand", "hexCode": "#d8dee9" },
          { "name": "vimString", "hexCode": "#a3be8c" },
          { "name": "StatusLineFg", "hexCode": "#88c0d0" },
          { "name": "CursorBg", "hexCode": "#d8dee9" },
          { "name": "vimLineComment", "hexCode": "#616e88" },
          { "name": "vimFunction", "hexCode": "#88c0d0" },
          { "name": "vimOper", "hexCode": "#81a1c1" },
          { "name": "vimFuncKey", "hexCode": "#81a1c1" },
          { "name": "CursorLineNrFg", "hexCode": "#d8dee9" },
          { "name": "vimLet", "hexCode": "#81a1c1" },
          { "name": "CursorLineFg", "hexCode": "#000000" },
          { "name": "vimFuncBody", "hexCode": "#d8dee9" },
          { "name": "StatusLineBg", "hexCode": "#4c566a" },
          { "name": "vimOperParen", "hexCode": "#d8dee9" },
          { "name": "NormalBg", "hexCode": "#2e3440" },
          { "name": "vimNotFunc", "hexCode": "#81a1c1" },
          { "name": "LineNrBg", "hexCode": "#000000" },
          { "name": "CursorLineBg", "hexCode": "#3b4252" },
          { "name": "vimVar", "hexCode": "#d8dee9" },
          { "name": "vimFuncVar", "hexCode": "#d8dee9" },
          { "name": "vimCommand", "hexCode": "#81a1c1" },
          { "name": "vimNumber", "hexCode": "#b48ead" },
          { "name": "NormalFg", "hexCode": "#d8dee9" }
        ]
      },
      "valid": true
    }
  ],
  ...
  "generateValid": true,
  "generatedAt": { "$date": "2021-10-13T21:12:19.281Z" }
}
```
