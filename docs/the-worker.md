# The Worker

<p align="center">
  <img src="https://github.com/vimcolorschemes/worker/blob/main/media/logo.png?raw=true" alt="logo" width="400" />
</p>

The worker is an essential part of vimcolorschemes. It manages the data for all the repositories of the app.

## 3 functions

The Worker does 3 things:

- [import repositories](#the-import): Search repositories, update basic info
- [update repositories](#the-update): Get all repositories from the database, fetch advanced info if needed
- [clean them](#the-clean): Get all repositories from the database, clean image URLs

It is currently configured to do both of these things daily to ensure up-to-date, clean data.

After its job is done, the app fetches the data and builds the [vimcolorschemes.com](https://vimcolorschemes.com) that we know.

## The import

The import is simple. It fetches a list of repositories through the GitHub API matching 1 or more queries.

Queries (as of 2020-08-21) are the following:

- `vim color scheme NOT dotfiles sort:stars stars:>0`
- `vim colorscheme NOT dotfiles sort:stars stars:>0`
- `vim colour scheme NOT dotfiles sort:stars stars:>0`
- `vim colourscheme NOT dotfiles sort:stars stars:>0`

Each repository is stored in the database, after cleaning the fields to keep only the ones we need.

Example of a repository at this stage:

```json
{
  "_id": { "$oid": "5f4040c01886e39a30fdc538" },
  "name": "gruvbox",
  "owner": {
    "name": "morhetz",
    "avatar_url": "https://avatars1.githubusercontent.com/u/554231?v=4"
  },
  "default_branch": "master",
  "description": "Retro groove color scheme for Vim",
  "github_created_at": { "$date": "2012-11-28T00:37:31.000Z" },
  "github_id": 6893638,
  "github_url": "https://github.com/morhetz/gruvbox",
  "homepage_url": "",
  "pushed_at": { "$date": "2020-07-28T21:26:50.000Z" },
  "stargazers_count": 7876
}
```

## The update

The update is a sequence of actions resulting in basically adding a bunch of fields to a repository so that it can be used on the website.

### The added fields

Fields hopefully added are:

- `image_urls`: the list of valid image URLs to use
- `last_commit_at`: self-explanatory
- `valid`: `true` if the repository was found to be a valid vim color scheme
- `fetched_at`: last time the repository was properly fetched

### The sequence

Here's some pseudo-code, helping understand how the algorithm updating the repositories does its work:

1. Fetch all repositories from the database
2. For each repository
   1. Fetch the date of the last commit of the default branch
   2. Check if the repository should be fetched \*
      1. Get all repository files
      2. Check if one of them is a vim color scheme
      3. Set the `valid` field \*\*
      4. If valid, go on and fetch all image URLs
         1. Get the readme file
         2. Search the readme file for image URLs
         3. Search the repository file tree for image files
         4. Accumulate the URLs in a list
   3. Upsert the repository in the database
3. Create an report entry in the database

\* The repository is fetched if it is not present in the database, was never fetched before, or if the last commit to the default branch has been made after the last import of the repository.

\*\* The value of `valid` is set to `true` if one of the files found is a vim color scheme, `false` otherwise.

An example of a valid vim color scheme after this stage is:

```json
{
  "_id": { "$oid": "5f4040c01886e39a30fdc538" },
  "name": "gruvbox",
  "owner": {
    "name": "morhetz",
    "avatar_url": "https://avatars1.githubusercontent.com/u/554231?v=4"
  },
  "default_branch": "master",
  "description": "Retro groove color scheme for Vim",
  "github_created_at": { "$date": "2012-11-28T00:37:31.000Z" },
  "github_id": 6893638,
  "github_url": "https://github.com/morhetz/gruvbox",
  "homepage_url": "",
  "pushed_at": { "$date": "2020-07-28T21:26:50.000Z" },
  "stargazers_count": 7876,
  "fetched_at": { "$date": "2020-08-21T17:48:26.439Z" },
  "image_urls": [
    "http://i.imgur.com/GkIl8Fn.png",
    "http://i.imgur.com/X75niEa.png",
    "http://i.imgur.com/wRQceUR.png",
    "http://i.imgur.com/wa666xg.png",
    "http://i.imgur.com/49qKyYW.png",
    "http://i.imgur.com/5MSbe6T.png"
  ],
  "last_commit_at": { "$date": "2020-07-03T12:42:06.000Z" },
  "valid": true,
  "vim_color_scheme_file_paths": ["master/colors/gruvbox.vim"]
}
```

## The clean

The `clean` event goes through all the repositories, and makes sure the images stored with it are not duplicated, and that they are still valid.

To make sure they are valid, a `GET` call is done, and a `200` respone status is expected.
