# Workflow

## Projects

2 different projects work in sync to make vimcolorschemes possible:

- [The Worker](#the-worker)
- [The App](#the-app)

## The Worker

The Worker is a series of scripts that run daily. Their main goal is to fetch
repositories that could ressemble a vim/neovim colorscheme from Github, and
then store them in a database.

For every repository found, it installs it as a neovim plugin, and uses the
[vimcolorschemes/extractor.nvim](https://github.com/vimcolorschemes/extractor.nvim/)
plugin to generate the color data used in the previews. It stores the result in
the database.

### Links

- [See the repository](https://github.com/vimcolorschemes/worker)
- [Read about the Worker in more details](/worker)

### Tech stack

- [Golang](https://golang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Github API](https://docs.github.com/en/rest)
- [extractor.nvim](https://github.com/vimcolorschemes/extractor.nvim)

## The App

The App is a gallery featuring all the colorschemes found by the Worker.

> Curious about how the vim colorscheme previews are built? Visit [/previews](/previews).

### Stack

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
