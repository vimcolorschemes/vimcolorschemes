# Installation

## 0. Requirements

- [MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
- [Node.js](https://nodejs.org/en/download/)
- [nvm (recommended)](https://github.com/nvm-sh/nvm)
- A locally cloned fork of [the repository](https://github.com/vimcolorschemes/vimcolorschemes). Check out [how to.](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)

## 1. Set up the local database

1. Make sure mongodb is running locally at port `27017`
   - If using custom configuration, add your own `DATABASE_CONNECTION_STRING` value in `.env.local`
1. Run the seed script: `pnpm seed`
   - The seed script reads `DATABASE_CONNECTION_STRING` from the environment. Running into problems? Check out [mongoimport docs](https://docs.mongodb.com/v4.2/reference/program/mongoimport/) or create an issue.

The script imports the example data at `./database/seed.json` into your local
database.

## 2. Run the app

1. Run `nvm install` (recommended)
1. Run `pnpm install`
1. Run `pnpm dev`
1. Start hacking away.

## Running into problems?

Any trouble trying to make vimcolorschemes work locally? [Create an
issue](https://github.com/vimcolorschemes/vimcolorschemes/issues) and we'll be
happy to help.
