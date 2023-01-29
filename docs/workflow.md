# Workflow

## Projects

2 different projects work in sync to make vimcolorschemes possible:

- [The Worker](#the-worker)
- [The App](#the-app)
- [The Search API](#the-search-api)

## The Worker

The Worker is a "scraper" that runs daily. Its main goal is to fetch
repositories that could ressemble a vim color scheme from different git forges
and then store them in a database.

For every repository found, it searches thoroughly for vim files that could be
used to generate a vim color scheme preview.

### Links

- [See the repository](https://github.com/vimcolorschemes/worker)
- [Read about the Worker in more details](/worker)

### Stack

- [Golang](https://golang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Github API](https://docs.github.com/en/rest)
- Vimscript

## The App

The App is a nicely navigable gallery created using all the vim color schemes found by the Worker.

After The Worker's daily jobs, the website is built again using the new data and then deployed.

> Curious about how the vim color scheme previews are built? Visit [/previews](/previews).

### Stack

- [Gatsby](https://gatsbyjs.com/)
- [React](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Scss](https://sass-lang.com/)
- [MongoDB](https://www.mongodb.com/)
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [AWS](https://console.aws.amazon.com/)
- [ElasticSearch](https://elastic.co)

## The Search API

The Search API is the actor behing the search feature of vimcolorschemes.

It's a AWS Lambda function built with Golang and has 2 functions:

- **Store**: Receive repositories from a daily build of the app, and store it in a
  MongoDB database to be used as a search index.
- **Search**: Receive search parameters and return a list of repositories
  matching the request.

### Links

- [See the repository](https://github.com/vimcolorschemes/search)
- [Read about the Search API in more details](/search)

### Stack

- [Golang](https://golang.org/)
- [MongoDB](https://www.mongodb.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
