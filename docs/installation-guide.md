# Installation

There are two ways to get up and running with vimcolorschemes.

1. Run Docker containers
2. Run locally

## 1. Docker

1. `cd` into the root of the repository
2. run `bin/docker-setup`

That's it. The script will:

- `docker-compose build`: build the docker image for the database and the app
- `docker-compose up`: start the application

## 2. Local

### 0. Requirements

- Running local install of mongodb-community
  - on macOS: `brew install mongodb-community && brew services start mongodb-community`
- Node
- A locally cloned fork of the repository. Check out [how to.](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)

### 1. Set up the local database

1. Make sure mongodb is running locally at port `27017`
   - If using custom configuration, update `connectionString` in `gatsby-config.js`
2. Run the seed script: `npm run seed`
   - Again, if using custom configuration, update the `mongoimport` script at `./seed/run.sh`.
   - Running into problems? Check out [mongoimport docs](https://docs.mongodb.com/v4.2/reference/program/mongoimport/) or create an issue.

The script imports the example data at `./seed/data.json` into your local database.

### 2. Run the app

1. `cd` into the cloned repository.
2. `npm install`
3. `npm start`
4. Start hacking away.

## Running into problems?

Any trouble trying to make vimcolorschemes work locally? [Create an issue](https://github.com/reobin/vimcolorschemes/issues) and we'll be happy to help.
