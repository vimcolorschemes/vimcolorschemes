import math
import os
import re
import sys
import time

from requests.auth import HTTPBasicAuth

from file_helper import decode_file_content, image_url_is_valid
from print_helper import start_sleeping, colors
from request_helper import get

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

ITEMS_PER_PAGE = 100
BASE_URL = "https://api.github.com"

VIM_COLOR_SCHEME_QUERY = "colorscheme OR scheme OR colors language:vim sort:stars"


GITHUB_BASIC_AUTH = (
    HTTPBasicAuth(GITHUB_USERNAME, GITHUB_TOKEN)
    if GITHUB_USERNAME and GITHUB_TOKEN
    else None
)

GITHUB_API_HARD_LIMIT = 1000
REPOSITORY_LIMIT = os.getenv("REPOSITORY_LIMIT")
REPOSITORY_LIMIT = int(REPOSITORY_LIMIT) if REPOSITORY_LIMIT is not None else None
REPOSITORY_LIMIT = min(GITHUB_API_HARD_LIMIT, REPOSITORY_LIMIT)

this = sys.modules[__name__]
this.remaining_github_api_calls = None
this.github_api_rate_limit_reset = None


def get_rate_limit():
    data, used_cache = get(f"{BASE_URL}/rate_limit", auth=GITHUB_BASIC_AUTH)
    print(f"\n{colors.INFO}GET{colors.NORMAL} rate limit (used_cache={used_cache})")
    this.remaining_github_api_calls = data["resources"]["core"]["remaining"]
    this.github_api_rate_limit_reset = data["resources"]["core"]["reset"]
    print(f"{this.remaining_github_api_calls} remaining calls for Github API\n")


def sleep_until_reset():
    while this.remaining_github_api_calls <= 1:
        now = int(time.time())
        time_until_reset = max(0, this.github_api_rate_limit_reset - now)
        safety_buffer = 100
        sleep_time = time_until_reset + safety_buffer
        print(
            f"\n{colors.WARNING}Github API's rate limit reached. Sleeping until for {sleep_time} seconds.{colors.NORMAL}"
        )
        start_sleeping(sleep_time)
        get_rate_limit()


# This calls the basic request helper's function get, but also handles the Github API's rate limit check
def github_core_get(url, params=None, call_name=None):
    if (
        this.remaining_github_api_calls is None
        or this.github_api_rate_limit_reset is None
    ):
        get_rate_limit()

    if this.remaining_github_api_calls <= 1:
        sleep_until_reset()

    data, used_cache = get(url=url, params=params, auth=GITHUB_BASIC_AUTH)
    if call_name:
        print(f"{colors.INFO}GET{colors.NORMAL} {call_name} (used_cache={used_cache})")
    if not used_cache:
        this.remaining_github_api_calls = this.remaining_github_api_calls - 1

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
        call_name=f"repository list page {page}",
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
    print(f"\nMaximum {fetched_repository_count} repositories will be fetched\n")

    page_count = math.ceil(fetched_repository_count / ITEMS_PER_PAGE)

    for page in range(2, page_count + 1):
        current_page_repositories, _total_count = list_repositories_of_page(page=page)
        repositories.extend(current_page_repositories)

    return repositories


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
        "created_at": response_item["created_at"],
        "owner": {
            "name": response_item["owner"]["login"],
            "avatar_url": response_item["owner"]["avatar_url"],
        },
    }


def get_latest_commit_at(repository):
    owner_name = repository["owner"]["name"]
    name = repository["name"]

    commits_path = f"repos/{owner_name}/{name}/commits"

    commits = github_core_get(
        f"{BASE_URL}/{commits_path}", call_name=f"{owner_name}/{name} latest commit at"
    )

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


def find_image_urls_in_tree_objects(tree_objects, repository, image_count_to_find):
    image_urls = []
    for tree_object in tree_objects:
        basic_image_regex = r"^.*\.(png|jpe?g|webp)$"
        if re.match(basic_image_regex, tree_object["path"]):
            image_url = get_raw_github_image_url(tree_object, repository)
            if image_url_is_valid(image_url):
                image_urls.append(image_url)
                if len(image_urls) == image_count_to_find:
                    break
    return image_urls


def list_objects_of_tree(repository, tree_sha, path):
    owner_name = repository["owner"]["name"]
    name = repository["name"]

    tree_path = (
        f"repos/{repository['owner']['name']}/{repository['name']}/git/trees/{tree_sha}"
    )
    data = github_core_get(
        f"{BASE_URL}/{tree_path}",
        call_name=f"{owner_name}/{name} objects of tree {path}",
    )
    return data["tree"]


def get_tree_path(tree_object):
    path = tree_object["path"]
    current_tree = tree_object
    while "parent_tree_object" in current_tree:
        current_tree = current_tree["parent_tree_object"]
        path = f"{current_tree['path']}/{path}"
    return path


def list_repository_image_urls(repository, current_image_count, max_image_count):
    image_count_to_find = max_image_count - current_image_count

    if image_count_to_find <= 0:
        return []

    image_urls = []

    tree_objects = list_objects_of_tree(
        repository, repository["default_branch"], repository["default_branch"]
    )

    image_urls.extend(
        find_image_urls_in_tree_objects(tree_objects, repository, image_count_to_find)
    )

    image_count_to_find = image_count_to_find - len(image_urls)

    for tree_object in tree_objects:
        if image_count_to_find <= 0:
            break

        if tree_object["type"] == "tree":
            tree_objects_of_tree = list_objects_of_tree(
                repository, tree_object["sha"], get_tree_path(tree_object)
            )

            tree_objects_of_tree = list(
                map(
                    lambda child_object: {
                        **child_object,
                        "parent_tree_object": tree_object,
                    },
                    tree_objects_of_tree,
                )
            )

            image_urls.extend(
                find_image_urls_in_tree_objects(
                    tree_objects_of_tree, repository, image_count_to_find
                )
            )

            image_count_to_find = image_count_to_find - len(image_urls)

    return image_urls


def get_readme_file(repository):
    owner_name = repository["owner"]["name"]
    name = repository["name"]

    if not owner_name or not name:
        return ""

    get_readme_path = f"repos/{owner_name}/{name}/readme"

    readme_data = github_core_get(
        f"{BASE_URL}/{get_readme_path}", call_name=f"{owner_name}/{name} readme"
    )

    if not readme_data:
        return ""

    return decode_file_content(readme_data["content"])
