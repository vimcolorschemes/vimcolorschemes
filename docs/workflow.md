# Workflow

## Acting agents

3 agents working in sync make vimcolorschemes possible:

- The Worker
- The App
- The Studio

## ⚙️ The Worker

The Worker is a [python](https://www.python.org/) function that runs daily. Its main goal is to fetch repositories using the [GitHub API](https://docs.github.com/en/rest) and then store them in a [MongoDB](https://www.mongodb.com/) database.

For every repository found, it searches thoroughly for potential image URLs that represent the color scheme, and that could be used by the App.

### Links

- [See the repository](https://github.com/vimcolorschemes/worker)
- [Read about the worker in more details](/the-worker)

## 🖼 The App

The App is a static website built with [Gatsby](https://www.gatsbyjs.org/). All the data fetching and content processing happen at build time.

### Data fetching

At build time, Gatsby creates [nodes](https://www.gatsbyjs.org/docs/node-model) out of all repositories stored in the MongoDB database. This is done with the help of [gatsby-source-mongodb](https://www.gatsbyjs.org/packages/gatsby-source-mongodb/).

### Image processing

Since only image URLs are stored in the database, Gatsby needs to download all the images at build time. It [creates remote nodes](https://www.gatsbyjs.org/docs/preprocessing-external-images/) out of every image so that they can be used with [gatsby-image](https://www.gatsbyjs.org/packages/gatsby-image/). This makes all the site images lazy-loaded, speeding the website.

## 🎬 The Studio

The Studio is only an idea for now. Follow [the related issue](https://github.com/vimcolorschemes/vimcolorschemes/issues/15) for updates.
