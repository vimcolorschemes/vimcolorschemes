# Installation

There are two ways to get up and running with vimcolorschemes.

1. [Docker](#_1-docker)
1. [Run locally](#_2-local)

## 1. Docker

1. `cd` into the root of the repository
1. run `npm run docker`

That's it. The script will:

1. `docker-compose build`: build the docker image for the database and the app
1. `docker-compose up`: start the application

## 2. Local

### 0. Requirements

- Running local install of mongodb-community on macOS: `brew install mongodb-community && brew services start mongodb-community`
- Node 12+ 
- A locally cloned fork of [the repository](https://github.com/vimcolorschemes/vimcolorschemes). Check out [how to.](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)

### 1. Set up the local database

1. Make sure mongodb is running locally at port `27017`
   - If using custom configuration, update the `connectionString` in `gatsby-config.js`
1. Run the seed script: `npm run seed`
   - Again, if using custom configuration, update the `mongoimport` script at `./db/seed`.  Running into problems? Check out [mongoimport docs](https://docs.mongodb.com/v4.2/reference/program/mongoimport/) or create an issue.

The script imports the example data at `./database/seed.json` into your local
database.

### 2. Run the app

1. Run `npm install`
1. Run `npm start`
1. Start hacking away.

## Setting up the search engine

The search feature of vimcolorschemes uses an Elasticsearch engine.

You can choose to install and run it through docker or on locally your machine.

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

1. `cd` into the root of the search repository
2. Run `npm run docker`

That's it. 2 docker containers will be built and started, 1 for elasticsearch,
and 1 for the search proxy.

### Communication with the vimcolorschemes app

Once the search engine is ready, the vimcolorschemes app should be built again
in order for the search data to be uploaded to elasticsearch.

Note that by default, the environment variables are set up to work with one of
these 3 options:

- Using docker for both app and search
- Using a local install for both app and search
- Using a local install for the app and docker for search

## Running into problems?

Any trouble trying to make vimcolorschemes work locally? [Create an
issue](https://github.com/vimcolorschemes/vimcolorschemes/issues) and we'll be
happy to help.
