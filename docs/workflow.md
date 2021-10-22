# Workflow

## Projects

2 different projects work in sync to make vimcolorschemes possible:

- The Worker
- The App

## The Worker ⚙️

The Worker is a "scraper" that runs daily. Its main goal is to fetch
repositories that could ressemble a vim color scheme from different git forges
and then store them in a database.

For every repository found, it searches thoroughly for vim files that could be
used to generate a vim color scheme preview.

### Links

- [See the repository](https://github.com/vimcolorschemes/worker)
- [Read about the worker in more details](/worker)

### Stack

- [Golang](https://golang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Github API](https://docs.github.com/en/rest)
- Vimscript

## The App 🖼

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
- [Cypress](https://www.cypress.io/)
- [AWS](https://console.aws.amazon.com/)
- [ElasticSearch](https://elastic.co)
