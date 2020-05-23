# vimcolorschemes
Great and simple page to navigate vim colorschemes

Production environment
[![Netlify Status](https://api.netlify.com/api/v1/badges/5a3dbe27-b79b-4edb-b0bd-1bf3e017182a/deploy-status)](https://app.netlify.com/sites/vimcolorschemes/deploys)

Staging environment
[![Netlify Status](https://api.netlify.com/api/v1/badges/7dc51174-1a21-4713-8b76-75a3e28cbf65/deploy-status)](https://app.netlify.com/sites/vimcolorschemes-dev/deploys)

## Contribute

### Getting started

First, here is the flow of how `vimcolorschemes` works in the `production` environment.

The repository import script is a simple python3 script that queries Github repositories matching some criterias, builds a json object with the needed information from each, and then upload thoses files to an AWS S3 bucket.

The json files are then fetched by the Gatsby app at build time, and the static site is generated.

When you work on the project locally, the files are stored locally, and used by Gatsby at build time. This avoids making a contributor setup an AWS S3 Bucket and pay for it while working on `vimcolorschemes`.

### Work on the import script

#### Requirements:
* pip
`curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py`

* virtualenv
`pip install virtualenv`

When the initial setup is done, you need to create your virtual environment at the project root:
```shell
virtualenv env
```

Then source your virtual env:
```shell
source env/bin/activate
```

Install all project dependencies:
```shell
pip install -r requirements.txt
```

You should be good to go to run the script, but there's a couple things left to talk about.

Github API has a quite short rate limit for unauthenticated calls (60 for core). 
I highly recommend setting up authentication (5000 calls for core) to avoid wait times when you reach the limit.

To do that, you first need to create your personal access token with permissions to read public repositories. Follow instructions on how to do that [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

The last thing you need to do is setup your environment variables.

Create a `.env` file at project root and put them in there like this:
```python
GITHUB_USERNAME="reobin"
export GITHUB_USERNAME

GITHUB_TOKEN="fake_token_blab_bla"
export GITHUB_TOKEN
```
Then source it:
```shell
source .env
```


### Work on the app
The app starts at `./app/`.

To run it and actually see something, you need the repository data stored under `./data/`. If you already have that because you ran the import script, go ahead and skip this paragraph. If not, you can copy all files under `./example-data/` and paste them all to `./data/`.

Now you can `cd` into `./app/`, run `npm install` to install dependencies, and run the app with `gatsby develop`.
