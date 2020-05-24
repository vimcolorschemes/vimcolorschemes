import base64
import math
import os
import re
import sys
import time

from requests.auth import HTTPBasicAuth

from file_helper import decode_file_content
from print_helper import start_sleeping
from request_helper import get

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

ITEMS_PER_PAGE = 100
BASE_URL = "https://api.github.com"

VIM_COLOR_SCHEME_QUERY = "vim color scheme language:vim sort:stars"


GITHUB_BASIC_AUTH = (
    HTTPBasicAuth(GITHUB_USERNAME, GITHUB_TOKEN)
    if GITHUB_USERNAME and GITHUB_TOKEN
    else None
)

REPOSITORY_LIMIT = os.getenv("REPOSITORY_LIMIT")
REPOSITORY_LIMIT = int(REPOSITORY_LIMIT) if REPOSITORY_LIMIT is not None else None

this = sys.modules[__name__]
this.remaining_github_api_calls = None
this.github_api_rate_limit_reset = None


def get_rate_limit():
    rate_limit_path = "rate_limit"
    data, _used_cache = get(f"{BASE_URL}/{rate_limit_path}", auth=GITHUB_BASIC_AUTH)

    this.remaining_github_api_calls = data["resources"]["core"]["remaining"]
    this.github_api_rate_limit_reset = data["resources"]["core"]["reset"]
    print("Github API calls left:", this.remaining_github_api_calls)


def sleep_until_reset():
    while this.remaining_github_api_calls <= 1:
        time_until_reset = this.github_api_rate_limit_reset - int(time.time())
        start_sleeping(time_until_reset + 100)
        get_rate_limit()


# This calls the basic request helper's function get, but also handles the Github API's rate limit check
def github_core_get(url, params=None):
    if (
        this.remaining_github_api_calls is None
        or this.github_api_rate_limit_reset is None
    ):
        get_rate_limit()

    if this.github_api_rate_limit_reset <= 1:
        sleep_until_reset()

    data, used_cache = get(url=url, params=params, auth=GITHUB_BASIC_AUTH)
    if not used_cache:
        this.remaining_github_api_calls = this.remaining_github_api_calls - 1
    print("Github API calls left:", this.remaining_github_api_calls)

    return data


def list_repositories_of_page(query=VIM_COLOR_SCHEME_QUERY, page=1):
    items_per_page = (
        min(REPOSITORY_LIMIT, ITEMS_PER_PAGE)
        if REPOSITORY_LIMIT is not None
        else ITEMS_PER_PAGE
    )
    search_path = "search/repositories"
    base_search_params = {"per_page": items_per_page}

    data = github_core_get(
        url=f"{BASE_URL}/{search_path}",
        params={"q": query, "page": page, **base_search_params},
    )

    repositories = list(map(map_response_item_to_repository, data["items"]))
    total_count = data["total_count"]

    return repositories, total_count


# Fetches github repositories with a defined query.
# If more than 100 repositories, it will search all pages one by one.
def search_repositories():
    repositories = []

    first_page_repositories, total_count = list_repositories_of_page()
    repositories.extend(first_page_repositories)

    fetched_repository_count = (
        min(REPOSITORY_LIMIT, total_count)
        if REPOSITORY_LIMIT is not None
        else total_count
    )
    print(f"{fetched_repository_count} repositories will be fetched")

    page_count = math.ceil(fetched_repository_count / ITEMS_PER_PAGE)

    for page in range(2, page_count + 1):
        (current_page_repositories, total_count) = list_repositories_of_page(page=page)
        repositories.extend(current_page_repositories)

    return repositories, total_count


# Keeps only the stuff we need for the app
def map_response_item_to_repository(response_item):
    return {
        "id": response_item["id"],
        "name": response_item["name"],
        "description": response_item["description"],
        "default_branch": response_item["default_branch"],
        "github_url": response_item["html_url"],
        "homepage_url": response_item["homepage"],
        "stargazers_count": response_item["stargazers_count"],
        "pushed_at": response_item["pushed_at"],
        "owner": {
            "name": response_item["owner"]["login"],
            "avatar_url": response_item["owner"]["avatar_url"],
        },
    }


def list_objects_of_tree(repository, tree_sha):
    tree_path = (
        f"repos/{repository['owner']['name']}/{repository['name']}/git/trees/{tree_sha}"
    )

    data = github_core_get(f"{BASE_URL}/{tree_path}")

    return data["tree"]


def get_latest_commit_at(repository):
    commits_path = f"repos/{repository['owner']['name']}/{repository['name']}/commits"

    commits = github_core_get(f"{BASE_URL}/{commits_path}")

    if not commits or len(commits) == 0:
        return None

    latest_commit_data = commits[0]

    if (
        "commit" in latest_commit_data
        and "author" in latest_commit_data["commit"]
        and "date" in latest_commit_data["commit"]["author"]
    ):
        return latest_commit_data["commit"]["author"]["date"]

    return None


def get_raw_github_image_url(tree_object, repository):
    parent_path = ""
    if (
        "parent_tree_object" in tree_object
        and "path" in tree_object["parent_tree_object"]
    ):
        parent_path = f"{tree_object['parent_tree_object']['path']}/"
    image_path = f"{parent_path}{tree_object['path']}"

    # TODO Investigate a better way to come up with this url
    # without making an additional call
    return f"https://raw.githubusercontent.com/{repository['owner']['name']}/{repository['name']}/{repository['default_branch']}/{image_path}"


def find_image_urls_in_tree_objects(tree_objects, repository):
    image_urls = []
    for object in tree_objects:
        basic_image_regex = r"^.*\.(png|jpe?g|webp)$"
        if re.match(basic_image_regex, object["path"]):
            image_url = get_raw_github_image_url(object, repository)
            image_urls.append(image_url)
    return image_urls


def list_repository_image_urls(repository):
    tree_objects = list_objects_of_tree(repository, repository["default_branch"])

    tree_objects_to_search = tree_objects

    for object in tree_objects:
        if object["type"] == "tree":
            tree_objects_of_tree = list_objects_of_tree(repository, object["sha"])

            tree_objects_of_tree = list(
                map(
                    lambda child_object: {**child_object, "parent_tree_object": object},
                    tree_objects_of_tree,
                )
            )
            tree_objects_to_search.extend(tree_objects_of_tree)

    return find_image_urls_in_tree_objects(tree_objects_to_search, repository)


def get_readme_file(repository):
    owner_name = repository["owner"]["name"]
    name = repository["name"]

    if not owner_name or not name:
        return ""

    get_readme_path = f"repos/{repository['owner']['name']}/{repository['name']}/readme"
    url = f"{BASE_URL}/{get_readme_path}"

    readme_data = github_core_get(url)

    if not readme_data:
        return ""

    return decode_file_content(readme_data["content"])
