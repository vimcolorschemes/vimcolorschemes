# Installation

There are two ways to get up and running with vimcolorschemes.

1. Run Docker containers (coming soon...)
1. [Run locally](#_2-local)

## 2. Local

### 0. Requirements

- Running local install of mongodb-community on macOS: `brew install mongodb-community && brew services start mongodb-community`
- Node 12+ 
- A locally cloned fork of [the repository](https://github.com/vimcolorschemes/vimcolorschemes). Check out [how to.](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)

### 1. Set up the local database

1. Make sure mongodb is running locally at port `27017`
   - If using custom configuration, update the `connectionString` in `gatsby-config.js`
1. Run the seed script: `npm run seed`
   - Again, if using custom configuration, update the `mongoimport` script at `./bin/seed`.  Running into problems? Check out [mongoimport docs](https://docs.mongodb.com/v4.2/reference/program/mongoimport/) or create an issue.

The script imports the example data at `./database/seed.json` into your local
database.

### 2. Run the app

1. Run `npm install`
1. Run `npm start`
1. Start hacking away.

## Setting up the search engine

The search feature of vimcolorschemes uses an Elasticsearch engine.

You can choose to install and run it through docker (coming soon...) or on
locally your machine.

For both, first clone [the search
repository](https://github.com/vimcolorschemes/search).

### Local

1. [Install elasticsearch locally](https://www.elastic.co/start)
1. Make sure elasticsearch is running
1. `cd` into the root of the search repository
1. Run `npm install`
1. Run `npm start`

With both running, go back to the main vimcolorschemes repository, and run `npm
start` again.

### Docker

(coming soon...)

## Running into problems?

Any trouble trying to make vimcolorschemes work locally? [Create an
issue](https://github.com/vimcolorschemes/vimcolorschemes/issues) and we'll be
happy to help.
