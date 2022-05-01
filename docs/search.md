# The Search API

The Search API is the main actor behing the search feature of vimcolorschemes.

It's a AWS Lambda function built with Golang and has 2 functions:

- [Store](#store)
- [Search](#search)

### Store

#### Request

The Store function is an authenticated POST endpoint that receives a list of repositories used on the App, and stores them in a MongoDB collection. The collection is used as a search index for the search function.

Here's an example of such request:

```json
[
  {
    "name": "example",
    ...
  }
]
```

Once the repositories are indexed, they are ready to be used in the Search function.

### Search

#### Request

The Search function is activated by making a GET request to the API with the following query parameters:

- `query`: The text search query to look for
- `page`: The page for the paginated results
- `perPage`: How many repositories per page of result
- `backgrounds`: Which background should the color schemes match

Here's an example of such request:

```
?query=night&page=1&perPage=10&backgrounds=light,dark
```

#### Response

The function returns a list of the paginated results of the search request, as well as a total count:

```json
{
  "repositories": [
    {
      "name": "example",
      ...
    },
  ],
  "totalCount": 10
}
```
