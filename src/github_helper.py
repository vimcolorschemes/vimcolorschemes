import base64
import os
import re
import time

from requests.auth import HTTPBasicAuth

from request_helper import get
from file_helper import decode_file_content
from print_helper import start_sleeping

GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

IS_DEV = os.getenv("IS_DEV")

ITEMS_PER_PAGE = 25 if IS_DEV == "True" else 100
BASE_URL = "https://api.github.com"

VIM_COLOR_SCHEME_QUERY = "vim color scheme language:vim sort:stars"


AUTH = (
    HTTPBasicAuth(GITHUB_USERNAME, GITHUB_TOKEN)
    if GITHUB_USERNAME and GITHUB_TOKEN
    else None
)


def list_repositories(query=VIM_COLOR_SCHEME_QUERY, page=1, remaining_calls=0, reset=0):
    search_path = "search/repositories"
    base_search_params = {"per_page": ITEMS_PER_PAGE}

    if remaining_calls <= 1:
        remaining_calls, reset = sleep_until_reset(reset)

    data = get(
        f"{BASE_URL}/{search_path}",
        params={"q": query, "page": page, **base_search_params},
        auth=AUTH,
    )

    remaining_calls = remaining_calls - 1

    repositories = list(map(map_response_item_to_repository, data["items"]))
    total_count = data["total_count"]

    return repositories, total_count, remaining_calls, reset


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


def list_objects_of_tree(repository, tree_sha, remaining_calls, reset):
    tree_path = (
        f"repos/{repository['owner']['name']}/{repository['name']}/git/trees/{tree_sha}"
    )

    if remaining_calls <= 1:
        remaining_calls, reset = sleep_until_reset(reset)

    data = get(f"{BASE_URL}/{tree_path}", auth=AUTH)

    remaining_calls = remaining_calls - 1

    return data["tree"], remaining_calls, reset


def get_latest_commit_at(repository, remaining_calls, reset):
    commits_path = f"repos/{repository['owner']['name']}/{repository['name']}/commits"

    if remaining_calls <= 1:
        remaining_calls, reset = sleep_until_reset(reset)

    commits = get(f"{BASE_URL}/{commits_path}", auth=AUTH)

    remaining_calls = remaining_calls - 1

    if not commits or len(commits) == 0:
        return None, remaining_calls, reset

    latest_commit_data = commits[0]

    if (
        "commit" in latest_commit_data
        and "author" in latest_commit_data["commit"]
        and "date" in latest_commit_data["commit"]["author"]
    ):
        return latest_commit_data["commit"]["author"]["date"], remaining_calls, reset

    return None, remaining_calls, reset


def get_raw_github_image_url(tree_object, repository):
    parent_path = ""
    if (
        "parent_tree_object" in tree_object
        and "path" in tree_object["parent_tree_object"]
    ):
        parent_path = f"{tree_object['parent_tree_object']['path']}/"
    image_path = f"{parent_path}{tree_object['path']}"
    return f"https://raw.githubusercontent.com/{repository['owner']['name']}/{repository['name']}/{repository['default_branch']}/{image_path}"


def find_image_urls_in_tree_objects(tree_objects, repository):
    image_urls = []
    for object in tree_objects:
        basic_image_regex = r"^.*\.(png|jpe?g|webp)$"
        if re.match(basic_image_regex, object["path"]):
            image_url = get_raw_github_image_url(object, repository)
            image_urls.append(image_url)
    return image_urls


def list_repository_image_urls(repository, remaining_calls, reset):
    tree_objects, remaining_calls, reset = list_objects_of_tree(
        repository, repository["default_branch"], remaining_calls, reset
    )

    tree_objects_to_search = tree_objects

    for object in tree_objects:
        if object["type"] == "tree":
            tree_objects_of_tree, remaining_calls, reset = list_objects_of_tree(
                repository, object["sha"], remaining_calls, reset
            )

            tree_objects_of_tree = list(
                map(
                    lambda child_object: {**child_object, "parent_tree_object": object},
                    tree_objects_of_tree,
                )
            )
            tree_objects_to_search.extend(tree_objects_of_tree)

    return (
        find_image_urls_in_tree_objects(tree_objects_to_search, repository),
        remaining_calls,
        reset,
    )


def get_readme_file(repository, remaining_calls, reset):
    owner_name = repository["owner"]["name"]
    name = repository["name"]

    if not owner_name or not name:
        return "", remaining_calls, reset

    get_readme_path = f"repos/{owner_name}/{name}/readme"
    url = f"{BASE_URL}/{get_readme_path}"

    if remaining_calls <= 1:
        remaining_calls, reset = sleep_until_reset(reset)

    data = get(url, auth=AUTH)

    remaining_calls = remaining_calls - 1

    if not data:
        return "", remaining_calls, reset

    return decode_file_content(data["content"]), remaining_calls, reset


def get_rate_limit():
    rate_limit_path = "rate_limit"
    data = get(f"{BASE_URL}/{rate_limit_path}", auth=AUTH)

    remaining_calls = data["resources"]["core"]["remaining"]
    reset = data["resources"]["core"]["reset"]

    print("Remaining calls for Github API:", remaining_calls)

    return remaining_calls, reset


def sleep_until_reset(reset):
    remaining_calls = 1

    while remaining_calls <= 1:
        now = int(time.time())
        time_until_reset = reset - now
        start_sleeping(time_until_reset + 100)
        remaining_calls, reset = get_rate_limit()

    return remaining_calls, reset
