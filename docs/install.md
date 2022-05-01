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
   - Again, if using custom configuration, update the `mongoimport` script at `./db/seed`. Running into problems? Check out [mongoimport docs](https://docs.mongodb.com/v4.2/reference/program/mongoimport/) or create an issue.

The script imports the example data at `./database/seed.json` into your local
database.

### 2. Run the app

1. Run `npm install`
1. Run `npm start`
1. Start hacking away.

## Setting up the Search API

Instructions on how to set up the Search API locally are coming soon...

## Running into problems?

Any trouble trying to make vimcolorschemes work locally? [Create an
issue](https://github.com/vimcolorschemes/vimcolorschemes/issues) and we'll be
happy to help.
